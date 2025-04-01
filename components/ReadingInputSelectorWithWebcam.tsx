import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Camera, PenLine, Monitor } from "lucide-react-native";

interface ReadingInputSelectorProps {
  onSelectMethod: (method: "manual" | "camera" | "webcam") => void;
  selectedMethod?: "manual" | "camera" | "webcam";
}

const ReadingInputSelectorWithWebcam = ({
  onSelectMethod = () => {},
  selectedMethod = "manual",
}: ReadingInputSelectorProps) => {
  const [activeMethod, setActiveMethod] = useState<
    "manual" | "camera" | "webcam"
  >(selectedMethod);

  const handleMethodSelect = (method: "manual" | "camera" | "webcam") => {
    setActiveMethod(method);
    onSelectMethod(method);
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Choose Input Method
      </Text>

      <View className="flex-row justify-between mb-2">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-2 rounded-l-lg ${activeMethod === "manual" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => handleMethodSelect("manual")}
        >
          <PenLine
            size={18}
            color={activeMethod === "manual" ? "white" : "#4B5563"}
          />
          <Text
            className={`ml-1 font-medium text-xs ${activeMethod === "manual" ? "text-white" : "text-gray-600"}`}
          >
            Manual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-2 ${activeMethod === "camera" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => handleMethodSelect("camera")}
        >
          <Camera
            size={18}
            color={activeMethod === "camera" ? "white" : "#4B5563"}
          />
          <Text
            className={`ml-1 font-medium text-xs ${activeMethod === "camera" ? "text-white" : "text-gray-600"}`}
          >
            Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-2 rounded-r-lg ${activeMethod === "webcam" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => handleMethodSelect("webcam")}
        >
          <Monitor
            size={18}
            color={activeMethod === "webcam" ? "white" : "#4B5563"}
          />
          <Text
            className={`ml-1 font-medium text-xs ${activeMethod === "webcam" ? "text-white" : "text-gray-600"}`}
          >
            Webcam
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xs text-gray-500 mt-2 text-center">
        {activeMethod === "manual"
          ? "Manually enter the meter reading value"
          : activeMethod === "camera"
            ? "Use device camera to capture and process the meter reading"
            : "Use webcam to capture and process the meter reading"}
      </Text>
    </View>
  );
};

export default ReadingInputSelectorWithWebcam;
