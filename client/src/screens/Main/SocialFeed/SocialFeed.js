import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from "react-native";
import React, { useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";

export default function SocialFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Maria Santos",
        avatar: "👩",
        location: "Cebu City",
      },
      content:
        "Just visited Kawasan Falls! The turquoise waters are even more breathtaking in person. The canyoneering adventure was absolutely worth it! 💦",
      image: "🏞️",
      location: "Kawasan Falls, Badian",
      likes: 42,
      comments: 8,
      timestamp: "2 hours ago",
      liked: false,
    },
    {
      id: 2,
      user: {
        name: "John Reyes",
        avatar: "👨",
        location: "Manila",
      },
      content:
        "Cebu's lechon is LEGENDARY! Just had the crispiest skin and most flavorful meat at CNT. A must-try for every foodie visiting Cebu! 🍖",
      image: "🍽️",
      location: "CNT Lechon, Mandaue",
      likes: 28,
      comments: 5,
      timestamp: "5 hours ago",
      liked: true,
    },
    {
      id: 3,
      user: {
        name: "Sarah Chen",
        avatar: "👧",
        location: "Singapore",
      },
      content:
        "Sunset at Temple of Leah was magical! The golden hour views over Cebu City are unforgettable. Perfect spot for photography enthusiasts. 🌅",
      image: "🏛️",
      location: "Temple of Leah, Cebu City",
      likes: 67,
      comments: 12,
      timestamp: "1 day ago",
      liked: false,
    },
    {
      id: 4,
      user: {
        name: "Miguel Torres",
        avatar: "🧔",
        location: "Davao",
      },
      content:
        "First time trying puso (hanging rice) with sutukil! The fresh seafood and unique dining experience made this meal unforgettable. 🦐",
      image: "🦀",
      location: "Sutukil, Mactan",
      likes: 34,
      comments: 7,
      timestamp: "2 days ago",
      liked: true,
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  const filters = [
    { id: "all", label: "All Posts" },
    { id: "popular", label: "Popular" },
    { id: "recent", label: "Recent" },
    { id: "food", label: "Food" },
    { id: "adventure", label: "Adventure" },
  ];

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate fetching new posts
      setRefreshing(false);
    }, 1500);
  };

  const PostCard = ({ post }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 mx-4 border border-gray-200 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
            <Text className="text-lg">{post.user.avatar}</Text>
          </View>
          <View>
            <Text className="font-bold text-gray-900 text-sm">
              {post.user.name}
            </Text>
            <View className="flex-row items-center">
              <Feather name="map-pin" size={10} color={colors.muted} />
              <Text className="text-gray-500 text-xs ml-1">
                {post.user.location} • {post.timestamp}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Location Tag */}
      <View className="mb-3">
        <View className="bg-red-50 px-3 py-1 rounded-full self-start">
          <Text className="text-red-700 text-xs font-semibold">
            📍 {post.location}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text className="text-gray-800 text-sm leading-5 mb-3">
        {post.content}
      </Text>

      {/* Image/Media */}
      <View className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mb-3 justify-center items-center">
        <Text className="text-4xl">{post.image}</Text>
      </View>

      {/* Engagement Stats */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            onPress={() => handleLike(post.id)}
            className="flex-row items-center"
          >
            <Feather
              name="heart"
              size={18}
              color={post.liked ? colors.primary : colors.muted}
              fill={post.liked ? colors.primary : "none"}
            />
            <Text
              className={`ml-1 text-sm ${
                post.liked ? "text-red-600 font-semibold" : "text-gray-500"
              }`}
            >
              {post.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Feather name="message-circle" size={18} color={colors.muted} />
            <Text className="ml-1 text-gray-500 text-sm">{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Feather name="share-2" size={16} color={colors.muted} />
            <Text className="ml-1 text-gray-500 text-sm">Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Feather name="bookmark" size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-4 pb-4 px-5 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-gray-900">
              Community Feed
            </Text>
            <Text className="text-red-600 text-sm font-semibold">
              Share your Cebu experiences
            </Text>
          </View>
          <TouchableOpacity
            className="bg-red-600 w-10 h-10 rounded-xl items-center justify-center"
            onPress={() => navigation.navigate("CreatePost")}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200 bg-white"
      >
        <View className="flex-row px-4 py-3">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full mr-2 ${
                activeFilter === filter.id ? "bg-red-600" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeFilter === filter.id ? "text-white" : "text-gray-700"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        className="flex-1"
      >
        {/* Create Post Prompt */}
        <TouchableOpacity
          className="bg-white mx-4 mt-4 rounded-2xl p-4 border border-gray-200 shadow-sm flex-row items-center"
          onPress={() => navigation.navigate("CreatePost")}
        >
          <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
            <Feather name="camera" size={18} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-gray-500 text-sm">
              Share your Cebu adventure...
            </Text>
          </View>
          <Feather name="image" size={18} color={colors.muted} />
        </TouchableOpacity>

        {/* Posts */}
        <View className="mt-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>

        {/* Load More */}
        <TouchableOpacity className="items-center py-6">
          <Text className="text-red-600 font-semibold text-sm">
            Load more posts
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}
