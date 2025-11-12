import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Directions } from "openrouteservice-js";
import { useNotification } from "../../../context/NotificationContext";
import CategoryFilter from "./CategoryFilter";
import TravelModeSelector from "./TravelModeSelector";
import { LocationController } from "../../../components/LocationController";

// ==================== CONSTANTS ====================
const OPENROUTE_API_KEY =
  "";
const orsDirections = new Directions({ api_key: OPENROUTE_API_KEY });

const RADIUS_OPTIONS = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 2000, label: "2km" },
  { value: 5000, label: "5km" },
  { value: 10000, label: "10km" },
];

// ==================== UTILITY FUNCTIONS ====================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
};

const formatDistance = (distance) => {
  return distance <= 1000
    ? `${Math.round(distance)}m`
    : `${(distance / 1000).toFixed(1)}km`;
};

// ==================== MEMOIZED COMPONENTS ====================

const RadiusSelector = memo(({ radius, setRadius, spotsCount }) => {
  const [showRadius, setShowRadius] = useState(false);

  return (
    <View className="absolute top-20 right-4 z-10">
      <TouchableOpacity
        onPress={() => setShowRadius(!showRadius)}
        className="bg-white p-3 rounded-xl shadow-lg"
      >
        <Feather name="target" size={20} color="#DC143C" />
      </TouchableOpacity>

      {showRadius && (
        <View className="absolute top-12 right-0 bg-white rounded-xl p-3 shadow-lg min-w-[120px]">
          <Text className="text-gray-700 font-bold mb-2 text-center">
            Radius
          </Text>
          {RADIUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                setRadius(option.value);
                setShowRadius(false);
              }}
              className={`px-3 py-2 rounded-lg mb-1 ${radius === option.value ? "bg-red-500" : "bg-gray-100"}`}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  radius === option.value ? "text-white" : "text-gray-700"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          <Text className="text-gray-500 text-xs mt-2 text-center">
            {spotsCount} spots found
          </Text>
        </View>
      )}
    </View>
  );
});

