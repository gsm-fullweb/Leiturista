import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import LoginForm from "../components/LoginForm";
import AppLogo from "../components/AppLogo";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      // This would be replaced with actual authentication check
      // For example, checking if a valid token exists in secure storage
      const isLoggedIn = false; // For demo purposes

      if (isLoggedIn) {
        router.replace("/dashboard");
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoading(true);
    // This would handle any post-login operations
    // Such as fetching initial data, etc.
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6 py-12">
            <View className="w-full max-w-sm items-center mb-8">
              <AppLogo size="large" showText={true} />
            </View>

            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              isLoading={isLoading}
            />

            <View className="mt-8 items-center">
              <Text className="text-sm text-gray-500">Versão 1.0.0</Text>
              <Text className="text-xs text-gray-400 mt-1">
                © 2023 Utility Meter Reader
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
