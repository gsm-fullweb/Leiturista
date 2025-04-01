import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, RotateCw, User } from "lucide-react-native";

interface DashboardMenuProps {
  onViewRoutes?: () => void;
  onCheckSync?: () => void;
  onViewProfile?: () => void;
}

const DashboardMenu = ({
  onViewRoutes = () => {},
  onCheckSync = () => {},
  onViewProfile = () => {},
}: DashboardMenuProps) => {
  const router = useRouter();

  const handleViewRoutes = () => {
    onViewRoutes();
    router.push("/route/1"); // Navigate to routes page with a default ID
  };

  const handleCheckSync = () => {
    onCheckSync();
    // This would typically open a sync status modal or navigate to a sync page
  };

  const handleViewProfile = () => {
    onViewProfile();
    router.push("/profile");
  };

  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-md">
      <Text className="text-xl font-bold mb-4 text-gray-800">
        Menu Principal
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {/* View Daily Routes Button */}
        <TouchableOpacity
          className="bg-blue-500 w-[48%] p-4 rounded-lg mb-4 items-center"
          onPress={handleViewRoutes}
        >
          <View className="bg-blue-400 p-3 rounded-full mb-2">
            <MapPin size={24} color="white" />
          </View>
          <Text className="text-white font-semibold text-center">
            Ver Roteiros Diários
          </Text>
        </TouchableOpacity>

        {/* Check Sync Status Button */}
        <TouchableOpacity
          className="bg-green-500 w-[48%] p-4 rounded-lg mb-4 items-center"
          onPress={handleCheckSync}
        >
          <View className="bg-green-400 p-3 rounded-full mb-2">
            <RotateCw size={24} color="white" />
          </View>
          <Text className="text-white font-semibold text-center">
            Verificar Sincronização
          </Text>
        </TouchableOpacity>

        {/* View Profile Button */}
        <TouchableOpacity
          className="bg-purple-500 w-full p-4 rounded-lg items-center"
          onPress={handleViewProfile}
        >
          <View className="bg-purple-400 p-3 rounded-full mb-2">
            <User size={24} color="white" />
          </View>
          <Text className="text-white font-semibold text-center">
            Ver Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardMenu;
