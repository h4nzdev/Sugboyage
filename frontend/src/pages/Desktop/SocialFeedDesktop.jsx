import React, { useContext, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Camera,
  Plus,
  Search,
  Home,
  Compass,
  Users,
  MessageSquare,
  Bell,
  Send,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommentModal from "../../components/SocialFeed/CommentModal";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { PostService } from "../../services/PostService";
import { useEffect } from "react";

const SocialFeedDesktop = ({ posts = [], users }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [commentInputs, setCommentInputs] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [commentModal, setCommentModal] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);

  const colors = {
    primary: "#DC143C",
    primaryLight: "#FEE2E2",
  };

  useEffect(() => {
    const initialLikedState = {};
    posts.forEach((post) => {
      const userLikedThisPost = post.engagement?.likedBy?.some(
        (likedUser) => likedUser._id === user?.id
      );

      if (userLikedThisPost) {
        initialLikedState[post._id] = true;
      }
    });

    console.log("🔄 Initializing likedPosts:", initialLikedState);
    setLikedPosts(initialLikedState);
  }, [posts, user?.id]);

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: Home, active: true },
    { id: "search", label: "Search", icon: Search },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "create", label: "Create", icon: Plus },
    { id: "profile", label: "Profile", icon: Users },
  ];

  // Format time ago function
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

  // Handle like function
  // In your handleLike function
  const handleLike = async (postId) => {
    try {
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      const response = await PostService.likePost(postId, { userId: user.id });

      if (!response.success) {
        // Revert if failed
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    }
  };

  const handleSave = (postId) => {
    setSavedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const openCommentModal = (postId) => {
    setCommentModal(postId);
  };

  const closeCommentModal = () => {
    setCommentModal(null);
  };

  // Filter posts based on active filter
  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "popular") return post.engagement?.likes > 10;
    if (activeFilter === "recent") {
      const postDate = new Date(post.createdAt);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return postDate > yesterday;
    }
    if (activeFilter === "food") return post.category === "food";
    if (activeFilter === "adventure") return post.category === "adventure";
    return true;
  });

  // Get user avatar or initial
  const getUserAvatar = (post) => {
    if (post.author?.profile?.avatar) return post.author.profile.avatar;
    const name =
      post.author?.profile?.displayName || post.author?.username || "A";
    return name.charAt(0).toUpperCase();
  };

  // Get display name
  const getDisplayName = (post) => {
    return (
      post.author?.profile?.displayName || post.author?.username || "Anonymous"
    );
  };

  // Check if post has media
  const hasMedia = (post) => {
    return post.media?.images && post.media.images.length > 0;
  };

  const PostCard = ({ post }) => {
    const isLiked = likedPosts[post._id];
    const isSaved = savedPosts[post._id];
    const commentText = commentInputs[post._id] || "";

    return (
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              {getUserAvatar(post)}
            </div>
            <div>
              <div
                onClick={() => navigate(`/main/profile/${post.author._id}`)}
                className="flex items-center gap-1 cursor-pointer hover:underline"
              >
                <span className="font-semibold text-sm">
                  {getDisplayName(post)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={10} />
                <span>{post.author?.profile?.location || "Cebu"}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>

        {/* Location Tag */}
        {post.location?.name && (
          <div className="px-4 pb-3">
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
              style={{
                backgroundColor: colors.primaryLight,
                color: colors.primary,
              }}
            >
              📍 {post.location.name}
            </div>
          </div>
        )}

        {/* Category Tag */}
        {post.category && post.category !== "other" && (
          <div className="px-4 pb-2">
            <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-xs font-semibold capitalize inline-block">
              #{post.category}
            </div>
          </div>
        )}

        {/* Post Content */}
        <div className="px-4 pb-4">
          <p className="text-gray-800 text-sm leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Media - Only show if images exist (Facebook style) */}
        {hasMedia(post) && (
          <div className="border-y border-gray-200">
            {post.media.images.length === 1 ? (
              // Single image - full width with proper aspect ratio
              <div className="w-full">
                <img
                  src={post.media.images[0].url}
                  alt={post.media.images[0].caption || "Post image"}
                  className="w-full max-h-96 object-contain bg-gray-50"
                />
              </div>
            ) : post.media.images.length === 2 ? (
              // Two images - side by side
              <div className="flex h-80">
                <img
                  src={post.media.images[0].url}
                  alt={post.media.images[0].caption || "Post image 1"}
                  className="w-1/2 h-full object-cover border-r border-gray-200"
                />
                <img
                  src={post.media.images[1].url}
                  alt={post.media.images[1].caption || "Post image 2"}
                  className="w-1/2 h-full object-cover"
                />
              </div>
            ) : post.media.images.length >= 3 ? (
              // Three or more images - grid layout
              <div className="grid grid-cols-2 gap-1 h-80">
                <img
                  src={post.media.images[0].url}
                  alt={post.media.images[0].caption || "Post image 1"}
                  className="col-span-2 h-40 object-cover"
                />
                <img
                  src={post.media.images[1].url}
                  alt={post.media.images[1].caption || "Post image 2"}
                  className="h-40 object-cover"
                />
                <div className="relative h-40">
                  <img
                    src={post.media.images[2].url}
                    alt={post.media.images[2].caption || "Post image 3"}
                    className="w-full h-full object-cover"
                  />
                  {post.media.images.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{post.media.images.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{post.engagement?.views || 0} views</span>
            <span>
              {(post.engagement?.comments || 0) +
                (post.engagement?.shares || 0)}{" "}
              interactions
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => handleLike(post._id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:bg-gray-50"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-600 text-red-600" : "text-gray-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isLiked ? "text-red-600" : "text-gray-600"
                }`}
              >
                {post.engagement?.likes || 0}
              </span>
            </button>

            <button
              onClick={() => openCommentModal(post._id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {post.engagement?.comments || 0}
              </span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                {post.engagement?.shares || 0}
              </span>
            </button>

            <button
              onClick={() => handleSave(post._id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:bg-gray-50"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isSaved ? "fill-gray-900 text-gray-900" : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Comment Input */}
        <div className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              disabled={!commentText}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                commentText
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 ml-44 max-w-4xl mx-auto py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, locations, travelers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6 flex items-center gap-2">
          {[
            { id: "all", label: "All Posts" },
            { id: "popular", label: "Popular" },
            { id: "recent", label: "Recent" },
            { id: "food", label: "Food" },
            { id: "adventure", label: "Adventure" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Create Post Prompt */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-4 mb-6 cursor-pointer hover:border-red-200 transition-colors"
          onClick={() => navigate("/main/create-post")}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: colors.primary }}
            >
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">
                Share your Cebu adventure...
              </p>
            </div>
            <Camera className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                No posts found
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {searchQuery
                  ? "Try a different search"
                  : "Be the first to share your story!"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 min-h-screen p-6 fixed right-0 top-0 h-full">
        {/* Current User */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: colors.primary }}
          >
            {user?.profile?.avatar || "U"}
          </div>
          <div className="flex-1">
            <div className="font-semibold">
              {user?.profile?.displayName || "Your Name"}
            </div>
            <div className="text-gray-500 text-sm">
              @{user?.username || "username"}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-500">
              Suggestions For You
            </span>
            <button className="text-xs font-semibold text-gray-900 hover:text-gray-700">
              See All
            </button>
          </div>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {user.profile?.displayName?.charAt(0) ||
                      user.username?.charAt(0) ||
                      "U"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {user.profile?.displayName || `User ${user.username}`}
                    </div>
                    <div className="text-gray-500 text-xs">
                      @{user.username}
                    </div>
                  </div>
                </div>
                <button
                  className="text-red-600 font-semibold text-xs hover:text-red-700"
                  style={{ color: colors.primary }}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex flex-wrap gap-2">
            {["About", "Help", "Privacy", "Terms"].map((item) => (
              <button key={item} className="hover:text-gray-600">
                {item}
              </button>
            ))}
          </div>
          <div>© 2025 Sugoyage</div>
        </div>
      </div>

      {/* Comment Modal */}
      {commentModal && (
        <CommentModal
          post={posts.find((p) => p._id === commentModal)}
          onClose={closeCommentModal}
          likedPosts={likedPosts}
          getUserAvatar={getUserAvatar}
          getDisplayName={getDisplayName}
        />
      )}
    </div>
  );
};

export default SocialFeedDesktop;
