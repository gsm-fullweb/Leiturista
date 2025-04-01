import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin, CheckCircle, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";

interface RouteCardProps {
  id: string;
  name: string;
  completedAddresses: number;
  totalAddresses: number;
  estimatedTime: string;
  isActive?: boolean;
}

const RouteCard = ({
  id = "1",
  name = "Downtown Route",
  completedAddresses = 0,
  totalAddresses = 12,
  estimatedTime = "2 hours",
  isActive = false,
}: RouteCardProps) => {
  const router = useRouter();
  const completionPercentage = Math.round(
    (completedAddresses / totalAddresses) * 100,
  );

  const handleRoutePress = () => {
    router.push(`/route/${id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleRoutePress}
      className={`bg-white rounded-lg p-4 mb-3 shadow-sm border ${isActive ? "border-blue-500" : "border-gray-200"}`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <MapPin size={18} color="#3b82f6" />
          <Text className="text-lg font-semibold ml-2">{name}</Text>
        </View>
        <View className="bg-gray-100 px-2 py-1 rounded">
          <Text className="text-sm text-gray-700">
            {completionPercentage}% Complete
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row items-center">
          <CheckCircle size={16} color="#10b981" />
          <Text className="ml-2 text-gray-700">
            {completedAddresses}/{totalAddresses} Addresses
          </Text>
        </View>

        <View className="flex-row items-center">
          <Clock size={16} color="#6b7280" />
          <Text className="ml-1 text-gray-600">{estimatedTime}</Text>
        </View>
      </View>

      <View className="mt-3 bg-gray-200 h-2 rounded-full overflow-hidden">
        <View
          className="bg-blue-500 h-full rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </View>

      <View className="mt-3">
        <TouchableOpacity
          className={`py-2 px-4 rounded-md ${completedAddresses === totalAddresses ? "bg-green-500" : completedAddresses > 0 ? "bg-blue-500" : "bg-indigo-500"}`}
          onPress={handleRoutePress}
        >
          <Text className="text-white text-center font-medium">
            {completedAddresses === totalAddresses
              ? "View Summary"
              : completedAddresses > 0
                ? "Continue Route"
                : "Start Route"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default RouteCard;
