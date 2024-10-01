import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { BASE_URL } from '@/utils/funcitons';
import { toast } from 'sonner';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Importing delete and edit icons

type Comment = {
  _id: string;  // Assuming the comment has an ID
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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // Track comment being edited
  const [editedText, setEditedText] = useState(''); // Text for the comment being edited
  const [showAllComments, setShowAllComments] = useState(false); // Track if all comments are shown
  const { user, isSignedIn } = useUser();
  const username = user?.fullName || 'Anonymous';
  const userImage = user?.imageUrl || ''; // User's profile image URL

  // Move fetchComments out of useEffect so it can be reused
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/${slug}/comments`, {
        headers: {
          Authorization: `Bearer ${user?.primaryEmailAddress}`,
        },
      });

      // Sort comments by date in descending order
      const sortedComments = response.data.sort((a: Comment, b: Comment) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setComments(sortedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // Fetch comments initially when component mounts
  useEffect(() => {
    fetchComments();
  }, [slug, user?.primaryEmailAddress]);

  const handleAddComment = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to add a comment.');
      return;
    }
    if (newComment.trim() === '') {
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/blog/${slug}/comments`,
        {
          username,
          text: newComment,
          userImage,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.primaryEmailAddress}`,
          },
        }
      );

      // Fetch the updated comments after adding a new one
      fetchComments();
      toast.success('Comment added successfully.');

      setNewComment(''); // Clear input field
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${BASE_URL}/blog/${slug}/comments/${commentId}`, {
        data: { username }, // Pass the username to match the backend check
        headers: {
          Authorization: `Bearer ${user?.primaryEmailAddress}`,
        },
      });

      // Refetch comments after deleting
      fetchComments();
      toast.success('Comment deleted successfully.');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment.');
    }
  };

  const handleEditComment = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setEditedText(text); // Set the current comment text in the textarea
  };

  const handleSaveEditedComment = async (commentId: string) => {
    try {
      await axios.put(`${BASE_URL}/blog/${slug}/comments/${commentId}`, {
        username,
        text: editedText,
      }, {
        headers: {
          Authorization: `Bearer ${user?.primaryEmailAddress}`,
        },
      });

      // Refetch comments after editing
      fetchComments();
      setEditingCommentId(null); // Reset after editing
      toast.success('Comment edited successfully.');
    } catch (error) {
      console.error('Failed to edit comment:', error);
      toast.error('Failed to edit comment.');
    }
  };

  const handleToggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 4); // Limit to 4 comments if not showing all

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <div className="mb-6">
        {displayedComments.map((comment) => (
          <div key={comment._id} className="mb-4 p-4 border border-gray-300 rounded-lg relative">
            <div className="flex items-center mb-2">
              {comment.userImage && (
                <img
                  src={comment.userImage}
                  alt={comment.username}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <p className="text-gray-700">
                <strong>{comment.username}</strong> on{' '}
                {new Date(comment.date).toLocaleDateString()}
              </p>
            </div>

            {editingCommentId === comment._id ? (
              <div>
                {/* Textarea for editing the comment */}
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 border border-[var(--primary-text-color)] rounded"
                />
                {/* Save button below the textarea */}
                <button
                  onClick={() => handleSaveEditedComment(comment._id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-gray-700">{comment.text}</p>
            )}

            {comment.username === username && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() =>
                    editingCommentId === comment._id
                      ? handleSaveEditedComment(comment._id) // Save if editing
                      : handleEditComment(comment._id, comment.text) // Otherwise, edit
                  }
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length > 4 && (
        <p
          onClick={handleToggleComments}
          className="cursor-pointer text-blue-600 hover:underline mb-6"
        >
          {showAllComments ? 'Show Less' : 'Show More'}
        </p>
      )}

      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border border-[var(--primary-text-color)] rounded"
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
