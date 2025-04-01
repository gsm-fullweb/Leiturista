import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import {
  Camera as CameraIcon,
  Check,
  X,
  RefreshCw,
  Zap,
} from "lucide-react-native";

interface CameraCaptureProps {
  onCapture?: (reading: string, imageUri: string) => void;
  onCancel?: () => void;
  meterType?: "analog" | "digital";
  previousReading?: string;
}

const CameraCapture = ({
  onCapture = () => {},
  onCancel = () => {},
  meterType = "digital",
  previousReading = "12345",
}: CameraCaptureProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [detectedReading, setDetectedReading] = useState<string>("");
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        setCapturedImage(photo.uri);
        processImage(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const processImage = async (imageUri: string) => {
    setProcessing(true);

    // Simulate OCR processing with a delay
    setTimeout(() => {
      // Mock OCR result - in a real app, this would use Tesseract.js
      const mockReading = Math.floor(Math.random() * 90000 + 10000).toString();
      setDetectedReading(mockReading);
      setProcessing(false);
    }, 2000);
  };

  const confirmReading = () => {
    if (detectedReading) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onCapture(detectedReading, capturedImage || "");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setDetectedReading("");
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-red-500">No access to camera</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={onCancel}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {!capturedImage ? (
        <View className="flex-1">
          <Camera
            ref={cameraRef}
            className="flex-1"
            type={Camera.Constants.Type.back}
            ratio="16:9"
            autoFocus={Camera.Constants.AutoFocus.on}
          >
            <View className="flex-1 bg-transparent">
              {/* Camera overlay with guidelines */}
              <View className="flex-1 justify-center items-center">
                <View className="border-2 border-yellow-400 w-4/5 h-32 rounded-lg opacity-70" />
                <Text className="text-white text-sm mt-2 bg-black/50 px-2 py-1 rounded">
                  Center the meter display in the box
                </Text>
              </View>

              {/* Previous reading info */}
              <View className="absolute top-10 left-4 bg-black/70 p-2 rounded-lg">
                <Text className="text-white text-xs">
                  Previous: {previousReading}
                </Text>
                <Text className="text-white text-xs">Type: {meterType}</Text>
              </View>

              {/* Camera controls */}
              <View className="absolute bottom-10 left-0 right-0 flex-row justify-center items-center">
                <TouchableOpacity
                  className="bg-white rounded-full p-4 mx-4"
                  onPress={onCancel}
                >
                  <X size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white rounded-full p-6 mx-4"
                  onPress={takePicture}
                >
                  <CameraIcon size={32} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white rounded-full p-4 mx-4"
                  onPress={() => {}}
                >
                  <Zap size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      ) : (
        <View className="flex-1">
          <Image
            source={{ uri: capturedImage }}
            className="flex-1"
            contentFit="cover"
          />

          {/* OCR Results overlay */}
          <View className="absolute top-0 left-0 right-0 bg-black/70 p-4">
            <Text className="text-white text-lg font-bold">Captured Image</Text>
            {processing ? (
              <View className="flex-row items-center mt-2">
                <ActivityIndicator color="#fff" size="small" />
                <Text className="text-white ml-2">Processing image...</Text>
              </View>
            ) : detectedReading ? (
              <View className="mt-2">
                <Text className="text-white">Detected Reading:</Text>
                <Text className="text-white text-2xl font-bold">
                  {detectedReading}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Action buttons */}
          <View className="absolute bottom-10 left-0 right-0 flex-row justify-center items-center">
            <TouchableOpacity
              className="bg-red-500 rounded-full p-4 mx-4"
              onPress={retakePhoto}
            >
              <RefreshCw size={24} color="#fff" />
            </TouchableOpacity>

            {!processing && detectedReading && (
              <TouchableOpacity
                className="bg-green-500 rounded-full p-4 mx-4"
                onPress={confirmReading}
              >
                <Check size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default CameraCapture;
