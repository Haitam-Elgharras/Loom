import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";

import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { ImagePickerAsset } from "expo-image-picker";

type formData = {
  title: string;
  video: ImagePickerAsset;
  thumbnail: ImagePickerAsset;
  prompt: string;
};

const Create = () => {
  const { loggedInUser } = useGlobalContext();
  const [uploading, setUploading] = useState(false);

  const [form, setform] = useState({} as formData);

  const player = useVideoPlayer(form?.video?.uri || "", (player) => {
    player.pause();
  });

  const openPicker = async (selectType: string) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? "images" : "videos",
      aspect: [4, 3],
      quality: 1,
    });

    if (!res.canceled) {
      if (selectType === "image")
        setform({ ...form, thumbnail: res.assets[0] });

      if (selectType === "video") setform({ ...form, video: res.assets[0] });
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.title || !form.video || !form.thumbnail)
      return Alert.alert("Please fill in all the fields");

    setUploading(true);
    try {
      await createVideo({ ...form, userId: loggedInUser.$id });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setform({} as formData);
      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          label="Video Title"
          value={form.title}
          placeholder="Give your video a catch title ..."
          handleChangedText={(input) => setform({ ...form, title: input })}
          otherStyles="mt-7"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <VideoView
                className="w-full h-64 rounded-2xl"
                player={player}
                nativeControls={false}
                contentFit="contain"
              />
            ) : (
              <View className="w-full h-40 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="contain"
              />
            ) : (
              <View className="w-full h-16 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          label="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangedText={(input) => setform({ ...form, prompt: input })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({});
