import NetInfo from "@react-native-community/netinfo";
import {
  getPendingReadings,
  updateReadingSyncStatus,
  saveLastSyncTime,
  MeterReading,
  removeSyncedReadings,
} from "./storage";

// Check if device is online
export const checkOnlineStatus = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected === true && netInfo.isInternetReachable === true;
  } catch (error) {
    console.error("Error checking online status:", error);
    return false;
  }
};

// Simple delay function that works with AbortController
const delay = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Operation aborted"));
      return;
    }

    const id = setTimeout(() => {
      resolve();
    }, ms);

    // Set up abort handler if signal is provided
    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(id);
          reject(new Error("Operation aborted"));
        },
        { once: true },
      );
    }
  });
};

// Sync all pending readings
export const syncPendingReadings = async (): Promise<{
  success: boolean;
  syncedCount: number;
  errorCount: number;
}> => {
  // Create an abort controller for this sync operation
  const abortController = new AbortController();
  const signal = abortController.signal;

  try {
    // Check if online
    const isOnline = await checkOnlineStatus();
    if (!isOnline) {
      return { success: false, syncedCount: 0, errorCount: 0 };
    }

    // Get all pending readings
    const pendingReadings = await getPendingReadings();
    const pendingCount = pendingReadings.filter(
      (r) => r.syncStatus === "pending",
    ).length;

    if (pendingCount === 0) {
      // No pending readings to sync
      try {
        await saveLastSyncTime(new Date().toISOString());
      } catch (timeError) {
        console.error("Error saving last sync time:", timeError);
        // Continue despite this error
      }
      return { success: true, syncedCount: 0, errorCount: 0 };
    }

    let syncedCount = 0;
    let errorCount = 0;

    // Process each pending reading
    for (const reading of pendingReadings) {
      // Check if operation was aborted
      if (signal.aborted) {
        throw new Error("Sync operation was aborted");
      }

      if (reading.syncStatus === "pending") {
        try {
          // In a real app, this would be an API call to your backend
          // For demo purposes, we'll simulate a successful sync with a delay
          try {
            // Use our improved delay function that works with AbortController
            await delay(300, signal);

            // Simulate 90% success rate
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
              await updateReadingSyncStatus(reading.id, "synced");
              syncedCount++;
            } else {
              await updateReadingSyncStatus(reading.id, "error");
              errorCount++;
            }
          } catch (delayError) {
            // If this was an abort error, rethrow it
            if (signal.aborted) {
              throw delayError;
            }

            // Otherwise handle the error
            console.error("Error during sync delay:", delayError);
            await updateReadingSyncStatus(reading.id, "error");
            errorCount++;
          }
        } catch (error) {
          // Check if this was an abort error
          if (signal.aborted) {
            throw error; // Re-throw to be caught by outer try/catch
          }

          console.error("Error syncing reading:", reading.id, error);
          try {
            await updateReadingSyncStatus(reading.id, "error");
          } catch (statusError) {
            console.error("Failed to update reading status:", statusError);
          }
          errorCount++;
        }
      }
    }

    // Update last sync time
    try {
      await saveLastSyncTime(new Date().toISOString());
    } catch (timeError) {
      console.error("Error saving last sync time:", timeError);
      // Continue despite this error
    }

    // Clean up synced readings if all were successful
    if (errorCount === 0 && syncedCount > 0) {
      try {
        await removeSyncedReadings();
      } catch (cleanupError) {
        console.error("Error removing synced readings:", cleanupError);
        // Continue despite this error
      }
    }

    return {
      success: errorCount === 0,
      syncedCount,
      errorCount,
    };
  } catch (error) {
    console.error("Unexpected error during sync process:", error);
    // Check if this was an abort error
    if (signal.aborted) {
      return { success: false, syncedCount: 0, errorCount: -2 }; // Special code for aborted
    }
    return { success: false, syncedCount: 0, errorCount: -1 };
  } finally {
    // Clean up by aborting the controller if it hasn't been aborted yet
    if (!signal.aborted) {
      try {
        abortController.abort();
      } catch (abortError) {
        console.error("Error aborting sync controller:", abortError);
      }
    }
  }
};

// Listen for network changes and sync when back online
export const setupNetworkListener = (
  onNetworkChange: (isConnected: boolean) => void,
) => {
  // Create a flag to track if we're currently syncing to prevent multiple syncs
  let isSyncing = false;
  // Track if the listener is still active
  let isListenerActive = true;
  // Create an abort controller for sync operations
  const abortController = new AbortController();

  // Use a debounce mechanism to prevent rapid state changes
  let lastConnectionState: boolean | null = null;
  let debounceTimeoutId: NodeJS.Timeout | null = null;

  // Create a safe unsubscribe function
  const safeUnsubscribe = () => {
    if (!isListenerActive) return;

    // Mark as inactive first
    isListenerActive = false;

    // Clear any pending debounce timeout
    if (debounceTimeoutId !== null) {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = null;
    }

    // Abort any pending operations
    try {
      if (!abortController.signal.aborted) {
        abortController.abort();
      }
    } catch (abortError) {
      console.error("Error aborting network listener operations:", abortError);
    }

    // Unsubscribe from NetInfo if we have a subscription
    if (unsubscribeFunction) {
      try {
        unsubscribeFunction();
      } catch (error) {
        console.error("Error in NetInfo unsubscribe:", error);
      }
    }
  };

  // Set up the actual listener
  let unsubscribeFunction: (() => void) | null = null;

  try {
    unsubscribeFunction = NetInfo.addEventListener((state) => {
      // First check if the listener is still active
      if (!isListenerActive) return;

      try {
        const isConnected =
          state.isConnected === true && state.isInternetReachable !== false;

        // Debounce connection state changes
        if (lastConnectionState !== isConnected) {
          // Clear any existing timeout
          if (debounceTimeoutId !== null) {
            clearTimeout(debounceTimeoutId);
            debounceTimeoutId = null;
          }

          // Set a new timeout
          debounceTimeoutId = setTimeout(() => {
            // Only proceed if still active
            if (!isListenerActive) return;

            // Update the last known state
            lastConnectionState = isConnected;
            debounceTimeoutId = null;

            // Notify about connection change
            try {
              onNetworkChange(isConnected);
            } catch (callbackError) {
              console.error("Error in network change callback:", callbackError);
            }

            // If we just came back online, try to sync
            if (isConnected && !isSyncing && isListenerActive) {
              isSyncing = true;

              // Use a self-executing async function with proper error handling
              (async () => {
                try {
                  if (isListenerActive) {
                    await syncPendingReadings();
                  }
                } catch (syncError) {
                  console.error("Auto-sync failed:", syncError);
                } finally {
                  // Only update state if the listener is still active
                  if (isListenerActive) {
                    isSyncing = false;
                  }
                }
              })();
            }
          }, 300); // 300ms debounce
        }
      } catch (error) {
        console.error("Error in network listener callback:", error);
        // Reset syncing flag if there was an error
        if (isListenerActive) {
          isSyncing = false;

          // Try to notify about connection issues
          try {
            onNetworkChange(false);
          } catch (callbackError) {
            console.error(
              "Failed to notify about connection status:",
              callbackError,
            );
          }
        }
      }
    });
  } catch (netInfoError) {
    console.error("Error with NetInfo.addEventListener:", netInfoError);
    isListenerActive = false;
    // Try to notify about connection issues
    try {
      onNetworkChange(false);
    } catch (callbackError) {
      console.error("Failed to notify about connection status:", callbackError);
    }
  }

  // Return the safe unsubscribe function
  return safeUnsubscribe;
};
