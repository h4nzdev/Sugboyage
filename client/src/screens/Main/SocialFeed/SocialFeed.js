import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../../components/Layout/ScreenWrapper";
import { PostService } from "../../../services/post_services/postService";
import { useAuth } from "../../../context/AuthenticationContext";

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

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

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching posts from API...");

      const result = await PostService.getAllPosts();

      if (result.success && result.posts) {
        console.log(`✅ Loaded ${result.posts.length} posts`);
        setPosts(result.posts);
      } else {
        console.log("❌ No posts found or API error");
        setPosts([]);
      }
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                liked: !post.liked,
                engagement: {
                  ...post.engagement,
                  likes: post.liked
                    ? post.engagement.likes - 1
                    : post.engagement.likes + 1,
                },
              }
            : post
        )
      );

      // Call API
      const result = await PostService.likePost(postId);

      if (!result.success) {
        // Revert if API call fails
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  engagement: {
                    ...post.engagement,
                    likes: post.liked
                      ? post.engagement.likes + 1
                      : post.engagement.likes - 1,
                  },
                }
              : post
          )
        );
        console.error("❌ Failed to like post");
      }
    } catch (error) {
      console.error("❌ Error liking post:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Format timestamp
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  // Filter posts based on active filter
  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "popular") return post.engagement.likes > 10;
    if (activeFilter === "recent") {
      const postDate = new Date(post.createdAt);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return postDate > yesterday;
    }
    if (activeFilter === "food") return post.category === "food";
    if (activeFilter === "adventure") return post.category === "adventure";
    return true;
  });

  const PostCard = ({ post }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 mx-4 border border-gray-200 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
            <Text className="text-lg">
              {post.author?.profile?.avatar || "👤"}
            </Text>
          </View>
          <View>
            <Text
              onPress={() => navigation.navigate("user-profile")}
              className="font-bold text-gray-900 text-sm"
            >
              {post.author?.profile?.displayName ||
                post.author?.username ||
                "Anonymous"}
            </Text>
            <View className="flex-row items-center">
              <Feather name="map-pin" size={10} color={colors.muted} />
              <Text className="text-gray-500 text-xs ml-1">
                {post.author?.profile?.location || "Cebu"} •{" "}
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={18} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Location Tag */}
      {post.location?.name && (
        <View className="mb-3">
          <View className="bg-red-50 px-3 py-1 rounded-full self-start">
            <Text className="text-red-700 text-xs font-semibold">
              📍 {post.location.name}
            </Text>
          </View>
        </View>
      )}

      {/* Category Tag */}
      {post.category && post.category !== "other" && (
        <View className="mb-2">
          <View className="bg-blue-50 px-3 py-1 rounded-full self-start">
            <Text className="text-blue-700 text-xs font-semibold capitalize">
              #{post.category}
            </Text>
          </View>
        </View>
      )}

      {/* Content */}
      <Text className="text-gray-800 text-sm leading-5 mb-3">
        {post.content}
      </Text>

      {/* Image/Media */}
      {post.media?.images?.length > 0 ? (
        <View className="h-48 bg-gray-100 rounded-xl mb-3 justify-center items-center">
          <Text className="text-4xl">🖼️</Text>
          <Text className="text-gray-500 text-sm mt-2">
            {post.media.images.length} photo
            {post.media.images.length > 1 ? "s" : ""}
          </Text>
        </View>
      ) : (
        <View className="h-32 bg-gray-50 rounded-xl mb-3 justify-center items-center">
          <Text className="text-lg mb-4 text-gray-500">
            No image to display
          </Text>
          <Feather name="camera-off" size={24} color={"gray"} />
        </View>
      )}

      {/* Engagement Stats */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => handleLike(post._id)}
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
              {post.engagement?.likes || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Feather name="message-circle" size={18} color={colors.muted} />
            <Text className="ml-1 text-gray-500 text-sm">
              {post.engagement?.comments || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Feather name="share-2" size={16} color={colors.muted} />
            <Text className="ml-1 text-gray-500 text-sm">
              {post.engagement?.shares || 0}
            </Text>
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
            onPress={() => navigation.navigate("add-post")}
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
          onPress={() => navigation.navigate("add-post")}
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

        {/* Loading State */}
        {loading && (
          <View className="items-center py-8">
            <Text className="text-gray-500">Loading posts...</Text>
          </View>
        )}

        {/* Posts */}
        <View className="mt-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : !loading ? (
            <View className="items-center py-12 mx-4">
              <Feather name="camera" size={48} color={colors.muted} />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                No posts yet
                {activeFilter !== "all" ? ` in ${activeFilter}` : ""}
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center">
                Be the first to share your Cebu experience!
              </Text>
            </View>
          ) : null}
        </View>

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <TouchableOpacity className="items-center py-6" onPress={fetchPosts}>
            <Text className="text-red-600 font-semibold text-sm">
              Load more posts
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
