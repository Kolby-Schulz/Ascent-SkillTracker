import api from './api';

export const postService = {
  // Create a post (share roadmap)
  createPost: (roadmapId, caption) => {
    return api.post('/posts', { roadmapId, caption });
  },

  // Get feed posts
  getFeed: (page = 1, limit = 20) => {
    return api.get(`/posts/feed?page=${page}&limit=${limit}`);
  },

  // Like/Unlike a post
  toggleLike: (postId) => {
    return api.put(`/posts/${postId}/like`);
  },

  // Get user's posts
  getUserPosts: (userId) => {
    return api.get(`/posts/user/${userId}`);
  },
};

export default postService;
