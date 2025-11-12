import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PostService } from "../../../services/post_services/postService";
import { useAuth } from "../../../context/AuthenticationContext";

// Colors configuration
const colors = {
  primary: "#DC143C",
  secondary: "#FFF8DC",
  background: "#FFFFFF",
  text: "#2D3748",
  muted: "#718096",
  light: "#F7FAFC",
};

// User Stats Component
const UserStats = ({ user, isFollowing, onFollow }) => {
  const userStats = [
    {
      label: "Posts",
      value: user?.socialStats?.postsCount || "12",
      icon: "message-circle",
    },
    {
      label: "Followers",
      value: user?.socialStats?.followers || "245",
      icon: "users",
    },
    {
      label: "Following",
      value: user?.socialStats?.following || "156",
      icon: "user-plus",
    },
    { label: "Spots", value: "32", icon: "map-pin" },
  ];

  return (
    <View className="bg-red-50 rounded-2xl p-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-900 font-bold">Community Contributions</Text>
        <TouchableOpacity
          onPress={onFollow}
          className={`px-4 py-2 rounded-full ${
            isFollowing ? "bg-gray-200" : "bg-red-600"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              isFollowing ? "text-gray-700" : "text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between">
        {userStats.map((stat, index) => (
          <View key={index} className="items-center flex-1">
            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mb-2">
              <Feather name={stat.icon} size={18} color={colors.primary} />
            </View>
            <Text className="text-lg font-black text-gray-900">
              {stat.value}
            </Text>
            <Text className="text-gray-600 text-xs text-center">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// User Posts Component
const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const result = await PostService.getUserPosts(userId);

      if (result.success && result.posts) {
        setPosts(result.posts.slice(0, 4)); // Show only 4 latest posts
      } else {
        // Fallback to static data if API fails
        setPosts(staticPosts);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setPosts(staticPosts);
    } finally {
      setLoading(false);
    }
  };

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

  // Static posts data for fallback
  const staticPosts = [
    {
      _id: "1",
      content:
        "Just visited Kawasan Falls! The turquoise waters are absolutely breathtaking. The canyoneering adventure was worth every moment! 💦",
      location: { name: "Kawasan Falls, Badian" },
      engagement: { likes: 42, comments: 8 },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "2",
      content:
        "Cebu's lechon is everything they say and more! The crispy skin and flavorful meat at CNT is a must-try for every food lover. 🍖",
      location: { name: "CNT Lechon, Mandaue" },
      engagement: { likes: 28, comments: 5 },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "3",
      content:
        "Sunset at Temple of Leah was absolutely magical! The golden hour views over Cebu City are unforgettable. 🌅",
      location: { name: "Temple of Leah, Cebu City" },
      engagement: { likes: 67, comments: 12 },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  if (loading) {
    return (
      <View className="bg-white px-5 py-5 mb-4">
        <Text className="text-lg font-black text-gray-900 mb-4">
          Recent Posts
        </Text>
        <View className="items-center py-4">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="text-gray-500 mt-2">Loading posts...</Text>
        </View>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="bg-white px-5 py-5 mb-4">
        <Text className="text-lg font-black text-gray-900 mb-4">
          Recent Posts
        </Text>
        <View className="items-center py-8">
          <Feather name="edit-3" size={40} color={colors.muted} />
          <Text className="text-gray-500 mt-2 text-center">
            No posts yet{"\n"}
            <Text className="text-gray-400 text-sm">
              This user hasn't shared any experiences yet
            </Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white px-5 py-5 mb-4">
      <Text className="text-lg font-black text-gray-900 mb-4">
        Recent Posts
      </Text>

      <View className="gap-3">
        {posts.map((post) => (
          <View
            key={post._id}
            className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
          >
            <View className="flex-row items-start mb-3">
              <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-3">
                <Text className="text-lg">📝</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-sm mb-1">
                  {post.location?.name || "Cebu Location"}
                </Text>
                <Text className="text-gray-600 text-xs">
                  {formatTimeAgo(post.createdAt)}
                </Text>
              </View>
            </View>

            <Text className="text-gray-800 text-sm leading-5 mb-3">
              {post.content}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center">
                  <Feather name="heart" size={14} color={colors.muted} />
                  <Text className="text-gray-500 text-sm ml-1">
                    {post.engagement?.likes || 0}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Feather
                    name="message-circle"
                    size={14}
                    color={colors.muted}
                  />
                  <Text className="text-gray-500 text-sm ml-1">
                    {post.engagement?.comments || 0}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="share-2" size={14} color={colors.muted} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Profile Header Component
const ProfileHeader = ({ user, isFollowing, onFollow, onMessage }) => (
  <View className="bg-white px-5 py-6 mb-4">
    <View className="flex-row items-center mb-6">
      <View className="relative">
        <View className="w-20 h-20 bg-red-100 rounded-2xl items-center justify-center">
          <Text className="text-2xl">{user.profile?.avatar || "👤"}</Text>
        </View>
        {user.isVerified && (
          <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full items-center justify-center border-2 border-white">
            <Feather name="check" size={12} color="white" />
          </View>
        )}
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-xl font-black text-gray-900">
          {user.profile?.displayName || user.username}
        </Text>
        <Text className="text-red-600 text-sm font-semibold mt-1">
          🗺️ {user.profile?.location || "Cebu Explorer"} • 📱 @{user.username}
        </Text>

        {user.profile?.bio ? (
          <Text className="text-gray-600 text-sm mt-2">{user.profile.bio}</Text>
        ) : (
          <Text className="text-gray-400 text-sm mt-2">No bio yet</Text>
        )}

        <View className="flex-row items-center mt-2">
          <View className="bg-red-50 px-3 py-1 rounded-full">
            <Text className="text-red-700 text-sm font-semibold">
              {user.isVerified ? "Verified Explorer" : "Community Contributor"}
            </Text>
          </View>
        </View>
      </View>
    </View>

    <UserStats user={user} isFollowing={isFollowing} onFollow={onFollow} />
  </View>
);

// Action Buttons Component
const ActionButtons = ({ isFollowing, onFollow, onMessage }) => (
  <View className="bg-white px-5 py-4 mb-4">
    <View className="flex-row gap-3">
      <TouchableOpacity
        onPress={onFollow}
        className={`flex-1 py-3 rounded-xl ${
          isFollowing ? "bg-gray-100" : "bg-red-600"
        }`}
      >
        <Text
          className={`text-center font-semibold text-base ${
            isFollowing ? "text-gray-700" : "text-white"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onMessage}
        className="flex-1 py-3 bg-gray-100 rounded-xl"
      >
        <Text className="text-center font-semibold text-gray-700 text-base">
          Message
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
        <Feather name="more-horizontal" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  </View>
);

// Main UserProfile Component
export default function UserProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser } = useAuth();

  // Get user ID from params (for real usage)
  const { userId } = route.params || { userId: "community_user_123" };

  // State for the viewed user
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Static user data (would come from API in real app)
  const staticUserData = {
    _id: userId,
    username: "cebu_explorer",
    email: "explorer@example.com",
    isVerified: true,
    profile: {
      displayName: "Maria Santos",
      avatar: "👩",
      bio: "Passionate traveler exploring the beautiful islands of Cebu. Love sharing hidden gems and local experiences! 🌴",
      location: "Cebu City, Philippines",
      coverPhoto: "",
    },
    socialStats: {
      postsCount: 12,
      followers: 245,
      following: 156,
    },
    preferences: {
      notifications: true,
      privacy: "public",
    },
    createdAt: "2024-01-15T00:00:00.000Z",
    lastActive: new Date().toISOString(),
  };

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // In real app: const result = await UserService.getUserById(userId);
        // For now, use static data with a delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUser(staticUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(staticUserData); // Fallback to static data
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? "Unfollowed" : "Following",
      isFollowing
        ? `You've unfollowed ${user.profile?.displayName || user.username}`
        : `You're now following ${user.profile?.displayName || user.username}`
    );
  };

  const handleMessage = () => {
    Alert.alert(
      "Message",
      `Start a conversation with ${user.profile?.displayName || user.username}`
    );
    // navigation.navigate("Chat", { userId: user._id, userName: user.profile?.displayName })
  };

  if (loading || !user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-500 mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-black text-gray-900">
              {user.profile?.displayName || user.username}
            </Text>
            <Text className="text-red-600 text-sm font-semibold">
              Community Profile
            </Text>
          </View>
          <TouchableOpacity>
            <Feather name="more-horizontal" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <ProfileHeader
          user={user}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onMessage={handleMessage}
        />

        <ActionButtons
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onMessage={handleMessage}
        />

        <UserPosts userId={user._id} />

        {/* Member Since */}
        <View className="bg-white px-5 py-4 mb-4">
          <Text className="text-lg font-black text-gray-900 mb-2">About</Text>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-gray-600 text-sm">Member since</Text>
            <Text className="text-gray-900 text-sm">
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-gray-600 text-sm">Last active</Text>
            <Text className="text-gray-900 text-sm">
              {new Date(user.lastActive).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-gray-500 text-sm">Sugoyage Community</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Connecting Cebu explorers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
