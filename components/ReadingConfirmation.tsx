import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Check, Edit2, AlertTriangle, ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { saveMeterReading, getPendingReadings } from "../utils/storage";
import { v4 as uuidv4 } from "uuid";

interface ReadingConfirmationProps {
  readingValue?: string;
  previousReading?: string;
  meterType?: string;
  onEdit?: () => void;
  onConfirm?: (value: string) => void;
  addressId?: string;
  routeId?: string;
}

const ReadingConfirmation = ({
  readingValue = "12345",
  previousReading = "12100",
  meterType = "Electric",
  onEdit = () => {},
  onConfirm = () => {},
  addressId = "123",
  routeId = "456",
}: ReadingConfirmationProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();

  // Calculate consumption (simple difference for demo)
  const currentReading = parseInt(readingValue, 10);
  const prevReading = parseInt(previousReading, 10);
  const consumption = currentReading - prevReading;

  // Determine if consumption is unusual (for demo purposes, >300 is unusual)
  const isUnusual = consumption > 300 || consumption < 0;

  const handleConfirm = async () => {
    setIsConfirmed(true);

    try {
      // Save reading to local storage
      const reading = {
        id: uuidv4(),
        meterId: addressId || "unknown",
        addressId: addressId || "unknown",
        routeId: routeId || "unknown",
        value: readingValue,
        timestamp: new Date().toISOString(),
        syncStatus: "pending",
      };

      await saveMeterReading(reading);
      onConfirm(readingValue);

      // Get pending readings to show count
      const pendingReadings = await getPendingReadings();
      const pendingCount = pendingReadings.filter(
        (r) => r.syncStatus === "pending",
      ).length;

      // Show confirmation message with pending count
      Alert.alert(
        "Leitura Confirmada",
        `A leitura foi salva localmente e será sincronizada quando online. ${pendingCount} leituras pendentes para sincronizar.`,
        [
          {
            text: "Voltar para Rota",
            onPress: () => {
              // Navigate back to route
              if (routeId) {
                router.replace(`/route/${routeId}`);
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error saving reading:", error);
      Alert.alert(
        "Erro",
        "Houve um problema ao salvar a leitura. Por favor, tente novamente.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to route even on error
              if (routeId) {
                router.replace(`/route/${routeId}`);
              }
            },
          },
        ],
      );
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-md w-full">
      <Text className="text-lg font-bold text-center mb-4">
        Confirm Reading
      </Text>

      <View className="flex-row justify-between items-center mb-4 p-3 bg-gray-50 rounded-md">
        <Text className="text-gray-600">Current Reading:</Text>
        <Text className="text-xl font-bold">{readingValue}</Text>
      </View>

      <View className="flex-row justify-between items-center mb-4 p-3 bg-gray-50 rounded-md">
        <Text className="text-gray-600">Previous Reading:</Text>
        <Text className="text-gray-500">{previousReading}</Text>
      </View>

      <View className="flex-row justify-between items-center mb-6 p-3 bg-gray-50 rounded-md">
        <Text className="text-gray-600">Consumption:</Text>
        <View className="flex-row items-center">
          <Text
            className={`text-lg font-semibold ${isUnusual ? "text-red-500" : "text-green-600"}`}
          >
            {consumption} units
          </Text>
          {isUnusual && (
            <AlertTriangle className="ml-2" size={20} color="#EF4444" />
          )}
        </View>
      </View>

      {isUnusual && (
        <View className="mb-6 p-3 bg-red-50 rounded-md">
          <Text className="text-red-600 text-center">
            {consumption < 0
              ? "Warning: Current reading is lower than previous reading!"
              : "Warning: Unusually high consumption detected!"}
          </Text>
        </View>
      )}

      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-gray-200 px-6 py-3 rounded-md flex-row items-center"
          onPress={onEdit}
          disabled={isConfirmed}
        >
          <Edit2 size={18} color="#4B5563" />
          <Text className="ml-2 text-gray-700 font-medium">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-6 py-3 rounded-md flex-row items-center ${isConfirmed ? "bg-green-100" : "bg-green-500"}`}
          onPress={handleConfirm}
          disabled={isConfirmed}
        >
          {isConfirmed ? (
            <>
              <Check size={18} color="#10B981" />
              <Text className="ml-2 text-green-700 font-medium">Confirmed</Text>
            </>
          ) : (
            <>
              <ArrowRight size={18} color="#FFFFFF" />
              <Text className="ml-2 text-white font-medium">
                Confirm & Continue
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReadingConfirmation;
