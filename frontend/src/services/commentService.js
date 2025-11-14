import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export class CommentService {
  // Add comment to a post
  static async addComment(postId, commentData) {
    try {
      console.log(`🔄 Adding comment to post ${postId}...`);
      const response = await axios.post(
        `${API_BASE_URL}/comments/posts/${postId}/comments`,
        commentData
      );
      console.log("✅ Comment added successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error adding comment:", error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add comment",
        error: error.message,
      };
    }
  }

  // Get comments for a post
  static async getPostComments(postId, options = {}) {
    try {
      console.log(`🔄 Fetching comments for post ${postId}...`);
      const {
        page = 1,
        limit = 20,
        sort = "newest",
        includeReplies = false,
      } = options;

      const response = await axios.get(
        `${API_BASE_URL}/comments/posts/${postId}/comments`,
        {
          params: { page, limit, sort, includeReplies },
        }
      );
      console.log("✅ Comments fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching comments for post ${postId}:`,
        error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch comments",
        comments: [],
        pagination: { current: 1, pages: 0, total: 0, hasMore: false },
      };
    }
  }

  // Get comment by ID
  static async getCommentById(commentId) {
    try {
      console.log(`🔄 Fetching comment ${commentId}...`);
      const response = await axios.get(
        `${API_BASE_URL}/comments/comments/${commentId}`
      );
      console.log("✅ Comment fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching comment ${commentId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Comment not found",
        error: error.message,
      };
    }
  }

  // Get replies for a comment
  static async getCommentReplies(commentId, options = {}) {
    try {
      console.log(`🔄 Fetching replies for comment ${commentId}...`);
      const { page = 1, limit = 20 } = options;

      const response = await axios.get(
        `${API_BASE_URL}/comments/comments/${commentId}/replies`,
        {
          params: { page, limit },
        }
      );
      console.log("✅ Comment replies fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching replies for comment ${commentId}:`,
        error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch replies",
        replies: [],
        pagination: { current: 1, pages: 0, total: 0, hasMore: false },
      };
    }
  }

  // Update a comment
  static async updateComment(commentId, updateData) {
    try {
      console.log(`🔄 Updating comment ${commentId}...`);
      const response = await axios.put(
        `${API_BASE_URL}/comments/comments/${commentId}`,
        updateData
      );
      console.log("✅ Comment updated successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating comment ${commentId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update comment",
        error: error.message,
      };
    }
  }

  // Delete a comment
  static async deleteComment(commentId) {
    try {
      console.log(`🔄 Deleting comment ${commentId}...`);
      const response = await axios.delete(
        `${API_BASE_URL}/comments/comments/${commentId}`
      );
      console.log("✅ Comment deleted successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting comment ${commentId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete comment",
        error: error.message,
      };
    }
  }

  // Like a comment
  static async likeComment(commentId) {
    try {
      console.log(`🔄 Liking comment ${commentId}...`);
      const response = await axios.post(
        `${API_BASE_URL}/comments/comments/${commentId}/like`
      );
      console.log("✅ Comment liked successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error liking comment ${commentId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to like comment",
        error: error.message,
      };
    }
  }

  // Unlike a comment
  static async unlikeComment(commentId) {
    try {
      console.log(`🔄 Unliking comment ${commentId}...`);
      const response = await axios.post(
        `${API_BASE_URL}/comments/comments/${commentId}/unlike`
      );
      console.log("✅ Comment unliked successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error unliking comment ${commentId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to unlike comment",
        error: error.message,
      };
    }
  }

  // Get comment statistics for a post
  static async getCommentStats(postId) {
    try {
      console.log(`🔄 Fetching comment stats for post ${postId}...`);
      const response = await axios.get(
        `${API_BASE_URL}/comments/posts/${postId}/stats`
      );
      console.log("✅ Comment stats fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching comment stats for post ${postId}:`,
        error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch comment stats",
        error: error.message,
      };
    }
  }

  // Add reply to a comment
  static async addReply(commentId, replyData) {
    try {
      console.log(`🔄 Adding reply to comment ${commentId}...`);
      const response = await axios.post(
        `${API_BASE_URL}/comments/comments/${commentId}/replies`,
        replyData
      );
      console.log("✅ Reply added successfully!");
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error adding reply to comment ${commentId}:`,
        error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add reply",
        error: error.message,
      };
    }
  }

  // Get all comments with replies (convenience method)
  static async getCommentsWithReplies(postId, options = {}) {
    try {
      console.log(`🔄 Fetching comments with replies for post ${postId}...`);
      const response = await this.getPostComments(postId, {
        ...options,
        includeReplies: true,
      });
      return response;
    } catch (error) {
      console.error(
        `❌ Error fetching comments with replies for post ${postId}:`,
        error.message
      );
      return {
        success: false,
        message: "Failed to fetch comments with replies",
        comments: [],
        pagination: { current: 1, pages: 0, total: 0, hasMore: false },
      };
    }
  }

  // Get popular comments for a post (most liked)
  static async getPopularComments(postId, limit = 10) {
    try {
      console.log(`🔄 Fetching popular comments for post ${postId}...`);
      const response = await this.getPostComments(postId, {
        sort: "popular",
        limit,
      });
      return response;
    } catch (error) {
      console.error(
        `❌ Error fetching popular comments for post ${postId}:`,
        error.message
      );
      return {
        success: false,
        message: "Failed to fetch popular comments",
        comments: [],
        pagination: { current: 1, pages: 0, total: 0, hasMore: false },
      };
    }
  }
}
