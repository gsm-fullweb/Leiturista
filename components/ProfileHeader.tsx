import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { User } from "lucide-react-native";

interface ProfileHeaderProps {
  userName?: string;
  userId?: string;
  role?: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
}

const ProfileHeader = ({
  userName = "John Doe",
  userId = "MR-12345",
  role = "Meter Reader",
  avatarUrl,
  onEditProfile = () => console.log("Edit profile pressed"),
}: ProfileHeaderProps) => {
  return (
    <View className="w-full bg-blue-50 p-4 rounded-lg shadow-sm">
      <View className="flex-row items-center">
        <View className="h-20 w-20 rounded-full bg-blue-100 mr-4 overflow-hidden justify-center items-center">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <User size={40} color="#3b82f6" />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-xl font-bold text-blue-900">{userName}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-blue-700 font-medium">
              ID: {userId}
            </Text>
            <View className="h-4 w-4 rounded-full bg-green-500 ml-2" />
            <Text className="text-xs text-green-700 ml-1">Active</Text>
          </View>
          <Text className="text-sm text-gray-600 mt-1">{role}</Text>
        </View>

        <TouchableOpacity
          onPress={onEditProfile}
          className="bg-blue-500 px-3 py-2 rounded-md"
        >
          <Text className="text-white font-medium">Edit</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-4 pt-4 border-t border-blue-100">
        <View className="items-center">
          <Text className="text-lg font-bold text-blue-800">24</Text>
          <Text className="text-xs text-gray-600">Today's Readings</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-blue-800">98%</Text>
          <Text className="text-xs text-gray-600">Accuracy</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-blue-800">142</Text>
          <Text className="text-xs text-gray-600">Weekly Total</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
