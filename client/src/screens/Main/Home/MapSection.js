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
      <>
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
      </>
    );
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
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }
          }
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <UserLocationRadius />
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              title={spot.name}
              onPress={() => onSpotPress(spot)}
            >
              <View
                className="w-8 h-8 rounded-full border-2 border-white items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Feather name="map-pin" size={14} color="white" />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
};

export default MapSection;
