import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
  ImageGravity,
} from "react-native-appwrite";

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "",
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM || "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "",
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || "",
  videoCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID || "",
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID || "",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

let client: Client;
let account: Account;
let databases: Databases;
let avatars: Avatars;
let storage: Storage;

client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

account = new Account(client);
avatars = new Avatars(client);
databases = new Databases(client);
storage = new Storage(client);

// Login function
export async function login(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error.message); // Handle errors
  }
}

// Register function
export async function register(
  username: string,
  email: string,
  password: string
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error();

    const avatarUrl = avatars.getInitials(username);
    await login(email, password);

    // create a user in the db(our user model)
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message); // Handle errors
  }
}

export const getCurrentUser = async (): Promise<any> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) return;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error();

    return currentUser.documents[0];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllPosts = async (): Promise<any> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getLatestPosts = async (): Promise<any> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const searchPosts = async (query: string): Promise<any> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const searchSavedPosts = async (query: string): Promise<any> => {
  try {
    const user = await getCurrentUser();

    if (!user.savedPosts || !query) {
      return user.savedPosts;
    }

    const filteredPosts = user.savedPosts.filter((post: any) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );

    return filteredPosts;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const toggleBookmark = async (videoId: string): Promise<any> => {
  try {
    const user = await getCurrentUser();

    const savedPosts = user.savedPosts.some((post: any) => post.$id === videoId)
      ? user.savedPosts
          .filter((post: any) => post.$id !== videoId)
          .map((post: any) => post.$id)
      : [...user.savedPosts, videoId];

    const updatedUser = await databases.updateDocument(
      databaseId,
      userCollectionId,
      user.$id,
      {
        savedPosts: savedPosts,
      }
    );

    return updatedUser;
  } catch (error: any) {
    throw new Error(`Failed to bookmark: ${error.message}`);
  }
};

export const getPostsByUserId = async (id: string): Promise<any> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("user", id),
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const signout = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export async function getFilePreview(fileId: any, type: any) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const uploadFile = async (file: any, type: any) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createVideo = async (form: any): Promise<any> => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        user: form.userId,
      }
    );

    return newPost;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteVideo = async (videoId: string): Promise<any> => {
  try {
    await databases.deleteDocument(databaseId, videoCollectionId, videoId);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
