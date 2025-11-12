import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LiveDataService } from "../../../services/liveDataService";

const LiveStatus = () => {
  const navigation = useNavigation();
  const [liveData, setLiveData] = useState({
    weather: null,
    traffic: null,
    crowds: null,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const colors = {
    primary: "#DC143C",
  };

  useEffect(() => {
    loadLiveData();

    // Refresh data every 5 minutes
    const interval = setInterval(loadLiveData, 300000);

    return () => clearInterval(interval);
  }, []);

  const loadLiveData = async () => {
    try {
      setLoading(true);

      const [weather, traffic, crowds] = await Promise.all([
        LiveDataService.getWeatherData(),
        LiveDataService.getTrafficData(),
        LiveDataService.getCrowdData(),
      ]);

      setLiveData({
        weather,
        traffic,
        crowds,
      });

      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.log("❌ Error loading live data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      perfect: "#10B981",
      good: "#059669",
      moderate: "#F59E0B",
      poor: "#DC2626",
      recommended: "#8B5CF6",
    };
    return colors[status] || "#6B7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      perfect: "check-circle",
      good: "thumbs-up",
      moderate: "alert-circle",
      poor: "alert-triangle",
      recommended: "clock",
    };
    return icons[status] || "help-circle";
  };

  const statusItems = [
    {
      id: "weather",
      icon: liveData.weather?.icon || "sun",
      title: "Weather",
      subtitle: loading
        ? "Loading..."
        : `${liveData.weather?.temperature}°C • ${liveData.weather?.condition}`,
      status: liveData.weather?.status || "good",
      color: getStatusColor(liveData.weather?.status),
      detail: liveData.weather?.description || "Checking...",
    },
    {
      id: "traffic",
      icon: "trending-up",
      title: "Traffic",
      subtitle: loading
        ? "Loading..."
        : `${liveData.traffic?.traffic} • ${liveData.traffic?.duration}min`,
      status: liveData.traffic?.status || "good",
      color: getStatusColor(liveData.traffic?.status),
      detail:
        `To city center • ${liveData.traffic?.distance}km` || "Checking...",
    },
    {
      id: "crowds",
      icon: "users",
      title: "Crowds",
      subtitle: loading ? "Loading..." : liveData.crowds?.level || "Moderate",
      status: liveData.crowds?.status || "moderate",
      color: getStatusColor(liveData.crowds?.status),
      detail: `Peak: ${liveData.crowds?.peak}` || "11AM-2PM",
    },
    {
      id: "best-time",
      icon: "clock",
      title: "Best Time",
      subtitle: "3-5PM",
      status: "recommended",
      color: "#7C3AED",
      detail: "Golden hour photos",
    },
  ];

  const getOverallStatus = () => {
    if (loading)
      return { status: "loading", message: "Checking conditions..." };

    const statuses = [
      liveData.weather?.status,
      liveData.traffic?.status,
      liveData.crowds?.status,
    ];

    if (statuses.includes("poor")) {
      return { status: "poor", message: "Challenging conditions today" };
    } else if (statuses.includes("moderate")) {
      return {
        status: "moderate",
        message: "Good day with some considerations",
      };
    } else {
      return { status: "good", message: "Perfect day for exploration!" };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <View className="px-4 py-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Feather name="activity" size={20} color={colors.primary} />
          <Text className="text-xl font-bold text-gray-800 ml-2">
            Live Status
          </Text>
        </View>
        <TouchableOpacity onPress={loadLiveData} disabled={loading}>
          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full mr-1 ${
                loading ? "bg-yellow-500" : "bg-green-500"
              }`}
            />
            <Text
              className={`text-xs font-semibold ${
                loading ? "text-yellow-600" : "text-green-600"
              }`}
            >
              {loading ? "UPDATING" : "LIVE"}
            </Text>
            {lastUpdated && (
              <Text className="text-gray-500 text-xs ml-2">{lastUpdated}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between">
        {statusItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="items-center active:scale-95"
            onPress={loadLiveData}
          >
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center border"
              style={{
                backgroundColor: `${item.color}15`,
                borderColor: `${item.color}30`,
              }}
            >
              <Feather name={item.icon} size={24} color={item.color} />
            </View>
            <Text className="font-semibold text-gray-800 text-sm text-center mb-1 mt-2">
              {item.title}
            </Text>
            <Text className="text-gray-500 text-xs text-center">
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Status Bar */}
      <View
        className={`rounded-xl p-3 mt-3 border ${
          overallStatus.status === "good"
            ? "bg-green-50 border-green-200"
            : overallStatus.status === "moderate"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-red-50 border-red-200"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather
              name={getStatusIcon(overallStatus.status)}
              size={16}
              color={getStatusColor(overallStatus.status)}
            />
            <Text
              className={`text-sm font-semibold ml-2 ${
                overallStatus.status === "good"
                  ? "text-green-700"
                  : overallStatus.status === "moderate"
                    ? "text-yellow-700"
                    : "text-red-700"
              }`}
            >
              {overallStatus.message}
            </Text>
          </View>
          <Text className="text-gray-500 text-xs">
            {loading ? "Updating..." : `Updated ${lastUpdated}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LiveStatus;
