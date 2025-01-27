import {
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import useAppwrite from "@/hooks/useAppwrite";
import { getPostsByUserId, signout } from "@/lib/appwrite";
import { router } from "expo-router";

const Profile = () => {
  const { loggedInUser, setIsLoggedIn, setLoggedInUser } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() =>
    getPostsByUserId(loggedInUser.$id)
  );

  const [refreshing, setRefreching] = useState(false);
  const onRefrech = async () => {
    setRefreching(true);
    await refetch();
    setRefreching(false);
  };

  const logout = async () => {
    await signout();
    setIsLoggedIn(false);
    setLoggedInUser(null);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => {
          return (
            <>
              <View className="w-full justify-center items-center mb-12">
                <TouchableOpacity
                  onPress={() => logout()}
                  className="w-full flex items-end p-6"
                >
                  <Image
                    source={icons.logout}
                    className="w-6 h-6"
                    resizeMode="contain"
                  ></Image>
                </TouchableOpacity>
                <View className="flex items-center">
                  <View className="border border-secondary w-[80px] h-[80px] rounded-[10px] justify-center items-center">
                    <Image
                      className="w-full h-full rounded-[9px]"
                      source={{ uri: loggedInUser?.avatar }}
                      resizeMode="cover"
                    />
                  </View>
                  <View className="w-full flex justify-center items-center">
                    <Text className="text-2xl text-white font-psemibold mt-4">
                      {loggedInUser.username}
                    </Text>
                    <View className="flex flex-row gap-x-10 mt-6">
                      <View className="flex items-center">
                        <Text className="text-white text-2xl font-psemibold">
                          {posts?.length || 0}
                        </Text>
                        <Text className="text-gray-100 text-sm font-pregular">
                          Posts
                        </Text>
                      </View>
                      <View className="flex items-center">
                        <Text className="text-white text-2xl font-psemibold">
                          1.2k
                        </Text>
                        <Text className="text-gray-100 text-sm font-pregular">
                          Views
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefrech} />
        }
      />
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Profile;
