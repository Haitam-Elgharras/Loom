import { ScrollView, Text, Image, View, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Link, router } from "expo-router";
import { getCurrentUser, login } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
  const { setLoggedInUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(form.email, form.password);

      const user = await getCurrentUser();
      setLoggedInUser(user);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
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
