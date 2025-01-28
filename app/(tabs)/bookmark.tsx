import { FlatList, RefreshControl, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchSavedPosts } from "@/lib/appwrite";
import useAppwrite from "@/hooks/useAppwrite";
import VideoCard, { Video } from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";

const Bookmark = () => {
  const [query, setQuery] = useState("");

  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite<Video[]>(() => searchSavedPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  const [refreshing, setRefreching] = useState(false);

  const onRefrech = async () => {
    setRefreching(true);
    await refetch();
    setRefreching(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => {
          return (
            <View className="flex px-4 mb-10">
              <Text className="text-2xl text-white font-psemibold my-6">
                Saved Videos
              </Text>
              <SearchInput
                placeholder="Search your saved videos"
                value={query}
                handleSearch={setQuery}
              />
            </View>
          );
        }}
        ListEmptyComponent={() =>
          isLoading ? (
            <Text className="text-white">Loading...</Text>
          ) : (
            <EmptyState
              title="No Videos Found"
              subtitle={
                query == ""
                  ? "You haven't save a video yet"
                  : "No videos found for this search query"
              }
            />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefrech} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
