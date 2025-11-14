import React, { useState, useEffect, useContext } from "react";
import { Send, X, Heart, MessageCircle } from "lucide-react";
import { CommentService } from "../../services/commentService";
import { AuthenticationContext } from "../../context/AuthenticationContext";

const colors = {
  primary: "#DC143C",
  primaryLight: "#FEE2E2",
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

const CommentModal = ({
  post,
  onClose,
  likedPosts,
  getUserAvatar,
  getDisplayName,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likingComment, setLikingComment] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { user } = useContext(AuthenticationContext); // Get current user from auth context
  const isLiked = likedPosts[post._id];

  // Fetch comments when modal opens
  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const fetchComments = async (loadMore = false) => {
    try {
      if (!loadMore) setLoading(true);

      const currentPage = loadMore ? page + 1 : 1;
      const result = await CommentService.getPostComments(post._id, {
        page: currentPage,
        limit: 10,
        sort: "newest",
        includeReplies: true,
      });

      if (result.success) {
        if (loadMore) {
          setComments((prev) => [...prev, ...result.comments]);
        } else {
          setComments(result.comments);
        }
        setHasMore(result.pagination.hasMore);
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !user) return;

    setSubmitting(true);
    try {
      const result = await CommentService.addComment(post._id, {
        author: user.id,
        content: commentText.trim(),
        parentComment: null,
      });

      if (result.success) {
        setCommentText("");
        // Refresh comments to show the new one
        await fetchComments(false);
      } else {
        console.error("Failed to add comment:", result.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) return;

    setLikingComment(commentId);
    try {
      const result = await CommentService.likeComment(commentId);

      if (result.success) {
        // Update local state optimistically
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  engagement: {
                    ...comment.engagement,
                    likes: result.likes,
                  },
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    } finally {
      setLikingComment(null);
    }
  };

  const handleAddReply = async (parentCommentId, replyContent) => {
    if (!replyContent.trim() || !user) return;

    try {
      const result = await CommentService.addComment(post._id, {
        author: user.id,
        content: replyContent.trim(),
        parentComment: parentCommentId,
      });

      if (result.success) {
        // Refresh to show the new reply
        await fetchComments(false);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Individual Comment Component
  const CommentItem = ({ comment, isReply = false }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);

    const handleReplySubmit = () => {
      if (replyText.trim()) {
        handleAddReply(comment._id, replyText);
        setReplyText("");
        setShowReplyInput(false);
      }
    };

    return (
      <div className={`flex gap-3 ${isReply ? "ml-12" : ""}`}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: colors.primary }}
        >
          {comment.author?.profile?.avatar ||
            comment.author?.username?.charAt(0).toUpperCase() ||
            "U"}
        </div>

        <div className="flex-1">
          {/* Comment Content */}
          <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2">
            <div className="font-semibold text-sm">
              {comment.author?.profile?.displayName ||
                comment.author?.username ||
                "Anonymous"}
            </div>
            <p className="text-gray-800 text-sm mt-1">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-1 px-2">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
              {comment.isEdited && " • Edited"}
            </span>

            <button
              onClick={() => handleLikeComment(comment._id)}
              disabled={likingComment === comment._id}
              className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50 flex items-center gap-1"
            >
              <Heart
                size={12}
                className={
                  comment.engagement?.likes > 0
                    ? "fill-red-600 text-red-600"
                    : ""
                }
              />
              {comment.engagement?.likes || 0}
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleReplySubmit()}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  replyText.trim()
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send size={14} />
              </button>
            </div>
          )}

          {/* Show Replies Toggle */}
          {!isReply && comment.engagement?.replies > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
            >
              {showReplies ? "Hide" : "View"} {comment.engagement.replies}{" "}
              {comment.engagement.replies === 1 ? "reply" : "replies"}
            </button>
          )}

          {/* Nested Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply._id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Comments ({post.engagement?.comments || 0})
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Post Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Original Post */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: colors.primary }}
              >
                {getUserAvatar(post)}
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {getDisplayName(post)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTimeAgo(post.createdAt)}
                </div>
              </div>
            </div>

            <p className="text-gray-800 text-sm mb-3">{post.content}</p>

            {/* Post engagement */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                {(post.engagement?.likes || 0) + (isLiked ? 1 : 0)} likes
              </span>
              <span>{post.engagement?.comments || 0} comments</span>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-2xl h-16"></div>
                  </div>
                </div>
              ))
            ) : comments.length > 0 ? (
              <>
                {comments.map((comment) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))}

                {/* Load More */}
                {hasMore && (
                  <button
                    onClick={() => fetchComments(true)}
                    className="w-full py-3 text-center text-sm text-red-600 hover:text-red-700 font-semibold border border-gray-200 rounded-lg hover:border-red-200 transition-colors"
                  >
                    Load more comments
                  </button>
                )}
              </>
            ) : (
              // Empty state
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No comments yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Comment Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                user ? "Write a comment..." : "Please login to comment"
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!user || submitting}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim() || !user || submitting}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                commentText.trim() && user && !submitting
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
