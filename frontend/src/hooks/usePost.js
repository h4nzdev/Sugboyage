// hooks/usePosts.js
import { useState, useEffect } from "react";
import { PostService } from "../services/postService";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await PostService.getAllPosts();

      if (result.success && result.posts) {
        setPosts(result.posts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setError("Failed to fetch posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Create post
  const createPost = async (postData) => {
    try {
      const result = await PostService.createPost(postData);
      if (result.success) {
        // Refresh posts after creating
        await fetchPosts();
      }
      return result;
    } catch (err) {
      return { success: false, message: "Failed to create post" };
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      const result = await PostService.deletePost(postId);
      if (result.success) {
        // Remove from local state
        setPosts((current) => current.filter((post) => post._id !== postId));
      }
      return result;
    } catch (err) {
      return { success: false, message: "Failed to delete post" };
    }
  };

  // Like post
  const likePost = async (postId) => {
    try {
      const result = await PostService.likePost(postId);
      if (result.success) {
        // Update local state
        setPosts((current) =>
          current.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  engagement: {
                    ...post.engagement,
                    likes: post.engagement.likes + 1,
                  },
                }
              : post
          )
        );
      }
      return result;
    } catch (err) {
      return { success: false, message: "Failed to like post" };
    }
  };

  return {
    // State
    posts,
    loading,
    error,

    // Actions
    fetchPosts,
    createPost,
    deletePost,
    likePost,
  };
};
