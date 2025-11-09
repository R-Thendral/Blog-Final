import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

const LikeButton = ({ postId, initialLikesCount = 0 }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial likes count
    fetchLikesCount();
    
    // Check if user has liked this post
    if (user) {
      checkUserLike();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, user]);

  const fetchLikesCount = async () => {
    try {
      const response = await api.get(`/likes/post/${postId}`);
      setLikesCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch likes count', error);
    }
  };

  const checkUserLike = async () => {
    try {
      const response = await api.get(`/likes/post/${postId}/check`);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Failed to check like status', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    setLoading(true);
    try {
      if (liked) {
        // Unlike
        const response = await api.delete(`/likes/post/${postId}`);
        setLiked(false);
        setLikesCount(response.data.count || 0);
      } else {
        // Like
        const response = await api.post(`/likes/post/${postId}`);
        setLiked(true);
        setLikesCount(response.data.count || 0);
      }
    } catch (error) {
      console.error('Failed to toggle like', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update like';
      
      // If it's a 400 error saying already liked/not liked, just refresh the state
      if (error.response?.status === 200 || error.response?.status === 400) {
        // Refresh likes count and state
        await fetchLikesCount();
        if (user) {
          await checkUserLike();
        }
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        liked
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${!user ? 'opacity-50 cursor-not-allowed' : ''} disabled:opacity-50`}
      title={!user ? 'Login to like posts' : liked ? 'Unlike this post' : 'Like this post'}
    >
      <svg
        className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;

