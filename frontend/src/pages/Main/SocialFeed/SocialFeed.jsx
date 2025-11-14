import React, { useState } from "react";
import SocialFeedMobile from "../../Mobile/SocialFeedMobile";
import SocialFeedDesktop from "../../Desktop/SocialFeedDesktop";
import { usePosts } from "../../../hooks/usePost";

export default function SocialFeed() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Use the posts hook - simple!
  const { posts, loading, error, likePost, fetchPosts } = usePosts();

  const handleRefresh = () => {
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await likePost(postId);
  };

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
        />
      </div>
    </>
  );
}
