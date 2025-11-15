import React, { useEffect, useState } from "react";
import SocialFeedMobile from "../../Mobile/SocialFeedMobile";
import SocialFeedDesktop from "../../Desktop/SocialFeedDesktop";
import { usePosts } from "../../../hooks/usePost";
import AuthenticationService from "../../../services/authenticationService";

export default function SocialFeed() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [users, setUsers] = useState([]);

  // Use the posts hook - simple!
  const { posts, loading, error, likePost, fetchPosts } = usePosts();

  const handleRefresh = () => {
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await likePost(postId);
  };

  const fetchUsers = async () => {
    try {
      const response = await AuthenticationService.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Simple filtering
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

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <SocialFeedMobile
          posts={filteredPosts}
          loading={loading}
          refreshing={loading} // Use loading for refreshing too
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onRefresh={handleRefresh}
          onLike={handleLike}
          onAddPost={() => console.log("Navigate to add post")}
          users={users}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <SocialFeedDesktop
          posts={filteredPosts}
          loading={loading}
          refreshing={loading} // Use loading for refreshing too
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onRefresh={handleRefresh}
          onLike={handleLike}
          onAddPost={() => console.log("Navigate to add post")}
          users={users}
        />
      </div>
    </>
  );
}
