import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Lock, User, AlertCircle } from "lucide-react-native";

interface LoginFormProps {
  onLoginSuccess?: () => void;
  isLoading?: boolean;
}

const LoginForm = ({
  onLoginSuccess = () => {},
  isLoading = false,
}: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isLoading);
  const router = useRouter();

  const handleLogin = async () => {
    // Reset error state
    setError("");

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    // Simulate login process
    setLoading(true);

    try {
      // This would be replaced with actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, accept any non-empty credentials
      // In a real app, this would validate against Supabase
      onLoginSuccess();
      router.replace("/dashboard");
    } catch (err) {
      setError("Falha na autenticação. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
      {error ? (
        <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex-row items-center">
          <AlertCircle size={20} color="#EF4444" />
          <Text className="ml-2 text-red-600">{error}</Text>
        </View>
      ) : null}

      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">
          Nome de usuário
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
          <User size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-700"
            placeholder="Digite seu nome de usuário"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            testID="username-input"
          />
        </View>
      </View>

      <View className="mb-6">
        <Text className="mb-2 text-sm font-medium text-gray-700">Senha</Text>
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
          <Lock size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-700"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            testID="password-input"
          />
        </View>
      </View>

      <TouchableOpacity
        className={`w-full py-3 rounded-md ${loading ? "bg-blue-400" : "bg-blue-600"}`}
        onPress={handleLogin}
        disabled={loading}
        testID="login-button"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-center text-white font-medium">Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity className="mt-4">
        <Text className="text-center text-sm text-blue-600">
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
