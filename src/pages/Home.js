import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import LikeButton from '../components/LikeButton';
import ShareButton from '../components/ShareButton';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError('Failed to load posts');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      // Remove the post from the list
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      alert('Failed to delete post: ' + (err.response?.data?.message || 'Unknown error'));
      console.error(err);
    }
  };

  const canEditPost = (post) => {
    if (!user) return false;
    const authorId = typeof post.author === 'object' ? String(post.author._id) : String(post.author);
    const userId = String(user._id || user.id);
    return authorId === userId || user.role === 'admin';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-xl">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Latest Posts</h1>
        {user && (user.role === 'author' || user.role === 'admin') && (
          <Link
            to="/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Create New Post
          </Link>
        )}
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-md">
          <p className="text-xl mb-4">No posts yet. Be the first to create one!</p>
          {user && (user.role === 'author' || user.role === 'admin') ? (
            <Link
              to="/create"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Post
            </Link>
          ) : (
            <p className="text-sm">
              <Link to="/register" className="text-blue-600 hover:underline">Register as an author</Link> to start posting!
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const canEdit = canEditPost(post);
            return (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 relative"
              >
                {canEdit && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Link
                      to={`/edit/${post._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      title="Edit post"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => handleDelete(post._id, e)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      title="Delete post"
                    >
                      Delete
                    </button>
                  </div>
                )}
                
                <Link to={`/post/${post._id}`} className="block">
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800 pr-20">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>
                </Link>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    By {post.author?.username || 'Unknown'}
                  </span>
                  <Link
                    to={`/post/${post._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
                
                {/* Like and Share Buttons */}
                <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-gray-200">
                  <LikeButton postId={post._id} initialLikesCount={post.likesCount || 0} />
                  <ShareButton postId={post._id} postTitle={post.title} />
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;

