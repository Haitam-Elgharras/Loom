import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Animatable from "react-native-animatable";
import { Video as VideoType } from "./VideoCard";
import { icons, images } from "@/constants";

interface Props {
  posts: VideoType[];
}

interface TrendingItemProps {
  activeItem: VideoType | null;
  item: VideoType;
  onPlay: (activeVideo: VideoType) => void;
}

const TrendingItem = ({ activeItem, item, onPlay }: TrendingItemProps) => {
  const [play, setPlay] = useState(false);
  const isActive = activeItem?.$id === item.$id;

  const player = useVideoPlayer(item.video, (player) => {
    player.pause();
    player.loop = true;
  });

  useEffect(() => {
    if (!player) return;

    if (play) {
      player.play();
      onPlay(item);
    } else {
      // player.replay();
      player.pause();
    }
  }, [play, player]);

  useEffect(() => {
    if (!isActive && play) {
      setPlay(false);
    }
  }, [isActive, play]);

  return (
    <Animatable.View
      className="mr-5"
      animation={
        isActive
          ? {
              0: { transform: [{ scale: 0.9 }] },
              1: { transform: [{ scale: 1.1 }] },
            }
          : {
              0: { transform: [{ scale: 0.9 }] },
              1: { transform: [{ scale: 0.9 }] },
            }
      }
      duration={500}
    >
      {play ? (
        <VideoView
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls
          contentFit="cover"
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            player.play();
          }}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: Props) => {
  const [activeItem, setActiveItem] = useState<VideoType | null>(null);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ item: VideoType }>;
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item);
    }
  };

  const handlePlay = (activeVideo: VideoType) => {
    setActiveItem(activeVideo);
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} onPlay={handlePlay} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 150, y: 0 }}
      ListEmptyComponent={() => {
        return (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg">No trending videos found</Text>
          </View>
        );
      }}
    />
  );
};

export default Trending;
