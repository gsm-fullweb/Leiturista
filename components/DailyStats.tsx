import React from "react";
import { View, Text } from "react-native";
import {
  BarChart,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react-native";

interface DailyStatsProps {
  completedReadings?: number;
  pendingReadings?: number;
  averageTimePerReading?: number;
  issuesReported?: number;
  efficiencyRate?: number;
}

const DailyStats = ({
  completedReadings = 24,
  pendingReadings = 8,
  averageTimePerReading = 3.5,
  issuesReported = 2,
  efficiencyRate = 85,
}: DailyStatsProps) => {
  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-sm">
      <View className="flex-row items-center mb-4">
        <BarChart size={20} color="#3b82f6" />
        <Text className="text-lg font-bold ml-2 text-gray-800">
          Daily Statistics
        </Text>
      </View>

      <View className="flex-row justify-between mb-4">
        <View className="flex-1 bg-blue-50 p-3 rounded-lg mr-2">
          <View className="flex-row items-center mb-1">
            <CheckCircle size={16} color="#3b82f6" />
            <Text className="text-sm font-medium ml-1 text-gray-700">
              Completed
            </Text>
          </View>
          <Text className="text-xl font-bold text-blue-600">
            {completedReadings}
          </Text>
          <Text className="text-xs text-gray-500">meter readings</Text>
        </View>

        <View className="flex-1 bg-amber-50 p-3 rounded-lg ml-2">
          <View className="flex-row items-center mb-1">
            <Clock size={16} color="#f59e0b" />
            <Text className="text-sm font-medium ml-1 text-gray-700">
              Pending
            </Text>
          </View>
          <Text className="text-xl font-bold text-amber-600">
            {pendingReadings}
          </Text>
          <Text className="text-xs text-gray-500">meter readings</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1 bg-green-50 p-3 rounded-lg mr-2">
          <View className="flex-row items-center mb-1">
            <Clock size={16} color="#10b981" />
            <Text className="text-sm font-medium ml-1 text-gray-700">
              Avg. Time
            </Text>
          </View>
          <Text className="text-xl font-bold text-green-600">
            {averageTimePerReading}
          </Text>
          <Text className="text-xs text-gray-500">minutes per reading</Text>
        </View>

        <View className="flex-1 bg-red-50 p-3 rounded-lg ml-2">
          <View className="flex-row items-center mb-1">
            <AlertTriangle size={16} color="#ef4444" />
            <Text className="text-sm font-medium ml-1 text-gray-700">
              Issues
            </Text>
          </View>
          <Text className="text-xl font-bold text-red-600">
            {issuesReported}
          </Text>
          <Text className="text-xs text-gray-500">reported today</Text>
        </View>
      </View>

      <View className="mt-4 bg-gray-100 rounded-lg p-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm font-medium text-gray-700">
            Efficiency Rate
          </Text>
          <Text className="text-sm font-bold text-blue-600">
            {efficiencyRate}%
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${efficiencyRate}%` }}
          />
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          Based on completed readings vs. time spent
        </Text>
      </View>
    </View>
  );
};

export default DailyStats;
