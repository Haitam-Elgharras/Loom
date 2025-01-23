import { Text, Image, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  handleChangedText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"; // Define valid keyboard types
}

const FormField = ({
  label,
  placeholder,
  value,
  handleChangedText,
  otherStyles,
  keyboardType,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`${otherStyles} space-y-2`}>
      <Text className="text-gray-100 text-base font-pmedium">{label}</Text>
      <View className="relative bg-[#1e1e2d] flex-row items-center rounded-2xl px-4 w-full border-2 border-black-200">
        <TextInput
          className="py-4 text-white font-psemibold w-full"
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          value={value}
          autoCapitalize="none"
          onChangeText={handleChangedText}
          secureTextEntry={label === "Password" && !showPassword}
          keyboardType={keyboardType}
        />
        {label == "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
