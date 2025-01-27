import { FlatList, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/hooks/useAppwrite";
import VideoCard, { Video } from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";

const Search = () => {
  const { query } = useLocalSearchParams();

  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite<Video[]>(() => searchPosts(query.toString()));

  useEffect(() => {
    refetch();
  }, [query.toString()]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => {
          return (
            <View className="flex my-6 px-4 mb-10">
              <View className="flex flex-row justify-between items-start mb-6">
                <View>
                  <Text className="text-gray-100 text-sm font-pmedium">
                    Search results
                  </Text>
                  <Text className="text-2xl text-white font-psemibold">
                    {query}
                  </Text>
                </View>
              </View>
              <SearchInput
                placeholder="Search for a video topic"
                value={query.toString()}
              />
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
