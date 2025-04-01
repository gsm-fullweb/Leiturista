import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for AsyncStorage
export const STORAGE_KEYS = {
  PENDING_READINGS: "pendingReadings",
  LAST_SYNC_TIME: "lastSyncTime",
  USER_DATA: "userData",
  ROUTES_DATA: "routesData",
};

// Types
export interface MeterReading {
  id: string;
  meterId: string;
  addressId: string;
  routeId: string;
  value: string;
  timestamp: string;
  imageUri?: string;
  syncStatus: "pending" | "synced" | "error";
}

// Save a reading to local storage
export const saveMeterReading = async (
  reading: MeterReading,
): Promise<void> => {
  try {
    // Get existing readings
    const existingReadingsJson = await AsyncStorage.getItem(
      STORAGE_KEYS.PENDING_READINGS,
    );
    const existingReadings: MeterReading[] = existingReadingsJson
      ? JSON.parse(existingReadingsJson)
      : [];

    // Add new reading or update existing
    const existingIndex = existingReadings.findIndex(
      (r) => r.id === reading.id,
    );
    if (existingIndex >= 0) {
      existingReadings[existingIndex] = reading;
    } else {
      existingReadings.push(reading);
    }

    // Save back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.PENDING_READINGS,
      JSON.stringify(existingReadings),
    );
    console.log("Reading saved locally:", reading.id);
  } catch (error) {
    console.error("Error saving reading locally:", error);
    throw error;
  }
};

// Get all pending readings
export const getPendingReadings = async (): Promise<MeterReading[]> => {
  try {
    const readingsJson = await AsyncStorage.getItem(
      STORAGE_KEYS.PENDING_READINGS,
    );
    return readingsJson ? JSON.parse(readingsJson) : [];
  } catch (error) {
    console.error("Error getting pending readings:", error);
    return [];
  }
};

// Update reading sync status
export const updateReadingSyncStatus = async (
  readingId: string,
  status: "pending" | "synced" | "error",
): Promise<void> => {
  try {
    const existingReadingsJson = await AsyncStorage.getItem(
      STORAGE_KEYS.PENDING_READINGS,
    );
    const existingReadings: MeterReading[] = existingReadingsJson
      ? JSON.parse(existingReadingsJson)
      : [];

    const readingIndex = existingReadings.findIndex((r) => r.id === readingId);
    if (readingIndex >= 0) {
      existingReadings[readingIndex].syncStatus = status;
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_READINGS,
        JSON.stringify(existingReadings),
      );
    }
  } catch (error) {
    console.error("Error updating reading sync status:", error);
  }
};

// Remove synced readings
export const removeSyncedReadings = async (): Promise<void> => {
  try {
    const existingReadingsJson = await AsyncStorage.getItem(
      STORAGE_KEYS.PENDING_READINGS,
    );
    const existingReadings: MeterReading[] = existingReadingsJson
      ? JSON.parse(existingReadingsJson)
      : [];

    const pendingReadings = existingReadings.filter(
      (r) => r.syncStatus !== "synced",
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.PENDING_READINGS,
      JSON.stringify(pendingReadings),
    );
  } catch (error) {
    console.error("Error removing synced readings:", error);
  }
};

// Save last sync time
export const saveLastSyncTime = async (timestamp: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, timestamp);
  } catch (error) {
    console.error("Error saving last sync time:", error);
  }
};

// Get last sync time
export const getLastSyncTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
  } catch (error) {
    console.error("Error getting last sync time:", error);
    return null;
  }
};

// Save routes data for offline access
export const saveRoutesData = async (routes: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ROUTES_DATA,
      JSON.stringify(routes),
    );
  } catch (error) {
    console.error("Error saving routes data:", error);
  }
};

// Get routes data from offline storage
export const getRoutesData = async (): Promise<any[]> => {
  try {
    const routesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTES_DATA);
    return routesJson ? JSON.parse(routesJson) : [];
  } catch (error) {
    console.error("Error getting routes data:", error);
    return [];
  }
};
