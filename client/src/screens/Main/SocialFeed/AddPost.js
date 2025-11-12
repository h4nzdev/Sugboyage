import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, use } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { PostService } from "../../../services/post_services/postService";
import { useAuth } from "../../../context/AuthenticationContext";

export default function AddPost() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    content: "",
    location: {
      name: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
    category: "other",
    tags: [],
    visibility: "public",
  });

  const [currentTag, setCurrentTag] = useState("");

  // Categories
  const categories = [
    { id: "food", label: "Food", icon: "coffee" },
    { id: "adventure", label: "Adventure", icon: "map" },
    { id: "culture", label: "Culture", icon: "home" },
    { id: "beach", label: "Beach", icon: "sun" },
    { id: "historical", label: "Historical", icon: "book" },
    { id: "shopping", label: "Shopping", icon: "shopping-bag" },
    { id: "other", label: "Other", icon: "star" },
  ];

  // Popular Cebu locations for quick selection
  const popularLocations = [
    "Kawasan Falls, Badian",
    "Temple of Leah, Cebu City",
    "Magellan's Cross, Cebu City",
    "Fort San Pedro, Cebu City",
    "Sirao Flower Garden, Cebu City",
    "Tops Lookout, Cebu City",
    "Bantayan Island",
    "Malapascua Island",
    "Moalboal",
    "Oslob Whale Shark Watching",
    "CNT Lechon, Mandaue",
    "Larsian BBQ, Cebu City",
    "Sutukil, Mactan",
  ];

  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field === "locationName") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          name: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Add tag
  const addTag = () => {
    if (
      currentTag.trim() &&
      !formData.tags.includes(currentTag.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()],
      }));
      setCurrentTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Select popular location
  const selectLocation = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        name: location,
      },
    }));
  };

  // Submit post
  const handleSubmit = async () => {
    // Validation
    if (!formData.content.trim()) {
      Alert.alert("Error", "Please write something about your experience!");
      return;
    }

    if (!formData.location.name.trim()) {
      Alert.alert("Error", "Please add a location!");
      return;
    }

    if (formData.content.length > 2000) {
      Alert.alert(
        "Error",
        "Post content is too long! Maximum 2000 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const postData = {
        author: user.id,
        content: formData.content.trim(),
        location: {
          name: formData.location.name.trim(),
          coordinates: formData.location.coordinates,
          address: formData.location.name.trim(),
        },
        category: formData.category,
        tags: formData.tags,
        visibility: formData.visibility,
        media: {
          images: [],
          videos: [],
        },
      };

      console.log("🔄 Creating post:", postData);

      const result = await PostService.createPost(postData);

      if (result.success) {
        Alert.alert("Success", "Your post has been shared!", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to create post");
      }
    } catch (error) {
      console.error("❌ Error creating post:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Character counter
  const characterCount = formData.content.length;
  const maxCharacters = 2000;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text className="text-gray-500 text-base">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-gray-900">Create Post</Text>

        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text className="text-red-600 text-base font-semibold">Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 py-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* User Info */}
        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-3">
            <Text className="text-xl">{user?.profile?.avatar || "👤"}</Text>
          </View>
          <View>
            <Text className="font-bold text-gray-900 text-base">
              {user?.profile?.displayName || user?.username}
            </Text>
            <Text className="text-gray-500 text-sm">
              Sharing a Cebu experience
            </Text>
          </View>
        </View>

        {/* Content Input */}
        <View className="mb-6">
          <TextInput
            value={formData.content}
            onChangeText={(value) => handleInputChange("content", value)}
            placeholder="What's amazing about this place? Share your experience..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            className="text-gray-900 text-base min-h-32"
            autoFocus
            maxLength={maxCharacters}
          />

          {/* Character Counter */}
          <View className="flex-row justify-end mt-2">
            <Text
              className={`text-xs ${
                characterCount > maxCharacters * 0.9
                  ? "text-red-600"
                  : "text-gray-400"
              }`}
            >
              {characterCount}/{maxCharacters}
            </Text>
          </View>
        </View>

        {/* Category Selection */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleInputChange("category", category.id)}
                  className={`px-4 py-3 rounded-xl border-2 ${
                    formData.category === category.id
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    <Feather
                      name={category.icon}
                      size={16}
                      color={
                        formData.category === category.id
                          ? colors.primary
                          : colors.muted
                      }
                    />
                    <Text
                      className={`ml-2 text-sm font-medium ${
                        formData.category === category.id
                          ? "text-red-700"
                          : "text-gray-600"
                      }`}
                    >
                      {category.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Location Input */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3">📍 Location</Text>

          <TextInput
            value={formData.location.name}
            onChangeText={(value) => handleInputChange("locationName", value)}
            placeholder="Where did you go? (e.g., Kawasan Falls, Badian)"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base"
          />

          {/* Quick Location Suggestions */}
          <Text className="text-gray-500 text-sm mt-3 mb-2">
            Popular in Cebu:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-wrap gap-2">
              {popularLocations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectLocation(location)}
                  className="bg-gray-100 px-3 py-2 rounded-full"
                >
                  <Text className="text-gray-700 text-sm">{location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Tags Input */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3">🏷️ Tags</Text>

          <View className="flex-row items-center mb-3">
            <TextInput
              value={currentTag}
              onChangeText={setCurrentTag}
              placeholder="Add tags (e.g., beach, sunset, food)"
              placeholderTextColor="#9CA3AF"
              className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base mr-2"
              onSubmitEditing={addTag}
            />
            <TouchableOpacity
              onPress={addTag}
              className="bg-red-600 w-12 h-12 rounded-xl items-center justify-center"
            >
              <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Tags List */}
          {formData.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-red-100 px-3 py-2 rounded-full flex-row items-center"
                >
                  <Text className="text-red-700 text-sm mr-2">#{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Feather name="x" size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Privacy Settings */}
        <View className="mb-6">
          <Text className="font-semibold text-gray-900 mb-3">Visibility</Text>

          <View className="bg-gray-50 rounded-2xl p-4">
            <TouchableOpacity
              onPress={() => handleInputChange("visibility", "public")}
              className="flex-row items-center justify-between py-2"
            >
              <View className="flex-row items-center">
                <Feather
                  name="globe"
                  size={18}
                  color={colors.muted}
                  className="mr-3"
                />
                <View>
                  <Text className="font-medium text-gray-900">Public</Text>
                  <Text className="text-gray-500 text-sm">
                    Anyone can see your post
                  </Text>
                </View>
              </View>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  formData.visibility === "public"
                    ? "bg-red-600 border-red-600"
                    : "border-gray-300"
                }`}
              >
                {formData.visibility === "public" && (
                  <Feather name="check" size={14} color="white" />
                )}
              </View>
            </TouchableOpacity>

            <View className="h-px bg-gray-200 my-2" />

            <TouchableOpacity
              onPress={() => handleInputChange("visibility", "private")}
              className="flex-row items-center justify-between py-2"
            >
              <View className="flex-row items-center">
                <Feather
                  name="lock"
                  size={18}
                  color={colors.muted}
                  className="mr-3"
                />
                <View>
                  <Text className="font-medium text-gray-900">Private</Text>
                  <Text className="text-gray-500 text-sm">
                    Only you can see this post
                  </Text>
                </View>
              </View>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  formData.visibility === "private"
                    ? "bg-red-600 border-red-600"
                    : "border-gray-300"
                }`}
              >
                {formData.visibility === "private" && (
                  <Feather name="check" size={14} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Guidelines */}
        <View className="bg-blue-50 rounded-2xl p-4 mb-12">
          <Text className="font-semibold text-blue-900 mb-2">
            Posting Guidelines
          </Text>
          <Text className="text-blue-700 text-sm">
            • Be respectful and kind to others{"\n"}• Share authentic
            experiences{"\n"}• Include accurate location information{"\n"}• Use
            relevant categories and tags{"\n"}• No spam or promotional content
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
