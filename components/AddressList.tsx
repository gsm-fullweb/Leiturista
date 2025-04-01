import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Search, MapPin, Filter } from "lucide-react-native";
import AddressItem from "./AddressItem";

interface Address {
  id: string;
  address: string;
  streetName: string;
  houseNumber: string;
  completed: boolean;
  hasIssue: boolean;
}

interface AddressListProps {
  addresses?: Address[];
  onAddressPress?: (id: string) => void;
  onNavigatePress?: (id: string) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  groupByStreet?: boolean;
}

const AddressList = ({
  addresses = [
    {
      id: "1",
      address: "Rua Carvalho, 123",
      streetName: "Rua Carvalho",
      houseNumber: "123",
      completed: true,
      hasIssue: false,
    },
    {
      id: "2",
      address: "Rua Carvalho, 456",
      streetName: "Rua Carvalho",
      houseNumber: "456",
      completed: false,
      hasIssue: false,
    },
    {
      id: "3",
      address: "Av. Maple, 789",
      streetName: "Av. Maple",
      houseNumber: "789",
      completed: false,
      hasIssue: true,
    },
    {
      id: "4",
      address: "Estrada do Pinheiro, 101",
      streetName: "Estrada do Pinheiro",
      houseNumber: "101",
      completed: false,
      hasIssue: false,
    },
    {
      id: "5",
      address: "Estrada do Pinheiro, 202",
      streetName: "Estrada do Pinheiro",
      houseNumber: "202",
      completed: true,
      hasIssue: false,
    },
  ],
  onAddressPress = (id) => console.log(`Endereço ${id} pressionado`),
  onNavigatePress = (id) => console.log(`Navegar para o endereço ${id}`),
  showSearch = true,
  showFilters = true,
  groupByStreet = true,
}: AddressListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [filterHasIssue, setFilterHasIssue] = useState<boolean | null>(null);

  // Filtrar endereços com base na busca e filtros
  const filteredAddresses = addresses.filter((address) => {
    if (
      searchQuery &&
      !address.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (filterCompleted !== null && address.completed !== filterCompleted) {
      return false;
    }

    if (filterHasIssue !== null && address.hasIssue !== filterHasIssue) {
      return false;
    }

    return true;
  });

  // Agrupar endereços por rua, se necessário
  const groupedAddresses = groupByStreet
    ? filteredAddresses.reduce(
        (groups, address) => {
          const street = address.streetName;
          if (!groups[street]) {
            groups[street] = [];
          }
          groups[street].push(address);
          return groups;
        },
        {} as Record<string, Address[]>,
      )
    : { "Todos os endereços": filteredAddresses };

  const toggleCompletedFilter = () => {
    if (filterCompleted === null) setFilterCompleted(true);
    else if (filterCompleted === true) setFilterCompleted(false);
    else setFilterCompleted(null);
  };

  const toggleIssueFilter = () => {
    if (filterHasIssue === null) setFilterHasIssue(true);
    else if (filterHasIssue === true) setFilterHasIssue(false);
    else setFilterHasIssue(null);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {showSearch && (
        <View className="px-4 pt-2 pb-3">
          <View className="flex-row items-center bg-white rounded-lg px-3 py-2 border border-gray-200">
            <Search size={18} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Buscar endereços..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}

      {showFilters && (
        <View className="px-4 pb-3 flex-row">
          <TouchableOpacity
            onPress={toggleCompletedFilter}
            className={`mr-2 px-3 py-1 rounded-full flex-row items-center ${
              filterCompleted === true
                ? "bg-green-100"
                : filterCompleted === false
                  ? "bg-red-100"
                  : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm ${
                filterCompleted === true
                  ? "text-green-800"
                  : filterCompleted === false
                    ? "text-red-800"
                    : "text-gray-800"
              }`}
            >
              {filterCompleted === true
                ? "Concluído"
                : filterCompleted === false
                  ? "Não concluído"
                  : "Todos os status"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleIssueFilter}
            className={`px-3 py-1 rounded-full flex-row items-center ${
              filterHasIssue === true
                ? "bg-amber-100"
                : filterHasIssue === false
                  ? "bg-blue-100"
                  : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm ${
                filterHasIssue === true
                  ? "text-amber-800"
                  : filterHasIssue === false
                    ? "text-blue-800"
                    : "text-gray-800"
              }`}
            >
              {filterHasIssue === true
                ? "Com problema"
                : filterHasIssue === false
                  ? "Sem problema"
                  : "Todos os problemas"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1 px-4">
        {Object.entries(groupedAddresses).map(
          ([streetName, streetAddresses]) => (
            <View key={streetName} className="mb-4">
              {groupByStreet && (
                <View className="flex-row items-center mb-2 mt-2">
                  <MapPin size={16} color="#4b5563" />
                  <Text className="ml-1 text-gray-700 font-medium">
                    {streetName}
                  </Text>
                  <Text className="ml-2 text-gray-500 text-sm">
                    ({streetAddresses.length}{" "}
                    {streetAddresses.length === 1 ? "endereço" : "endereços"})
                  </Text>
                </View>
              )}

              {streetAddresses.map((address) => (
                <AddressItem
                  key={address.id}
                  address={address.address}
                  streetName={address.streetName}
                  houseNumber={address.houseNumber}
                  completed={address.completed}
                  hasIssue={address.hasIssue}
                  onPress={() => onAddressPress(address.id)}
                  onNavigate={() => onNavigatePress(address.id)}
                />
              ))}
            </View>
          ),
        )}

        {filteredAddresses.length === 0 && (
          <View className="py-8 items-center justify-center">
            <Text className="text-gray-500 text-center">
              Nenhum endereço corresponde à sua busca ou filtros
            </Text>
          </View>
        )}

        <View className="h-4" />
      </ScrollView>
    </View>
  );
};

export default AddressList;
