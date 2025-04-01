import React from "react";
import { View, Text, Image } from "react-native";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

const AppLogo = ({ size = "medium", showText = true }: AppLogoProps) => {
  // Size mapping for the logo
  const sizeMap = {
    small: {
      container: "h-16 w-16",
      image: "h-12 w-12",
      text: "text-lg",
    },
    medium: {
      container: "h-24 w-24",
      image: "h-20 w-20",
      text: "text-xl",
    },
    large: {
      container: "h-32 w-32",
      image: "h-28 w-28",
      text: "text-2xl",
    },
  };

  return (
    <View
      className={`items-center justify-center bg-white ${showText ? "mb-4" : ""}`}
    >
      <View
        className={`items-center justify-center rounded-full bg-blue-100 ${sizeMap[size].container}`}
      >
        <Image
          source={require("../assets/images/icon.png")}
          className={`${sizeMap[size].image}`}
          resizeMode="contain"
        />
      </View>
      {showText && (
        <View className="mt-2">
          <Text className={`font-bold text-blue-800 ${sizeMap[size].text}`}>
            Utility Meter Reader
          </Text>
          <Text className="text-center text-xs text-gray-600">
            Efficient. Accurate. Reliable.
          </Text>
        </View>
      )}
    </View>
  );
};

export default AppLogo;
