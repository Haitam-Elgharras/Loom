import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { icons, images } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";

// Track both player and its state setter
let currentPlayer: { player: any; setPlay: (play: boolean) => void } | null =
  null;

export interface Creator {
  username: string;
  avatar: string;
}

export interface Video {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  user: Creator;
}

interface Props {
  video: Video;
}

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    user: { username, avatar },
  },
}: Props) => {
  const [play, setPlay] = useState(false);
  const player = useVideoPlayer(images.blossom, (player) => {
    player.pause();
    player.loop = true;
  });
  const playerRef = useRef(player);
  const setPlayRef = useRef(setPlay);

  useEffect(() => {
    const handlePlayback = () => {
      if (play) {
        if (currentPlayer && currentPlayer.player !== playerRef.current) {
          currentPlayer.setPlay(false);
          currentPlayer.player.pause();
        }

        currentPlayer = {
          player: playerRef.current,
          setPlay: setPlayRef.current,
        };

        player.play();
      } else {
        if (currentPlayer?.player === player) {
          currentPlayer = null;
        }
      }
    };

    handlePlayback();
  }, [play]);

  return (
    <View className="items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="flex-row justify-center items-center flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-sm font-psemibold text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <VideoView
          className="w-full h-60 rounded-xl mt-3"
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls
          contentFit="contain"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
