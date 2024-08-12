import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { BASE_URL } from '@/utils/funcitons';
import { toast } from 'sonner';

type Comment = {
  username: string;
  text: string;
  date: string;
  userImage?: string; // Optional user image
};

type CommentsProps = {
  slug: string;
};

const Comments: React.FC<CommentsProps> = ({ slug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user,isSignedIn, isLoaded } = useUser();
  const username = user?.fullName || 'Anonymous';
  const userImage = user?.imageUrl || ''; // User's profile image URL
// console.log(userImage)
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/${slug}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [slug]);

  const handleAddComment = async () => {

    if (!isSignedIn) {
        // Show an alert or any other notification to prompt the user to log in
        toast.error('Please sign in to add a comment.');
        return;
      }
    if (newComment.trim() === '') {
      return;
    }

    try {
      await axios.post(`${BASE_URL}/blog/${slug}/comments`, {
        username,
        text: newComment,
        userImage // Send user's profile image along with the comment
      });

      // Update comments state with the new comment
      setComments(prevComments => [
        ...prevComments,
        { username, text: newComment, date: new Date().toISOString(), userImage }
      ]);

      // Clear the comment input
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <div className="mb-6">
        {comments.map((comment, index) => (
          <div key={index} className="mb-4 p-4">
            <div className="flex items-center mb-2">
              {comment.userImage && (
                <img src={comment.userImage} alt={comment.username} className="w-8 h-8 rounded-full mr-2" />
              )}
              <p className="text-gray-700 "><strong>{comment.username}</strong> on {new Date(comment.date).toLocaleDateString()}</p>
            </div>
            <p className="text-gray-700 ">{comment.text}</p>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border border-[var(--primary-text-color)] rounded "
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-[var(--teal-color)] text-white rounded"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;
