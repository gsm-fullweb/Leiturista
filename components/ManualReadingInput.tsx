import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Check, AlertCircle } from "lucide-react-native";

interface ManualReadingInputProps {
  previousReading?: string;
  onReadingSubmit?: (reading: string) => void;
  meterType?: "electric" | "water" | "gas";
  maxDigits?: number;
}

const ManualReadingInput = ({
  previousReading = "12345",
  onReadingSubmit = () => {},
  meterType = "electric",
  maxDigits = 6,
}: ManualReadingInputProps) => {
  const [reading, setReading] = useState("");
  const [error, setError] = useState("");

  const validateReading = (value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) {
      setError("Only numbers are allowed");
      return false;
    }

    // Check if reading is within reasonable range compared to previous
    if (value.length > 0 && previousReading) {
      const current = parseInt(value, 10);
      const previous = parseInt(previousReading, 10);

      if (current < previous) {
        setError("New reading cannot be less than previous reading");
        return false;
      }

      // Check for unreasonably high increase (e.g., more than 5x)
      if (current > previous * 5) {
        setError("Reading seems unusually high. Please verify.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleChangeText = (text: string) => {
    if (text.length <= maxDigits) {
      setReading(text);
      validateReading(text);
    }
  };

  const handleSubmit = () => {
    if (reading.length === 0) {
      setError("Please enter a reading");
      return;
    }

    if (validateReading(reading)) {
      onReadingSubmit(reading);
    }
  };

  const getMeterTypeLabel = () => {
    switch (meterType) {
      case "water":
        return "Water Meter Reading (m³)";
      case "gas":
        return "Gas Meter Reading (m³)";
      default:
        return "Electric Meter Reading (kWh)";
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="w-full bg-white p-4 rounded-lg shadow-sm"
    >
      <Text className="text-lg font-semibold mb-2">{getMeterTypeLabel()}</Text>

      <View className="mb-4">
        <Text className="text-sm text-gray-500 mb-1">Previous Reading</Text>
        <View className="bg-gray-100 p-3 rounded-md">
          <Text className="text-base">{previousReading}</Text>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-sm text-gray-500 mb-1">New Reading</Text>
        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-md p-3 text-lg"
          keyboardType="numeric"
          value={reading}
          onChangeText={handleChangeText}
          placeholder="Enter meter reading"
          maxLength={maxDigits}
        />

        {error ? (
          <View className="flex-row items-center mt-2">
            <AlertCircle size={16} color="#ef4444" />
            <Text className="text-red-500 ml-1 text-sm">{error}</Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-500">
          {reading.length}/{maxDigits} digits
        </Text>
        <TouchableOpacity
          onPress={handleSubmit}
          className={`flex-row items-center justify-center px-6 py-3 rounded-md ${error || reading.length === 0 ? "bg-gray-300" : "bg-blue-500"}`}
          disabled={!!error || reading.length === 0}
        >
          <Check size={18} color="white" />
          <Text className="text-white font-medium ml-2">Submit Reading</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ManualReadingInput;
