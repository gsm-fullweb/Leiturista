import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import {
  AlertTriangle,
  MapPin,
  AlertCircle,
  ChevronRight,
} from "lucide-react-native";

type Issue = {
  id: string;
  address: string;
  type: "inaccessible" | "error" | "customer";
  description: string;
  timestamp: string;
  resolved: boolean;
};

type IssuesListProps = {
  issues: Issue[];
  onIssuePress?: (issue: Issue) => void;
};

const getIssueIcon = (type: Issue["type"]) => {
  switch (type) {
    case "inaccessible":
      return <MapPin size={24} color="#ef4444" />;
    case "error":
      return <AlertTriangle size={24} color="#f59e0b" />;
    case "customer":
      return <AlertCircle size={24} color="#3b82f6" />;
    default:
      return <AlertTriangle size={24} color="#ef4444" />;
  }
};

const getIssueTitle = (type: Issue["type"]) => {
  switch (type) {
    case "inaccessible":
      return "Inaccessible Meter";
    case "error":
      return "Reading Error";
    case "customer":
      return "Customer Concern";
    default:
      return "Issue";
  }
};

const IssuesList = ({
  issues = mockIssues,
  onIssuePress = (issue) => {
    Alert.alert(
      "Issue Details",
      `${issue.description}\n\nLocation: ${issue.address}\nReported: ${issue.timestamp}`,
    );
  },
}: IssuesListProps) => {
  return (
    <View className="bg-white rounded-lg shadow-sm p-4 w-full">
      <Text className="text-lg font-bold mb-4">
        Issues Encountered ({issues.length})
      </Text>

      {issues.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-gray-500 text-center">
            No issues reported for this route
          </Text>
        </View>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`flex-row items-center p-3 mb-2 border-b border-gray-100 ${item.resolved ? "opacity-60" : ""}`}
              onPress={() => onIssuePress(item)}
            >
              <View className="mr-3">{getIssueIcon(item.type)}</View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-base">
                    {getIssueTitle(item.type)}
                  </Text>
                  {item.resolved && (
                    <View className="bg-green-100 px-2 py-1 rounded">
                      <Text className="text-green-800 text-xs">Resolved</Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
                  {item.description}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {item.address} • {item.timestamp}
                </Text>
              </View>
              <ChevronRight size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
          className="max-h-[400px]"
        />
      )}
    </View>
  );
};

// Mock data for default display
const mockIssues: Issue[] = [
  {
    id: "1",
    address: "123 Main St, Apt 4B",
    type: "inaccessible",
    description: "Meter located behind locked gate. No access code provided.",
    timestamp: "10:32 AM",
    resolved: false,
  },
  {
    id: "2",
    address: "456 Oak Ave",
    type: "error",
    description: "Meter display damaged, unable to read digits clearly.",
    timestamp: "11:45 AM",
    resolved: true,
  },
  {
    id: "3",
    address: "789 Pine Rd",
    type: "customer",
    description: "Customer disputed previous reading, requested verification.",
    timestamp: "1:15 PM",
    resolved: false,
  },
  {
    id: "4",
    address: "234 Elm St",
    type: "inaccessible",
    description: "Large dog in yard prevented access to meter location.",
    timestamp: "2:20 PM",
    resolved: false,
  },
];

export default IssuesList;
