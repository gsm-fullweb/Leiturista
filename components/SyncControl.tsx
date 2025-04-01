import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Check,
  AlertTriangle,
} from "lucide-react-native";
import { getPendingReadings } from "../utils/storage";
import { syncPendingReadings, checkOnlineStatus } from "../utils/syncService";

interface SyncControlProps {
  routeId?: string;
  syncStatus?: "online" | "offline" | "syncing" | "completed" | "error";
  lastSyncTime?: string;
  pendingUploads?: number;
  onSyncPress?: () => void;
  onStatusChange?: (
    status: "online" | "offline" | "syncing" | "completed" | "error",
  ) => void;
  onPendingCountChange?: (count: number) => void;
}

const SyncControl = ({
  routeId = "1234",
  syncStatus = "online",
  lastSyncTime = "10:30 AM",
  pendingUploads = 5,
  onSyncPress = () => console.log("Sync pressed"),
  onStatusChange,
  onPendingCountChange,
}: SyncControlProps) => {
  const [progress, setProgress] = useState(0);

  // Check for pending readings on mount
  useEffect(() => {
    const checkPendingReadings = async () => {
      const readings = await getPendingReadings();
      const pendingCount = readings.filter(
        (r) => r.syncStatus === "pending",
      ).length;
      if (pendingCount !== pendingUploads) {
        // Update parent component with actual count
        if (onPendingCountChange) {
          onPendingCountChange(pendingCount);
        }
      }
    };

    checkPendingReadings();

    // Also check online status
    const checkConnection = async () => {
      const isOnline = await checkOnlineStatus();
      if (syncStatus !== "syncing") {
        if (isOnline) {
          if (syncStatus === "offline") {
            if (onStatusChange) onStatusChange("online");
          }
        } else {
          if (syncStatus !== "offline") {
            if (onStatusChange) onStatusChange("offline");
          }
        }
      }
    };

    checkConnection();
    const connectionInterval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(connectionInterval);
  }, []);

  useEffect(() => {
    if (syncStatus === "syncing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [syncStatus]);

  const renderNetworkIcon = () => {
    switch (syncStatus) {
      case "online":
        return <Wifi size={24} color="#10b981" />;
      case "offline":
        return <WifiOff size={24} color="#ef4444" />;
      case "syncing":
        return <RefreshCw size={24} color="#3b82f6" className="animate-spin" />;
      case "completed":
        return <Check size={24} color="#10b981" />;
      case "error":
        return <AlertTriangle size={24} color="#f59e0b" />;
      default:
        return <Wifi size={24} color="#10b981" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case "online":
        return "Connected";
      case "offline":
        return "Offline";
      case "syncing":
        return "Syncing...";
      case "completed":
        return "Sync Complete";
      case "error":
        return "Sync Error";
      default:
        return "Connected";
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case "online":
        return "text-green-500";
      case "offline":
        return "text-red-500";
      case "syncing":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "error":
        return "text-amber-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-md w-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Sync Status</Text>
        <View className="flex-row items-center">
          {renderNetworkIcon()}
          <Text className={`ml-2 font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Sync Info */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Last Sync:</Text>
          <Text className="font-medium">{lastSyncTime}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Pending Uploads:</Text>
          <Text className="font-medium">{pendingUploads} items</Text>
        </View>
      </View>

      {/* Progress Bar (visible only when syncing) */}
      {syncStatus === "syncing" && (
        <View className="mb-4">
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-center text-sm text-gray-500 mt-1">
            {progress}% Complete
          </Text>
        </View>
      )}

      {/* Sync Button */}
      <TouchableOpacity
        className={`py-3 px-4 rounded-lg flex-row justify-center items-center ${syncStatus === "offline" ? "bg-gray-300" : "bg-blue-500"}`}
        onPress={onSyncPress}
        disabled={syncStatus === "offline" || syncStatus === "syncing"}
      >
        {syncStatus === "syncing" ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <RefreshCw size={20} color="#ffffff" />
        )}
        <Text className="text-white font-medium ml-2">
          {syncStatus === "syncing" ? "Syncing..." : "Sync Now"}
        </Text>
      </TouchableOpacity>

      {/* Error Message */}
      {syncStatus === "error" && (
        <View className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <Text className="text-amber-700 text-sm">
            Sync failed. Please check your connection and try again.
          </Text>
        </View>
      )}

      {/* Offline Message */}
      {syncStatus === "offline" && (
        <View className="mt-3 p-2 bg-gray-100 border border-gray-200 rounded-md">
          <Text className="text-gray-700 text-sm">
            You're currently offline. Data will sync automatically when
            connection is restored.
          </Text>
        </View>
      )}
    </View>
  );
};

export default SyncControl;
