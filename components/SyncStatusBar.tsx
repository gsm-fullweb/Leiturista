import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Wifi, WifiOff, Clock, Upload, RefreshCw } from "lucide-react-native";

interface SyncStatusBarProps {
  isOnline?: boolean;
  lastSyncTime?: string;
  pendingUploads?: number;
  onSyncPress?: () => void;
}

const SyncStatusBar = ({
  isOnline = true,
  lastSyncTime = "10:30 AM",
  pendingUploads = 0,
  onSyncPress = () => {},
}: SyncStatusBarProps) => {
  return (
    <View className="w-full h-10 bg-slate-100 border-b border-slate-200 px-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        {isOnline ? (
          <Wifi size={16} className="text-green-600" color="#16a34a" />
        ) : (
          <WifiOff size={16} className="text-red-600" color="#dc2626" />
        )}
        <Text className="ml-2 text-sm text-slate-700">
          {isOnline ? "Online" : "Offline"}
        </Text>
      </View>

      <View className="flex-row items-center">
        <Clock size={14} className="text-slate-500" color="#64748b" />
        <Text className="ml-1 text-xs text-slate-500">
          Last sync: {lastSyncTime}
        </Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center"
        onPress={onSyncPress}
        disabled={!isOnline}
      >
        {pendingUploads > 0 ? (
          <>
            <Upload size={14} className="text-amber-500" color="#f59e0b" />
            <Text className="ml-1 text-xs text-amber-500">
              {pendingUploads} pending
            </Text>
          </>
        ) : (
          <>
            <RefreshCw size={14} className="text-blue-500" color="#3b82f6" />
            <Text className="ml-1 text-xs text-blue-500">Sync now</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SyncStatusBar;
