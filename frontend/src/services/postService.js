import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export class PostService {
  // Create a new post
  static async createPost(postData) {
    try {
      console.log("🔄 Creating new post...");
      const response = await axios.post(`${API_BASE_URL}/posts`, postData);
      console.log("✅ Post created successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error creating post:", error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create post",
        error: error.message,
      };
    }
  }

  // Get all posts
  static async getAllPosts() {
    try {
      console.log("🔄 Fetching posts from database...");
      const response = await axios.get(`${API_BASE_URL}/posts`);
      console.log("✅ Posts fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching posts:", error.message);
      // Return empty array if API fails
      return { success: false, posts: [] };
    }
  }

  // Get single post by ID
  static async getPostById(id) {
    try {
      console.log(`🔄 Fetching post with ID: ${id}...`);
      const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
      console.log("✅ Post fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching post with ID ${id}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Post not found",
        error: error.message,
      };
    }
  }

  // Update a post
  static async updatePost(postId, updateData) {
    try {
      console.log(`🔄 Updating post ${postId}...`);
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        updateData
      );
      console.log("✅ Post updated successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating post ${postId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update post",
        error: error.message,
      };
    }
  }

  // Delete a post
  static async deletePost(postId) {
    try {
      console.log(`🔄 Deleting post ${postId}...`);
      const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
      console.log("✅ Post deleted successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting post ${postId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete post",
        error: error.message,
      };
    }
  }

  // Like a post
  static async likePost(postId) {
    try {
      console.log(`🔄 Liking post ${postId}...`);
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/like`);
      console.log("✅ Post liked successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error liking post ${postId}:`, error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to like post",
        error: error.message,
      };
    }
  }

  // Get posts by user
  static async getUserPosts(userId) {
    try {
      console.log(`🔄 Fetching posts for user: ${userId}...`);
      const response = await axios.get(`${API_BASE_URL}/posts/user/${userId}`);
      console.log("✅ User posts fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching posts for user ${userId}:`,
        error.message
      );
      return { success: false, posts: [] };
    }
  }

  // Search posts
  static async searchPosts(query = "", category = "", limit = 20) {
    try {
      console.log(`🔄 Searching posts: ${query}...`);
      const response = await axios.get(`${API_BASE_URL}/posts/search`, {
        params: { q: query, category, limit },
      });
      console.log("✅ Posts search completed!");
      return response.data;
    } catch (error) {
      console.error("❌ Error searching posts:", error.message);
      return { success: false, posts: [] };
    }
  }

  // Get posts by category
  static async getPostsByCategory(category) {
    try {
      console.log(`🔄 Fetching ${category} posts...`);
      const response = await axios.get(`${API_BASE_URL}/posts/search`, {
        params: { category },
      });
      console.log("✅ Category posts fetched successfully!");
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching ${category} posts:`, error.message);
      return { success: false, posts: [] };
    }
  }

  // Get popular posts (most liked)
  static async getPopularPosts(limit = 10) {
    try {
      console.log("🔄 Fetching popular posts...");
      const allPosts = await this.getAllPosts();

      if (allPosts.success && allPosts.posts) {
        const popular = allPosts.posts
          .sort((a, b) => b.engagement.likes - a.engagement.likes)
          .slice(0, limit);

        return { success: true, posts: popular };
      }

      return { success: false, posts: [] };
    } catch (error) {
      console.error("❌ Error fetching popular posts:", error.message);
      return { success: false, posts: [] };
    }
  }
}
