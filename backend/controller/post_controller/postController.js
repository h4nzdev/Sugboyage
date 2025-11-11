import Post from "../../model/Post_Model/postModel.js";

export const PostController = {
  // Create a new post
  async createPost(req, res) {
    try {
      const { author, content, location, category, tags, visibility, media } =
        req.body;

      // Simple validation
      if (!author || !content || !location?.name) {
        return res.status(400).json({
          success: false,
          message: "Author, content, and location name are required",
        });
      }

      const post = new Post({
        author,
        content,
        location: {
          name: location.name,
          coordinates: location.coordinates
            ? {
                type: "Point",
                coordinates: [
                  location.coordinates.longitude,
                  location.coordinates.latitude,
                ],
              }
            : undefined,
          address: location.address,
        },
        category: category || "other",
        tags: tags || [],
        visibility: visibility || "public",
        media: media || { images: [], videos: [] },
      });

      const savedPost = await post.save();

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: savedPost,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating post",
        error: error.message,
      });
    }
  },

  // Get all posts
  async getPosts(req, res) {
    try {
      const posts = await Post.find({ isActive: true })
        .populate("author", "username profile.displayName profile.avatar")
        .sort({ createdAt: -1 })
        .limit(20); // Simple limit instead of pagination

      res.json({
        success: true,
        posts,
        count: posts.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching posts",
        error: error.message,
      });
    }
  },

  // Get single post by ID
  async getPostById(req, res) {
    try {
      const post = await Post.findById(req.params.id).populate(
        "author",
        "username profile.displayName profile.avatar"
      );

      if (!post || !post.isActive) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Increment views
      post.engagement.views += 1;
      await post.save();

      res.json({
        success: true,
        post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching post",
        error: error.message,
      });
    }
  },

  // Update a post
  async updatePost(req, res) {
    try {
      const { content, location, category, tags, visibility, media } = req.body;

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Update only provided fields
      if (content) post.content = content;
      if (location) post.location = location;
      if (category) post.category = category;
      if (tags) post.tags = tags;
      if (visibility) post.visibility = visibility;
      if (media) post.media = media;

      post.isEdited = true;
      post.editedAt = new Date();

      const updatedPost = await post.save();

      res.json({
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating post",
        error: error.message,
      });
    }
  },

  // Delete a post
  async deletePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Soft delete
      post.isActive = false;
      await post.save();

      res.json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting post",
        error: error.message,
      });
    }
  },

  // Like a post
  async likePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      post.engagement.likes += 1;
      await post.save();

      res.json({
        success: true,
        message: "Post liked",
        likes: post.engagement.likes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error liking post",
        error: error.message,
      });
    }
  },

  // Get posts by user
  async getUserPosts(req, res) {
    try {
      const posts = await Post.find({
        author: req.params.userId,
        isActive: true,
      })
        .populate("author", "username profile.displayName profile.avatar")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        posts,
        count: posts.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching user posts",
        error: error.message,
      });
    }
  },
};
