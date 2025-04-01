import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, List, Map, ArrowLeft } from "lucide-react-native";
import RouteMap from "../../components/RouteMap";
import AddressList from "../../components/AddressList";

interface Address {
  id: string;
  address: string;
  streetName: string;
  houseNumber: string;
  completed: boolean;
  hasIssue: boolean;
  latitude: number;
  longitude: number;
}

const RouteDetailPage = () => {
  const { id } = useLocalSearchParams();
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [routeData, setRouteData] = useState<{
    routeName: string;
    addresses: Address[];
    completionStatus: {
      total: number;
      completed: number;
    };
  }>({
    routeName: `Rota ${id || "404"}`,
    addresses: [
      {
        id: "1",
        address: "Rua Carvalho, 123",
        streetName: "Rua Carvalho",
        houseNumber: "123",
        completed: true,
        hasIssue: false,
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        id: "2",
        address: "Rua Carvalho, 456",
        streetName: "Rua Carvalho",
        houseNumber: "456",
        completed: false,
        hasIssue: false,
        latitude: 40.7142,
        longitude: -74.0064,
      },
      {
        id: "3",
        address: "Av. Maple, 789",
        streetName: "Av. Maple",
        houseNumber: "789",
        completed: false,
        hasIssue: true,
        latitude: 40.7112,
        longitude: -74.0055,
      },
      {
        id: "4",
        address: "Estrada do Pinheiro, 101",
        streetName: "Estrada do Pinheiro",
        houseNumber: "101",
        completed: false,
        hasIssue: false,
        latitude: 40.7135,
        longitude: -74.0046,
      },
      {
        id: "5",
        address: "Estrada do Pinheiro, 202",
        streetName: "Estrada do Pinheiro",
        houseNumber: "202",
        completed: true,
        hasIssue: false,
        latitude: 40.7145,
        longitude: -74.0039,
      },
    ],
    completionStatus: {
      total: 5,
      completed: 2,
    },
  });

  useEffect(() => {
    // Em um app real, buscaria os dados da rota com base no ID
    // Aqui estamos usando dados fictícios
    if (routeData.addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(routeData.addresses[0].id);
    }
  }, [id]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    // Se estiver no modo lista, muda para o modo mapa
    if (viewMode === "list") {
      setViewMode("map");
    }
  };

  const router = useRouter();

  const handleNavigateToMeter = (addressId: string) => {
    // Pass the route ID as a query parameter so we can return to the correct route
    router.push({
      pathname: `/meter/${addressId}`,
      params: { routeId: id },
    });
  };

  // Converte endereços em localizações para o mapa
  const mapLocations = routeData.addresses.map((addr) => ({
    id: addr.id,
    address: addr.address,
    latitude: addr.latitude,
    longitude: addr.longitude,
    completed: addr.completed,
  }));

  return (
    <View className="flex-1 bg-gray-50">
      {/* Cabeçalho */}
      <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="p-2">
            {/* Em um app real, voltaria para o dashboard */}
            {/* onPress={() => router.back()} */}
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-800">
            {routeData.routeName}
          </Text>

          <View className="w-10" />
        </View>

        <View className="mt-2 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MapPin size={16} color="#4b5563" />
            <Text className="ml-1 text-gray-600">
              {routeData.addresses.length} endereços
            </Text>
          </View>

          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-700 font-medium">
              {routeData.completionStatus.completed}/
              {routeData.completionStatus.total} concluídos
            </Text>
          </View>
        </View>
      </View>

      {/* Alternador de visualização */}
      <View className="flex-row bg-gray-100 mx-4 mt-4 rounded-lg p-1">
        <TouchableOpacity
          onPress={() => setViewMode("map")}
          className={`flex-1 flex-row items-center justify-center py-2 px-4 rounded-md ${viewMode === "map" ? "bg-white shadow-sm" : ""}`}
        >
          <Map size={18} color={viewMode === "map" ? "#3b82f6" : "#6b7280"} />
          <Text
            className={`ml-2 ${viewMode === "map" ? "text-blue-600 font-medium" : "text-gray-600"}`}
          >
            Mapa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setViewMode("list")}
          className={`flex-1 flex-row items-center justify-center py-2 px-4 rounded-md ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
        >
          <List size={18} color={viewMode === "list" ? "#3b82f6" : "#6b7280"} />
          <Text
            className={`ml-2 ${viewMode === "list" ? "text-blue-600 font-medium" : "text-gray-600"}`}
          >
            Lista
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo baseado no modo de visualização */}
      <View className="flex-1 mt-4">
        {viewMode === "map" ? (
          <View className="px-4">
            <RouteMap
              locations={mapLocations}
              currentLocationId={selectedAddressId || undefined}
              onLocationSelect={handleAddressSelect}
            />

            {/* Acesso rápido ao endereço selecionado */}
            {selectedAddressId && (
              <View className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <Text className="text-gray-800 font-medium mb-1">
                  Endereço selecionado
                </Text>

                {(() => {
                  const selectedAddress = routeData.addresses.find(
                    (addr) => addr.id === selectedAddressId,
                  );

                  if (!selectedAddress) return null;

                  return (
                    <View>
                      <Text className="text-gray-900 font-bold text-lg">
                        {selectedAddress.address}
                      </Text>
                      <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-gray-600">
                          {selectedAddress.completed
                            ? "Concluído"
                            : "Não concluído"}
                          {selectedAddress.hasIssue ? " • Com problema" : ""}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleNavigateToMeter(selectedAddress.id)
                          }
                          className="bg-blue-500 py-2 px-4 rounded-lg"
                        >
                          <Text className="text-white font-medium">
                            Ir para medidor
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })()}
              </View>
            )}
          </View>
        ) : (
          <AddressList
            addresses={routeData.addresses}
            onAddressPress={handleAddressSelect}
            onNavigatePress={handleNavigateToMeter}
            showSearch={true}
            showFilters={true}
            groupByStreet={true}
          />
        )}
      </View>
    </View>
  );
};

export default RouteDetailPage;
