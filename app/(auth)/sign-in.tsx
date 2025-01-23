import { ScrollView, Text, Image, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Link } from "expo-router";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {};
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "101%" }}>
        <View className="flex items-start justify-center h-full w-full px-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-pbold text-center mt-6">
            Welcome Back!
          </Text>
          <View className="w-full mt-6">
            <FormField
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              handleChangedText={(text) => setForm({ ...form, email: text })}
              keyboardType="email-address"
            />
            <FormField
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              handleChangedText={(text) => setForm({ ...form, password: text })}
            />
          </View>
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="w-full mt-8"
            isLoading={isSubmitting}
          />
          <View className="w-full flex-row justify-center pt-5 gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account ?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
