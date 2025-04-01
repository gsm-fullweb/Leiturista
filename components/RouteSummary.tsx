import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Check, Clock, MapPin, AlertTriangle } from "lucide-react-native";

interface RouteSummaryProps {
  routeName?: string;
  totalAddresses?: number;
  completedVisits?: number;
  skippedLocations?: number;
  timeTaken?: string;
  completionPercentage?: number;
}

const RouteSummary = ({
  routeName = "Downtown Route #42",
  totalAddresses = 24,
  completedVisits = 22,
  skippedLocations = 2,
  timeTaken = "3h 45m",
  completionPercentage = 92,
}: RouteSummaryProps) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-md w-full">
      <Text className="text-xl font-bold text-gray-800 mb-2">
        {routeName} Summary
      </Text>

      <View className="bg-gray-100 p-3 rounded-md mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-700 font-medium">Completion Rate:</Text>
          <Text className="text-lg font-bold text-blue-600">
            {completionPercentage}%
          </Text>
        </View>
        <View className="h-3 bg-gray-300 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </View>
      </View>

      <View className="space-y-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
            <MapPin size={18} color="#16a34a" />
          </View>
          <Text className="text-gray-700">Total Addresses:</Text>
          <Text className="ml-auto font-bold text-gray-800">
            {totalAddresses}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Check size={18} color="#2563eb" />
          </View>
          <Text className="text-gray-700">Completed Visits:</Text>
          <Text className="ml-auto font-bold text-gray-800">
            {completedVisits}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-3">
            <AlertTriangle size={18} color="#d97706" />
          </View>
          <Text className="text-gray-700">Skipped Locations:</Text>
          <Text className="ml-auto font-bold text-gray-800">
            {skippedLocations}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
            <Clock size={18} color="#7c3aed" />
          </View>
          <Text className="text-gray-700">Time Taken:</Text>
          <Text className="ml-auto font-bold text-gray-800">{timeTaken}</Text>
        </View>
      </View>

      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-sm text-gray-500 text-center">
          Route completed on {new Date().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default RouteSummary;
