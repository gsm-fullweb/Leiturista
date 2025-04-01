import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera, PenLine } from "lucide-react-native";

interface ReadingInputSelectorProps {
  onSelectMethod: (method: "manual" | "camera") => void;
  selectedMethod?: "manual" | "camera";
}

const ReadingInputSelector = ({
  onSelectMethod = () => {},
  selectedMethod = "manual",
}: ReadingInputSelectorProps) => {
  const [activeMethod, setActiveMethod] = useState<"manual" | "camera">(
    selectedMethod,
  );

  const handleMethodSelect = (method: "manual" | "camera") => {
    setActiveMethod(method);
    onSelectMethod(method);
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Choose Input Method
      </Text>

      <View className="flex-row justify-between">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-l-lg ${activeMethod === "manual" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => handleMethodSelect("manual")}
        >
          <PenLine
            size={20}
            color={activeMethod === "manual" ? "white" : "#4B5563"}
          />
          <Text
            className={`ml-2 font-medium ${activeMethod === "manual" ? "text-white" : "text-gray-600"}`}
          >
            Manual Entry
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-r-lg ${activeMethod === "camera" ? "bg-blue-500" : "bg-gray-200"}`}
          onPress={() => handleMethodSelect("camera")}
        >
          <Camera
            size={20}
            color={activeMethod === "camera" ? "white" : "#4B5563"}
          />
          <Text
            className={`ml-2 font-medium ${activeMethod === "camera" ? "text-white" : "text-gray-600"}`}
          >
            Camera Capture
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xs text-gray-500 mt-2 text-center">
        {activeMethod === "manual"
          ? "Manually enter the meter reading value"
          : "Use camera to automatically capture and process the meter reading"}
      </Text>
    </View>
  );
};

export default ReadingInputSelector;