const SpotCard = memo(
  ({
    spot,
    userLocation,
    radius,
    onNavigate,
    onClose,
    travelMode,
    setTravelMode,
  }) => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    const isWithinRadius = distance <= radius;

    if (!spot || !userLocation) return null;

    return (
      <View className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-2xl p-4 shadow-lg">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{spot.name}</Text>
            <Text className="text-gray-500 text-sm mb-2">{spot.location}</Text>
            <Text className="text-gray-600 text-sm mb-3">
              {spot.description}
            </Text>

            <TravelModeSelector
              travelMode={travelMode}
              setTravelMode={setTravelMode}
            />

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather name="star" size={14} color="#F59E0B" />
                <Text className="text-gray-800 font-medium ml-1">
                  {spot.rating}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${isWithinRadius ? "bg-green-100" : "bg-red-100"}`}
              >
                <Text
                  className={`text-sm font-medium ${isWithinRadius ? "text-green-700" : "text-red-700"}`}
                >
                  {formatDistance(distance)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} className="p-1">
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onNavigate(spot)}
          className={`py-3 rounded-xl ${isWithinRadius ? "bg-green-600" : "bg-red-600"}`}
        >
          <Text className="text-white text-center font-medium">
            START NAVIGATION
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const OptimizedMarker = memo(({ spot, onPress, getMarkerColor }) => {
  const markerColor = getMarkerColor(spot);

  return (
    <Marker
      coordinate={{
        latitude: spot.latitude,
        longitude: spot.longitude,
      }}
      onPress={onPress}
      pinColor={markerColor}
      tracksViewChanges={false}
      stopPropagation={true}
    />
  );
});

// ==================== MAIN COMPONENT ====================
export default function Map() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [travelMode, setTravelMode] = useState("foot-walking");

  const mapRef = useRef();
  const navigation = useNavigation();
  const { radius, setRadius, spots, loadSpots, sendTestNotification } =
    useNotification();
  const locationWatcherRef = useRef(null);

  const filteredSpots = useMemo(() => {
    if (selectedCategory === "All") return spots;

    return spots.filter(
      (spot) => spot.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [spots, selectedCategory]);

  const visibleSpots = useMemo(() => {
    return filteredSpots.slice(0, 50);
  }, [filteredSpots]);

  const spotsWithinRadius = useMemo(() => {
    if (!userLocation) return [];
    return filteredSpots.filter((spot) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );
      return distance <= radius;
    });
  }, [filteredSpots, userLocation, radius]);

  const getMarkerColor = useCallback(
    (spot) => {
      if (!userLocation) return "red";
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );
      return distance <= radius ? "green" : "red";
    },
    [userLocation, radius]
  );

  const focusOnSpot = useCallback((spot) => {
    setSelectedSpot(spot);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: spot.latitude,
          longitude: spot.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  }, []);

  const focusOnUser = useCallback(() => {
    setSelectedSpot(null);
    setIsNavigating(false);
    setRouteInfo(null);
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 500);
    }
  }, [userLocation]);

  const handleUserMove = useCallback((direction) => {
    setUserLocation((prevLocation) => {
      if (!prevLocation) return prevLocation;
      const step = 0.001;
      const newLocation = { ...prevLocation };

      switch (direction) {
        case "up":
          newLocation.latitude += step;
          break;
        case "down":
          newLocation.latitude -= step;
          break;
        case "left":
          newLocation.longitude -= step;
          break;
        case "right":
          newLocation.longitude += step;
          break;
        default:
          return prevLocation;
      }

      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 500);
      }
      return newLocation;
    });
  }, []);

  useEffect(() => {
    setupApp();

    return () => {
      if (locationWatcherRef.current) {
        locationWatcherRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && userLocation) {
      const timer = setTimeout(() => {
        mapRef.current.animateToRegion(userLocation, 350);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userLocation]);

  useEffect(() => {
    if (spots.length === 0) {
      loadSpots();
    }
  }, []);

  const setupApp = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await getCurrentLocation();
      }
    } catch (error) {
      console.log("Setup error:", error);
      setUserLocation({
        latitude: 10.3157,
        longitude: 123.8854,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // ✅ Reduced from High to Balanced
        timeout: 10000,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setUserLocation(newLocation);

      // ✅ Reduced update frequency
      locationWatcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Lowest,
          timeInterval: 30000,
          distanceInterval: 50,
        },
        (loc) => {
          setUserLocation((prev) => ({
            ...prev,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          }));
        }
      );
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  const startNavigation = async (spot) => {
    if (!userLocation) return;

    setIsNavigating(true);
    setSelectedSpot(null);

    try {
      const route = await orsDirections.calculate({
        coordinates: [
          [userLocation.longitude, userLocation.latitude],
          [spot.longitude, spot.latitude],
        ],
        profile: travelMode,
        format: "geojson",
      });

      if (route.features?.[0]) {
        const routeData = route.features[0];
        const coordinates = routeData.geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        const distance = routeData.properties.segments[0].distance / 1000;
        const duration = routeData.properties.segments[0].duration / 60;

        setRouteInfo({
          distance,
          duration,
          coordinates,
        });

        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.log("Navigation error:", error);
      if (userLocation && spot) {
        setRouteInfo({
          coordinates: [
            {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            { latitude: spot.latitude, longitude: spot.longitude },
          ],
        });
      }
    }
  };

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setRouteInfo(null);
    focusOnUser();
  }, [focusOnUser]);

  if (!userLocation) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-800 font-medium">
          Getting your location...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>

          <Text className="text-lg font-bold">Cebu Map</Text>

          <View className="p-2">
            <Feather name="map-pin" size={20} color="#333" />
          </View>
        </View>
      </View>

      <View className="flex-1 relative">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={userLocation}
          showsUserLocation={true}
          showsMyLocationButton={false}
          moveOnMarkerPress={false}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
        >
          {userLocation && (
            <Circle
              center={userLocation}
              radius={radius}
              strokeWidth={1}
              strokeColor="#DC143C"
              fillColor="rgba(220, 20, 60, 0.1)"
            />
          )}

          {isNavigating && routeInfo?.coordinates && (
            <Polyline
              coordinates={routeInfo.coordinates}
              strokeWidth={3}
              strokeColor="#3B82F6"
            />
          )}

          {visibleSpots.map((spot, index) => (
            <OptimizedMarker
              key={`spot-${spot.id || spot._id || index}`}
              spot={spot}
              userLocation={userLocation}
              radius={radius}
              onPress={() => focusOnSpot(spot)}
              getMarkerColor={getMarkerColor}
            />
          ))}
        </MapView>

        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <RadiusSelector
          radius={radius}
          setRadius={setRadius}
          spotsCount={spotsWithinRadius.length}
        />

        {/* 🎮 TEST CONTROLLER - For geofencing testing */}
        <LocationController onMove={handleUserMove} />

        <View className="absolute top-20 left-4 z-10">
          <TouchableOpacity
            onPress={focusOnUser}
            className="bg-white p-3 rounded-xl shadow-lg mb-2"
          >
            <Feather name="navigation" size={20} color="#DC143C" />
          </TouchableOpacity>

          {isNavigating && (
            <TouchableOpacity
              onPress={stopNavigation}
              className="bg-red-500 p-3 rounded-xl shadow-lg"
            >
              <Feather name="x" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {selectedSpot && (
          <SpotCard
            spot={selectedSpot}
            userLocation={userLocation}
            radius={radius}
            onNavigate={startNavigation}
            onClose={() => setSelectedSpot(null)}
            travelMode={travelMode}
            setTravelMode={setTravelMode}
          />
        )}
      </View>

      <View className="px-4 py-3 border-t border-gray-200">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-600 text-sm flex-1">
            {spotsWithinRadius.length} {selectedCategory.toLowerCase()} spots
            within {radius / 1000}km
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log("🧪 TEST BUTTON: Triggering manual notification");
              sendTestNotification();
            }}
            className="bg-yellow-500 px-3 py-1 rounded-lg"
          >
            <Text className="text-white text-xs font-bold">TEST</Text>
          </TouchableOpacity>
        </View>
        {userLocation && (
          <Text className="text-gray-400 text-xs text-center">
            Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
