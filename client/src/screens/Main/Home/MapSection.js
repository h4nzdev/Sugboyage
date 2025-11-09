import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "../../../utils/colors";

const MapSection = ({ spots, onSpotPress }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permision Denied");
      }

      //Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserLocation({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.log("User static location:", error);
      //Fallback
      setUserLocation({
        latitude: 10.3157,
        longitude: 123.8854,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (locationLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-20">
        <View className="flex-row items-center text-gray-800 font-bold text-lg gap-2">
          <Text>Getting your location</Text>
          <View className="animate-spin items-center justify-center">
            <Feather name="loader" size={24} />
          </View>
        </View>
      </View>
    );
  }

  const UserLocationRadius = () => {
    const [radius, setRadius] = useState(1000);
    if (!userLocation) return null;

    return (
      <React.Fragment key="user-location-radius">
        {/* Main radius circle */}
        <Circle
          center={userLocation}
          radius={radius}
          strokeWidth={2}
          strokeColor={colors.primary}
          fillColor="rgba(220, 20, 60, 0.1)"
        />

        {/* Pulsing effect circle */}
        <Circle
          center={userLocation}
          radius={radius * 0.3}
          strokeWidth={1}
          strokeColor={colors.primary}
          fillColor="rgba(220, 20, 60, 0.2)"
        />
      </React.Fragment>
    );
  };

  // Create unique keys for spots
  const getUniqueSpotKey = (spot, index) => {
    // Use a combination of id, coordinates, and index to ensure uniqueness
    return `spot-${spot.id}-${spot.latitude}-${spot.longitude}-${index}`;
  };

  return (
    <View className="px-4 mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-bold text-gray-900">Explore Map</Text>
        <TouchableOpacity className="bg-red-600 px-3 py-1 rounded-full flex-row items-center">
          <View className="w-2 h-2 bg-white rounded-full mr-1" />
          <Text className="text-white text-xs font-semibold">LIVE</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl overflow-hidden h-64 shadow-md">
        <MapView
          style={{ flex: 1 }}
          initialRegion={
            userLocation || {
              latitude: 10.3157,
              longitude: 123.8854,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }
          }
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <UserLocationRadius key="user-radius-component" />
          {spots.map((spot, index) => (
            <Marker
              key={getUniqueSpotKey(spot, index)}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => onSpotPress(spot)}
            >
              <View className="h-6 w-6 bg-red-300 rounded-full border border-red-500 items-center justify-center">
                <Feather name="map-pin" color={"red"} />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
};

export default MapSection;
