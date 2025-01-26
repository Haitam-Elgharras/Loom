import { Text, View, Image, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";

const Home = () => {
  const { loggedInUser } = useGlobalContext();

  const [refreshing, setRefreching] = useState(false);
  const onRefrech = async () => {
    setRefreching(true);
    // re call videos to see if any new videos appeard
    setRefreching(false);
  };
  return (
    <>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={[{ id: 1 }, { id: 2 }]}
          // data={[]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text className="text-3xl text-white">{item.id}</Text>
          )}
          ListHeaderComponent={() => {
            const [searchQuery, setSearchQuery] = useState("");

            return (
              <View className="flex my-6 px-4 space-y-6">
                <View className="flex flex-row justify-between items-start mb-6">
                  <View>
                    <Text className="text-gray-100 text-sm font-pmedium">
                      Welcome Back
                    </Text>
                    <Text className="text-2xl text-white font-psemibold">
                      {loggedInUser.username}
                    </Text>
                  </View>
                  <View className="mt-1.5">
                    <Image
                      source={images.logoSmall}
                      className="w-9 h-10"
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <SearchInput
                  placeholder="Search for a video topic"
                  value={searchQuery}
                  handleChangedText={(text) => setSearchQuery(text)}
                />

                <View className="w-full flex-1 pt-5 pb-5">
                  <Text className="text-gray-100 text-lg font-pregular mb-3">
                    Latest Videos
                  </Text>
                  <Trending posts={[{ id: 1 }, { id: 2 }, { id: 3 }]} />
                </View>
              </View>
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
      </SafeAreaView>
    </>
  );
};

export default Home;
