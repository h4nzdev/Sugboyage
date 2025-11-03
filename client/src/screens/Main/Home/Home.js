import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle } from "react-native-maps";
import MainHeader from "../../../components/Header/MainHeader";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";

export default function Home() {
  const colors = {
    primary: "#06b6d4",
    secondary: "#22d3ee",
    accent: "#67e8f9",
    light: "#f0fdff",
    background: "#ffffff",
    border: "#cffafe",
    text: "#164e63",
    muted: "#0e7490",
  };

  const popularSpots = [
    {
      id: 1,
      name: "Temple of Leah",
      latitude: 10.3567,
      longitude: 123.8756,
      type: "historical",
      distance: "15 min",
      rating: 4.8,
      image:
        "https://w5x6j5c9.delivery.rocketcdn.me/wp-content/uploads/2024/06/temple-of-leah-building-front.jpg",
    },
    {
      id: 2,
      name: "Magellan's Cross",
      latitude: 10.294,
      longitude: 123.9022,
      type: "cultural",
      distance: "20 min",
      rating: 4.5,
      image:
        "https://w5x6j5c9.delivery.rocketcdn.me/wp-content/uploads/2024/03/magellan-cross-cebu-1024x768.jpg",
    },
    {
      id: 3,
      name: "Kawasan Falls",
      latitude: 9.8167,
      longitude: 123.3833,
      type: "adventure",
      distance: "2.5 hrs",
      rating: 4.9,
      image:
        "https://i0.wp.com/kawasanfalls.net/wp-content/uploads/2011/04/kawasan-falls-pana-4.jpg?w=1000&ssl=1",
    },
  ];

  const userLocation = {
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const categories = [
    { icon: "map-pin", name: "Nearby" },
    { icon: "coffee", name: "Food" },
    { icon: "sun", name: "Beach" },
    { icon: "book", name: "Culture" },
    { icon: "compass", name: "Adventure" },
  ];

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <MainHeader />

        {/* Search Bar */}
        <View className="px-5 mt-2 mb-4">
          <TouchableOpacity
            className="bg-white rounded-xl px-4 py-3 flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Feather name="search" size={18} color={colors.muted} />
            <Text className="ml-3 text-sm" style={{ color: colors.muted }}>
              Search for places, food, activities...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location Badge */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center">
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text
              className="text-sm ml-1 font-semibold"
              style={{ color: colors.text }}
            >
              Nearby: Explore what's around you!
            </Text>
          </View>
        </View>

        {/* Category Pills */}
        <View className="mb-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-full px-4 py-2 flex-row items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Feather
                  name={category.icon}
                  size={16}
                  color={colors.primary}
                />
                <Text
                  className="ml-2 text-sm font-semibold"
                  style={{ color: colors.text }}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Attractions Nearby */}
        <View className="px-5 mb-5">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: colors.text }}
          >
            Top Attractions Nearby
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {popularSpots.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                className="bg-white rounded-xl overflow-hidden"
                style={{
                  width: 140,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <ImageBackground
                  source={{ uri: spot.image }}
                  className="h-32 w-full"
                />
                <View className="p-3">
                  <Text
                    className="font-semibold text-sm mb-1"
                    style={{ color: colors.text }}
                    numberOfLines={1}
                  >
                    {spot.name}
                  </Text>
                  <Text
                    className="text-xs mb-1"
                    style={{ color: colors.muted }}
                  >
                    {spot.type}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs" style={{ color: colors.muted }}>
                      {spot.distance}
                    </Text>
                    <View className="flex-row items-center">
                      <Feather name="star" size={10} color={colors.primary} />
                      <Text
                        className="text-xs ml-1 font-semibold"
                        style={{ color: colors.text }}
                      >
                        {spot.rating}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Must-Try Cebuano Food */}
        <View className="px-5 mb-5">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: colors.text }}
          >
            Must-Try Cebuano Food
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              className="bg-white rounded-xl overflow-hidden mb-3"
              style={{
                width: "48%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="h-24 bg-cyan-100" />
              <View className="p-3">
                <Text
                  className="font-semibold text-sm"
                  style={{ color: colors.text }}
                >
                  Cebu Lechon
                </Text>
                <Text className="text-xs" style={{ color: colors.muted }}>
                  Nilarang Baksal
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-xl overflow-hidden mb-3"
              style={{
                width: "48%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="h-24 bg-cyan-100" />
              <View className="p-3">
                <Text
                  className="font-semibold text-sm"
                  style={{ color: colors.text }}
                >
                  Local Delicacy
                </Text>
                <Text className="text-xs" style={{ color: colors.muted }}>
                  Try something new
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Section */}
        <View className="px-5 mb-5">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: colors.text }}
          >
            You Are Here
          </Text>
          <View
            className="bg-white rounded-xl overflow-hidden"
            style={{
              height: 180,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <MapView
              style={{ flex: 1 }}
              initialRegion={userLocation}
              showsUserLocation={true}
            >
              {popularSpots.map((spot) => (
                <Marker
                  key={spot.id}
                  coordinate={{
                    latitude: spot.latitude,
                    longitude: spot.longitude,
                  }}
                  title={spot.name}
                >
                  <View
                    className="w-6 h-6 rounded-full border-2 border-white items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Feather name="map-pin" size={12} color={colors.light} />
                  </View>
                </Marker>
              ))}
            </MapView>
          </View>
        </View>

        {/* Start Exploring CTA */}
        <View className="px-5 mb-8">
          <TouchableOpacity
            className="rounded-xl p-5 flex-row items-center justify-between"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <View className="flex-1">
              <Text className="text-white font-bold text-base mb-1">
                Ready to Explore?
              </Text>
              <Text className="text-white text-xs opacity-90">
                15+ amazing spots waiting for you
              </Text>
            </View>
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.light }}
            >
              <Feather name="arrow-right" size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
