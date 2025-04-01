import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { default as SliderFallback } from "@react-native-community/slider";
import {
  LogOut,
  Wifi,
  Database,
  Camera,
  Bell,
  Moon,
  RefreshCw,
} from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

interface AppSettingsProps {
  onLogout?: () => void;
  syncFrequency?: number;
  dataSavingMode?: boolean;
  darkMode?: boolean;
  cameraResolution?: "low" | "medium" | "high";
  notificationsEnabled?: boolean;
  autoSync?: boolean;
  onDarkModeChange?: (value: boolean) => void;
}

// Use dynamic import for Slider to avoid SSR issues
const Slider =
  Platform.OS === "web" && typeof window === "undefined"
    ? () => null
    : SliderFallback;

const AppSettings = ({
  onLogout = () => console.log("Logout pressed"),
  syncFrequency = 15,
  dataSavingMode = false,
  darkMode,
  cameraResolution = "medium",
  notificationsEnabled = true,
  autoSync = true,
  onDarkModeChange,
}: AppSettingsProps) => {
  const { isDarkMode, setDarkMode } = useTheme();
  const [localSyncFrequency, setLocalSyncFrequency] = useState(syncFrequency);
  const [localDataSavingMode, setLocalDataSavingMode] =
    useState(dataSavingMode);
  const [localCameraResolution, setLocalCameraResolution] =
    useState(cameraResolution);
  const [localNotificationsEnabled, setLocalNotificationsEnabled] =
    useState(notificationsEnabled);
  const [localAutoSync, setLocalAutoSync] = useState(autoSync);

  // Use the theme context's dark mode value or the prop if provided
  const currentDarkMode = darkMode !== undefined ? darkMode : isDarkMode;

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    if (onDarkModeChange) {
      onDarkModeChange(value);
    }
  };

  return (
    <ScrollView
      className={`flex-1 p-4 ${isDarkMode ? "bg-dark-surface" : "bg-white"}`}
    >
      <Text
        className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-dark-text" : "text-gray-800"}`}
      >
        App Settings
      </Text>

      {/* Sync Settings */}
      <View className="mb-6">
        <Text
          className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
        >
          Synchronization
        </Text>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <RefreshCw size={20} color={isDarkMode ? "#BB86FC" : "#4b5563"} />
            <Text
              className={`ml-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Auto Sync
            </Text>
          </View>
          <Switch
            value={localAutoSync}
            onValueChange={setLocalAutoSync}
            trackColor={{
              false: isDarkMode ? "#2C2C2C" : "#d1d5db",
              true: isDarkMode ? "#BB86FC" : "#60a5fa",
            }}
          />
        </View>

        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className={`${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Sync Frequency: {localSyncFrequency} minutes
            </Text>
          </View>
          <Slider
            value={localSyncFrequency}
            minimumValue={5}
            maximumValue={60}
            step={5}
            onValueChange={setLocalSyncFrequency}
            minimumTrackTintColor={isDarkMode ? "#BB86FC" : "#60a5fa"}
            maximumTrackTintColor={isDarkMode ? "#2C2C2C" : "#d1d5db"}
            disabled={!localAutoSync}
          />
        </View>
      </View>

      {/* Data Usage */}
      <View className="mb-6">
        <Text
          className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
        >
          Data Usage
        </Text>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Database size={20} color={isDarkMode ? "#BB86FC" : "#4b5563"} />
            <Text
              className={`ml-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Data Saving Mode
            </Text>
          </View>
          <Switch
            value={localDataSavingMode}
            onValueChange={setLocalDataSavingMode}
            trackColor={{
              false: isDarkMode ? "#2C2C2C" : "#d1d5db",
              true: isDarkMode ? "#BB86FC" : "#60a5fa",
            }}
          />
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Wifi size={20} color={isDarkMode ? "#BB86FC" : "#4b5563"} />
            <Text
              className={`ml-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Sync on Wi-Fi Only
            </Text>
          </View>
          <Switch
            value={localDataSavingMode}
            onValueChange={setLocalDataSavingMode}
            trackColor={{
              false: isDarkMode ? "#2C2C2C" : "#d1d5db",
              true: isDarkMode ? "#BB86FC" : "#60a5fa",
            }}
          />
        </View>
      </View>

      {/* Camera Settings */}
      <View className="mb-6">
        <Text
          className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
        >
          Camera
        </Text>

        <Text
          className={`mb-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
        >
          Image Resolution
        </Text>
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${
              localCameraResolution === "low"
                ? isDarkMode
                  ? "bg-dark-primary"
                  : "bg-blue-500"
                : isDarkMode
                  ? "bg-dark-border"
                  : "bg-gray-200"
            }`}
            onPress={() => setLocalCameraResolution("low")}
          >
            <Text
              className={`${localCameraResolution === "low" ? "text-white" : isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Low
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${
              localCameraResolution === "medium"
                ? isDarkMode
                  ? "bg-dark-primary"
                  : "bg-blue-500"
                : isDarkMode
                  ? "bg-dark-border"
                  : "bg-gray-200"
            }`}
            onPress={() => setLocalCameraResolution("medium")}
          >
            <Text
              className={`${localCameraResolution === "medium" ? "text-white" : isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Medium
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${
              localCameraResolution === "high"
                ? isDarkMode
                  ? "bg-dark-primary"
                  : "bg-blue-500"
                : isDarkMode
                  ? "bg-dark-border"
                  : "bg-gray-200"
            }`}
            onPress={() => setLocalCameraResolution("high")}
          >
            <Text
              className={`${localCameraResolution === "high" ? "text-white" : isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              High
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Preferences */}
      <View className="mb-6">
        <Text
          className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
        >
          Preferences
        </Text>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Moon size={20} color={isDarkMode ? "#BB86FC" : "#4b5563"} />
            <Text
              className={`ml-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Dark Mode
            </Text>
          </View>
          <Switch
            value={currentDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{
              false: isDarkMode ? "#2C2C2C" : "#d1d5db",
              true: isDarkMode ? "#BB86FC" : "#60a5fa",
            }}
          />
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Bell size={20} color={isDarkMode ? "#BB86FC" : "#4b5563"} />
            <Text
              className={`ml-2 ${isDarkMode ? "text-dark-text" : "text-gray-700"}`}
            >
              Notifications
            </Text>
          </View>
          <Switch
            value={localNotificationsEnabled}
            onValueChange={setLocalNotificationsEnabled}
            trackColor={{
              false: isDarkMode ? "#2C2C2C" : "#d1d5db",
              true: isDarkMode ? "#BB86FC" : "#60a5fa",
            }}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className={`${isDarkMode ? "bg-red-700" : "bg-red-500"} py-3 rounded-lg items-center mt-4`}
        onPress={onLogout}
      >
        <View className="flex-row items-center justify-center">
          <LogOut size={20} color="#ffffff" />
          <Text className="text-white font-semibold ml-2">Logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AppSettings;
