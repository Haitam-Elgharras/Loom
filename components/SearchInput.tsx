import { Text, Image, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

interface Props {
  placeholder: string;
  value: string;
  handleChangedText: (text: string) => void;
}

const SearchInput = ({ placeholder, value, handleChangedText }: Props) => {
  return (
    <View className="relative bg-[#1e1e2d] flex-row items-center rounded-2xl px-4 w-full border-2 border-black-200 space-x-4">
      <TextInput
        className="py-4 text-white text-base font-pregular mt-0.5 flex-1 w-full"
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        value={value}
        autoCapitalize="none"
        onChangeText={handleChangedText}
      />
      <TouchableOpacity className="absolute right-5">
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
