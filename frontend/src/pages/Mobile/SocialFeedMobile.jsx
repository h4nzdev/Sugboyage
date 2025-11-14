import React, { useState, useContext } from "react";
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
  Send,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommentModal from "../../components/SocialFeed/CommentModal";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { PostService } from "../../services/postService";

const SocialFeedMobile = ({
  posts,
  loading,
  activeFilter,
  setActiveFilter,
  onAddPost,
}) => {
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

  const filters = [
    { id: "all", label: "All Posts" },
    { id: "popular", label: "Popular" },
    { id: "recent", label: "Recent" },
    { id: "food", label: "Food" },
    { id: "adventure", label: "Adventure" },
  ];

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

  const handleLike = async (postId) => {
    try {
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
      const response = await PostService.likePost(postId);
    } catch (error) {
      console.error("Error liking post:", error);
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
      <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              {getUserAvatar(post)}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">
                {getDisplayName(post)}
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {post.author?.profile?.location || "Cebu"} •{" "}
                {formatTimeAgo(post.createdAt)}
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Location Tag */}
        {post.location?.name && (
          <div className="mb-3">
            <div
              className="px-3 py-1 rounded-full inline-block text-xs font-semibold"
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
          <div className="mb-2">
            <div className="bg-blue-50 px-3 py-1 rounded-full inline-block">
              <span className="text-blue-700 text-xs font-semibold capitalize">
                #{post.category}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <p className="text-gray-800 text-sm leading-5 mb-3">{post.content}</p>

        {/* Image/Media */}
        {hasMedia(post) ? (
          <div className="h-48 bg-gray-100 rounded-xl mb-3 flex flex-col items-center justify-center">
            <span className="text-4xl mb-2">🖼️</span>
            <span className="text-gray-500 text-sm">
              {post.media.images.length} photo
              {post.media.images.length > 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <div className="h-32 bg-gray-50 rounded-xl mb-3 flex flex-col items-center justify-center">
            <span className="text-lg mb-2 text-gray-500">
              No image to display
            </span>
            <Camera className="w-6 h-6 text-gray-400" />
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-xs text-gray-500">
            <span>{post.engagement?.views || 0} views</span>
            <span className="mx-2">•</span>
            <span>
              {(post.engagement?.comments || 0) +
                (post.engagement?.shares || 0)}{" "}
              interactions
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(post._id)}
              className="flex items-center"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "text-red-600 fill-red-600" : "text-gray-500"
                }`}
              />
              <span
                className={`ml-1 text-sm ${
                  isLiked ? "text-red-600 font-semibold" : "text-gray-500"
                }`}
              >
                {(post.engagement?.likes || 0) + (isLiked ? 1 : 0)}
              </span>
            </button>

            <button
              onClick={() => openCommentModal(post._id)}
              className="flex items-center text-gray-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="ml-1 text-sm">
                {post.engagement?.comments || 0}
              </span>
            </button>

            <button className="flex items-center text-gray-500">
              <Share2 className="w-4 h-4" />
              <span className="ml-1 text-sm">
                {post.engagement?.shares || 0}
              </span>
            </button>
          </div>

          <button
            onClick={() => handleSave(post._id)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Bookmark
              className={`w-5 h-5 ${
                isSaved ? "fill-gray-900 text-gray-900" : "text-gray-500"
              }`}
            />
          </button>
        </div>

        {/* Quick Comment Input */}
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-4 pb-4 px-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Sugoyage</h1>
            <p className="text-red-600 text-sm font-semibold">Community</p>
          </div>
          <button
            className="bg-red-600 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors"
            onClick={onAddPost}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border-b border-gray-200">
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
      <div className="border-b border-gray-200 bg-white overflow-x-auto">
        <div className="flex py-3 space-x-2 mx-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-sm font-medium">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Prompt */}
      <div
        className="bg-white rounded-xl border border-gray-200 p-4 mx-4 my-4 cursor-pointer hover:border-red-200 transition-colors"
        onClick={onAddPost}
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

      {/* Feed */}
      <div className="flex-1">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <span className="text-gray-500">Loading posts...</span>
          </div>
        )}

        {/* Posts */}
        <div className="mt-2 px-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : !loading ? (
            <div className="flex flex-col items-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg text-center mb-2">
                {searchQuery ? "No posts found" : "No posts yet"}
                {activeFilter !== "all" && !searchQuery
                  ? ` in ${activeFilter}`
                  : ""}
              </p>
              <p className="text-gray-400 text-sm text-center">
                {searchQuery
                  ? "Try a different search"
                  : "Be the first to share your Cebu experience!"}
              </p>
            </div>
          ) : null}
        </div>

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="flex justify-center py-6">
            <button className="text-red-600 font-semibold text-sm hover:text-red-700">
              Load more posts
            </button>
          </div>
        )}
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

export default SocialFeedMobile;
