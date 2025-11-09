import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import AddComment from '../components/AddComment';
import LikeButton from '../components/LikeButton';
import ShareButton from '../components/ShareButton';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError('Post not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${id}`);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert('Failed to delete post');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error || 'Post not found'}</div>
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const authorId = typeof post.author === 'object' ? String(post.author._id) : String(post.author);
  const userId = user ? String(user._id || user.id) : null;
  const canEdit = user && (authorId === userId || user.role === 'admin');
  const canDelete = user && (authorId === userId || user.role === 'admin');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/" className="text-blue-600 hover:underline mb-4 block">
        ← Back to Home
      </Link>

      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
          {canEdit && (
            <div className="flex space-x-2">
              <Link
                to={`/edit/${post._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </Link>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        <div className="text-gray-600 mb-6">
          <p className="mb-2">
            By <span className="font-semibold">{post.author?.username || 'Unknown'}</span>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          
          {/* Like and Share Buttons */}
          <div className="flex items-center space-x-4 mt-4">
            <LikeButton postId={post._id} initialLikesCount={post.likesCount || 0} />
            <ShareButton postId={post._id} postTitle={post.title} />
          </div>
        </div>

        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments</h2>
        
        {user ? (
          <AddComment postId={id} onCommentAdded={fetchComments} />
        ) : (
          <p className="text-gray-600 mb-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link> to add a comment
          </p>
        )}

        <div className="mt-8 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {comment.userId?.username || 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

