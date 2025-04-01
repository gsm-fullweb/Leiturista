import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { User, Menu, WifiOff, Wifi } from "lucide-react-native";

interface HeaderProps {
  title?: string;
  isOnline?: boolean;
  onProfilePress?: () => void;
  onMenuPress?: () => void;
}

const Header = ({
  title = "Utility Meter Reader",
  isOnline = true,
  onProfilePress = () => {},
  onMenuPress = () => {},
}: HeaderProps) => {
  const router = useRouter();

  const handleProfilePress = () => {
    onProfilePress();
    router.push("/profile");
  };

  return (
    <View className="w-full h-14 bg-blue-600 flex-row items-center justify-between px-4 shadow-md">
      <TouchableOpacity onPress={onMenuPress} className="p-2">
        <Menu size={24} color="white" />
      </TouchableOpacity>

      <Text className="text-white font-bold text-lg">{title}</Text>

      <View className="flex-row items-center space-x-3">
        {isOnline ? (
          <Wifi size={18} color="white" />
        ) : (
          <WifiOff size={18} color="white" />
        )}

        <TouchableOpacity onPress={handleProfilePress} className="p-2">
          <User size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
