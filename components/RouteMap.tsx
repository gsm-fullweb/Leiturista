import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MapPin, Navigation, Map, Layers } from "lucide-react-native";
import { WebView } from "react-native-webview";

interface Location {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  completed: boolean;
}

interface RouteMapProps {
  locations?: Location[];
  currentLocationId?: string;
  onLocationSelect?: (locationId: string) => void;
  showSatelliteView?: boolean;
}

const RouteMap = ({
  locations = [
    {
      id: "1",
      address: "123 Main St",
      latitude: 40.7128,
      longitude: -74.006,
      completed: true,
    },
    {
      id: "2",
      address: "456 Park Ave",
      latitude: 40.7142,
      longitude: -74.0064,
      completed: false,
    },
    {
      id: "3",
      address: "789 Broadway",
      latitude: 40.7112,
      longitude: -74.0055,
      completed: false,
    },
  ],
  currentLocationId = "2",
  onLocationSelect = () => {},
  showSatelliteView = false,
}: RouteMapProps) => {
  const [mapType, setMapType] = useState<"standard" | "satellite">(
    showSatelliteView ? "satellite" : "standard",
  );
  const [userLocation, setUserLocation] = useState({
    latitude: 40.7128,
    longitude: -74.006,
  });

  // Find the current location object
  const currentLocation =
    locations.find((loc) => loc.id === currentLocationId) || locations[0];

  // Generate HTML for the map
  const generateMapHTML = () => {
    const mapCenter = currentLocation
      ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
      : { lat: userLocation.latitude, lng: userLocation.longitude };

    const mapTypeId = mapType === "satellite" ? "satellite" : "roadmap";

    const locationMarkers = locations
      .map((loc) => {
        const pinColor = loc.completed
          ? "#4CAF50"
          : loc.id === currentLocationId
            ? "#FF9800"
            : "#F44336";
        return `
        var marker${loc.id} = new google.maps.Marker({
          position: {lat: ${loc.latitude}, lng: ${loc.longitude}},
          map: map,
          title: "${loc.address}",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "${pinColor}",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#FFFFFF",
            scale: 10
          }
        });
        
        marker${loc.id}.addListener('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({action: 'markerClick', id: '${loc.id}'}));
        });
      `;
      })
      .join("");

    // Create a path connecting all locations in order
    const pathCoordinates = locations
      .map((loc) => `{lat: ${loc.latitude}, lng: ${loc.longitude}}`)
      .join(",");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body, html, #map { height: 100%; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            function initMap() {
              var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: ${mapCenter.lat}, lng: ${mapCenter.lng}},
                zoom: 15,
                mapTypeId: '${mapTypeId}',
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
              });
              
              ${locationMarkers}
              
              var routePath = new google.maps.Polyline({
                path: [${pathCoordinates}],
                geodesic: true,
                strokeColor: '#2196F3',
                strokeOpacity: 0.8,
                strokeWeight: 3
              });
              
              routePath.setMap(map);
              
              // Current user location marker
              var userMarker = new google.maps.Marker({
                position: {lat: ${userLocation.latitude}, lng: ${userLocation.longitude}},
                map: map,
                title: "Your Location",
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#2196F3",
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: "#FFFFFF",
                  scale: 8
                }
              });
            }
          </script>
          <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.action === "markerClick" && data.id) {
        onLocationSelect(data.id);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <View className="bg-white w-full h-[300px] rounded-lg overflow-hidden">
      <WebView
        source={{ html: generateMapHTML() }}
        style={{ flex: 1 }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        geolocationEnabled={true}
      />

      {/* Map Controls */}
      <View className="absolute bottom-4 right-4 flex-row space-x-2">
        <TouchableOpacity
          className="bg-white p-2 rounded-full shadow-md"
          onPress={() =>
            setMapType(mapType === "standard" ? "satellite" : "standard")
          }
        >
          <Layers size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white p-2 rounded-full shadow-md"
          onPress={() => {
            // Navigate to current location - in a real app, this would use device GPS
            // For now, just center on the current selected location
            if (currentLocation) {
              setUserLocation({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              });
            }
          }}
        >
          <Navigation size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
        <View className="flex-row items-center mb-1">
          <View className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2" />
          <Text className="text-xs text-gray-700">Completed</Text>
        </View>
        <View className="flex-row items-center mb-1">
          <View className="w-3 h-3 rounded-full bg-[#FF9800] mr-2" />
          <Text className="text-xs text-gray-700">Current</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-[#F44336] mr-2" />
          <Text className="text-xs text-gray-700">Pending</Text>
        </View>
      </View>
    </View>
  );
};

export default RouteMap;
