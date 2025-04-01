import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Filter, ArrowDownUp, Search } from "lucide-react-native";
import RouteCard from "./RouteCard";

interface Route {
  id: string;
  name: string;
  completedAddresses: number;
  totalAddresses: number;
  estimatedTime: string;
  isActive?: boolean;
}

interface RoutesListProps {
  routes?: Route[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onFilterPress?: () => void;
  onSortPress?: () => void;
  onSearchPress?: () => void;
}

const RoutesList = ({
  routes = [
    {
      id: "1",
      name: "Rota do Centro",
      completedAddresses: 5,
      totalAddresses: 12,
      estimatedTime: "2 horas",
      isActive: true,
    },
    {
      id: "2",
      name: "Residencial Norte",
      completedAddresses: 0,
      totalAddresses: 18,
      estimatedTime: "3 horas",
    },
    {
      id: "3",
      name: "Parque Industrial",
      completedAddresses: 8,
      totalAddresses: 8,
      estimatedTime: "1,5 horas",
    },
    {
      id: "4",
      name: "Comercial Oeste",
      completedAddresses: 3,
      totalAddresses: 15,
      estimatedTime: "2,5 horas",
    },
  ],
  isLoading = false,
  onRefresh = () => {},
  onFilterPress = () => {},
  onSortPress = () => {},
  onSearchPress = () => {},
}: RoutesListProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 1500);
  };

  const renderHeader = () => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-gray-800">Rotas diárias</Text>
        <Text className="text-sm text-gray-500">
          {routes.length} rotas disponíveis
        </Text>
      </View>

      <View className="flex-row justify-between mb-4">
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={onFilterPress}
            className="flex-row items-center bg-gray-100 px-3 py-2 rounded-md"
          >
            <Filter size={16} color="#4b5563" />
            <Text className="ml-1 text-gray-700">Filtro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSortPress}
            className="flex-row items-center bg-gray-100 px-3 py-2 rounded-md"
          >
            <ArrowDownUp size={16} color="#4b5563" />
            <Text className="ml-1 text-gray-700">Ordenar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onSearchPress}
          className="flex-row items-center bg-gray-100 px-3 py-2 rounded-md"
        >
          <Search size={16} color="#4b5563" />
          <Text className="ml-1 text-gray-700">Buscar</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-2">
        <View className="flex-1 flex-row items-center">
          <View className="h-3 w-3 rounded-full bg-green-500 mr-2" />
          <Text className="text-sm text-gray-600">Concluído</Text>
        </View>
        <View className="flex-1 flex-row items-center">
          <View className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
          <Text className="text-sm text-gray-600">Em andamento</Text>
        </View>
        <View className="flex-1 flex-row items-center">
          <View className="h-3 w-3 rounded-full bg-indigo-500 mr-2" />
          <Text className="text-sm text-gray-600">Não iniciado</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Text className="text-gray-500 text-lg mb-2">
        Nenhuma rota disponível
      </Text>
      <Text className="text-gray-400 text-center px-10">
        Não há rotas atribuídas para hoje ou os dados ainda não foram
        sincronizados.
      </Text>
      <TouchableOpacity
        onPress={handleRefresh}
        className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
      >
        <Text className="text-white font-medium">Sincronizar agora</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 px-4">
      <FlatList
        data={routes}
        renderItem={({ item }) => <RouteCard {...item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={handleRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      />
    </View>
  );
};

export default RoutesList;
