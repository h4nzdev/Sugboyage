"use client";

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { memo } from "react";
import { Feather } from "@expo/vector-icons";

const CATEGORIES = [
  { icon: "map-pin", name: "All" },
  { icon: "book", name: "Cultural" },
  { icon: "home", name: "Historical" },
  { icon: "compass", name: "Adventure" },
  { icon: "sun", name: "Beach" },
];

const CategoryFilter = memo(({ selectedCategory, setSelectedCategory }) => {
  return (
    <View className="absolute top-4 left-4 right-4 z-10">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {CATEGORIES.map((category, index) => (
          <TouchableOpacity
            key={`category-${index}`}
            onPress={() => setSelectedCategory(category.name)}
            className={`px-4 py-3 rounded-2xl flex-row items-center ${
              selectedCategory === category.name ? "bg-red-600" : "bg-white/95"
            } border border-gray-200 shadow-lg`}
          >
            <Feather
              name={category.icon}
              size={16}
              color={selectedCategory === category.name ? "#FFF8DC" : "#DC143C"}
            />
            <Text
              className={`ml-2 font-bold text-sm ${
                selectedCategory === category.name
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

export default CategoryFilter;
