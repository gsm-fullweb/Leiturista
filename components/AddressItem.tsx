import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react-native";

interface AddressItemProps {
  address: string;
  streetName?: string;
  houseNumber?: string;
  completed?: boolean;
  hasIssue?: boolean;
  onPress?: () => void;
  onNavigate?: () => void;
}

const AddressItem = ({
  address = "123 Main Street",
  streetName = "Main Street",
  houseNumber = "123",
  completed = false,
  hasIssue = false,
  onPress = () => {},
  onNavigate = () => {},
}: AddressItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-2 shadow-sm border border-gray-100 flex-row items-center justify-between"
    >
      <View className="flex-row items-center flex-1">
        <View className="bg-blue-50 rounded-full p-2 mr-3">
          <MapPin size={20} color="#3b82f6" />
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 font-medium text-base">{address}</Text>
          <Text className="text-gray-500 text-sm">
            {streetName}, {houseNumber}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        {completed && (
          <View className="mr-2">
            <CheckCircle size={18} color="#10b981" />
          </View>
        )}

        {hasIssue && (
          <View className="mr-2">
            <AlertCircle size={18} color="#f59e0b" />
          </View>
        )}

        <TouchableOpacity
          onPress={onNavigate}
          className="bg-blue-500 rounded-full p-2"
        >
          <ChevronRight size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default AddressItem;
