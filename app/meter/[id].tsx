import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, CheckCircle } from "lucide-react-native";

import MeterDetails from "../../components/MeterDetails";
import ReadingInputSelector from "../../components/ReadingInputSelector";
import ReadingInputSelectorWithWebcam from "../../components/ReadingInputSelectorWithWebcam";
import ManualReadingInput from "../../components/ManualReadingInput";
import CameraCapture from "../../components/CameraCapture";
import WebcamCapture from "../../components/WebcamCapture";
import ReadingConfirmation from "../../components/ReadingConfirmation";

export default function MeterReadingScreen() {
  const { id, routeId } = useLocalSearchParams();
  const router = useRouter();

  // Mock data for the meter
  const meterData = {
    address: "123 Main Street, Apt 4B, Cityville",
    meterId: `MTR-${id || "2023-45678"}`,
    customerName: "John Smith",
    previousReading: "45678",
    lastReadDate: "15/04/2023",
    expectedUsage: "400-500 kWh",
    routeId: routeId || "route-123",
  };

  // State management
  const [inputMethod, setInputMethod] = useState<
    "manual" | "camera" | "webcam"
  >("manual");
  const [readingValue, setReadingValue] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [visitCompleted, setVisitCompleted] = useState(false);

  // Handle method selection
  const handleMethodSelect = useCallback(
    (method: "manual" | "camera" | "webcam") => {
      setInputMethod(method);
      setShowConfirmation(false);
    },
    [],
  );

  // Handle reading submission from manual input
  const handleManualSubmit = useCallback((reading: string) => {
    setReadingValue(reading);
    setShowConfirmation(true);
  }, []);

  // Handle reading capture from camera
  const handleCameraCapture = useCallback(
    (reading: string, imageUri: string) => {
      setReadingValue(reading);
      setShowConfirmation(true);
      // In a real app, you would store the imageUri as well
    },
    [],
  );

  // Handle reading confirmation
  const handleConfirmReading = useCallback(
    (value: string) => {
      // In a real app, this would update the meter reading in the database
      setVisitCompleted(true);
      // After a delay, navigate back to route
      setTimeout(() => {
        router.push(`/route/${meterData.routeId}`);
      }, 2000);
    },
    [router, meterData.routeId],
  );

  // Handle back button press
  const handleBackPress = useCallback(() => {
    if (routeId) {
      router.replace(`/route/${routeId}`);
    } else {
      router.back();
    }
  }, [router, routeId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={handleBackPress} className="mr-4">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Meter Reading</Text>
        {visitCompleted && (
          <View className="ml-auto flex-row items-center">
            <CheckCircle size={20} color="#10b981" />
            <Text className="ml-2 text-green-600 font-medium">Completed</Text>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="space-y-4">
          {/* Meter Details Component */}
          <MeterDetails
            address={meterData.address}
            meterId={meterData.meterId}
            customerName={meterData.customerName}
            previousReading={meterData.previousReading}
            lastReadDate={meterData.lastReadDate}
            expectedUsage={meterData.expectedUsage}
          />

          {!visitCompleted && (
            <>
              {/* Reading Input Selector */}
              <ReadingInputSelectorWithWebcam
                onSelectMethod={handleMethodSelect}
                selectedMethod={inputMethod}
              />

              {/* Conditional rendering based on selected method */}
              {inputMethod === "manual" && !showConfirmation && (
                <ManualReadingInput
                  previousReading={meterData.previousReading}
                  onReadingSubmit={handleManualSubmit}
                  meterType="electric"
                />
              )}

              {inputMethod === "camera" && !showConfirmation && (
                <CameraCapture
                  onCapture={handleCameraCapture}
                  onCancel={() => setInputMethod("manual")}
                  previousReading={meterData.previousReading}
                />
              )}

              {inputMethod === "webcam" && !showConfirmation && (
                <WebcamCapture
                  onCapture={handleCameraCapture}
                  onCancel={() => setInputMethod("manual")}
                  previousReading={meterData.previousReading}
                />
              )}

              {/* Reading Confirmation */}
              {showConfirmation && (
                <ReadingConfirmation
                  readingValue={readingValue}
                  previousReading={meterData.previousReading}
                  meterType="Electric"
                  onEdit={() => setShowConfirmation(false)}
                  onConfirm={handleConfirmReading}
                  addressId={id as string}
                  routeId={meterData.routeId}
                />
              )}
            </>
          )}

          {/* Visit Completed Message */}
          {visitCompleted && (
            <View className="bg-green-50 p-6 rounded-lg border border-green-200 items-center">
              <CheckCircle size={48} color="#10b981" />
              <Text className="text-xl font-bold text-green-800 mt-4">
                Visit Completed
              </Text>
              <Text className="text-center text-green-600 mt-2">
                The meter reading has been recorded successfully and will be
                synchronized when online.
              </Text>
              <TouchableOpacity
                className="mt-6 bg-blue-500 py-3 px-6 rounded-lg"
                onPress={() => router.replace(`/route/${meterData.routeId}`)}
              >
                <Text className="text-white font-medium">Return to Route</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
