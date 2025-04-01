import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MapPin, Hash, User, Clock, BarChart3 } from "lucide-react-native";

interface MeterDetailsProps {
  address?: string;
  meterId?: string;
  customerName?: string;
  previousReading?: string;
  lastReadDate?: string;
  expectedUsage?: string;
}

const MeterDetails = ({
  address = "123 Main Street, Apt 4B, Cityville",
  meterId = "MTR-2023-45678",
  customerName = "John Smith",
  previousReading = "45678",
  lastReadDate = "15/04/2023",
  expectedUsage = "400-500 kWh",
}: MeterDetailsProps) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Meter Details
      </Text>

      <View className="space-y-2">
        <View className="flex-row items-center">
          <MapPin size={18} color="#4b5563" className="mr-2" />
          <Text className="text-gray-700 flex-1">{address}</Text>
        </View>

        <View className="flex-row items-center">
          <Hash size={18} color="#4b5563" className="mr-2" />
          <Text className="text-gray-700">Meter ID: {meterId}</Text>
        </View>

        <View className="flex-row items-center">
          <User size={18} color="#4b5563" className="mr-2" />
          <Text className="text-gray-700">Customer: {customerName}</Text>
        </View>

        <View className="flex-row items-center">
          <BarChart3 size={18} color="#4b5563" className="mr-2" />
          <Text className="text-gray-700">
            Previous Reading: {previousReading}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Clock size={18} color="#4b5563" className="mr-2" />
          <Text className="text-gray-700">Last Read: {lastReadDate}</Text>
        </View>

        <View className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
          <Text className="text-blue-700 text-sm">
            Expected Usage: {expectedUsage}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MeterDetails;
