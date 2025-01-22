import { TouchableOpacity, Text } from "react-native";
import React from "react";
import { isLoading } from "expo-font";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  textStyles?: string;
  containerStyles?: string;
  isLoading?: Boolean;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  isLoading,
  textStyles,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading ? true : false}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
