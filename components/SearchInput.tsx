import { Text, Image, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

interface Props {
  placeholder: string;
  value?: string;
  handleSearch?: (query: string) => void;
}

const SearchInput = ({ placeholder, value, handleSearch }: Props) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(value || "");
  return (
    <View className="relative bg-[#1e1e2d] flex-row items-center rounded-2xl px-4 w-full border-2 border-black-200 space-x-4">
      <TextInput
        className="py-4 text-white text-base font-pregular mt-0.5 flex-1 w-full"
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        value={query}
        autoCapitalize="none"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) return;

          if (pathname.startsWith("/search")) router.setParams({ query });
          else if (handleSearch) handleSearch(query);
          else router.push(`/search/${query}`);
        }}
        className="absolute right-5"
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
