import React from 'react';
import { Box, useDispatch, useSelector } from 'amos';

// Define the initial state for the commentBox
const initialState = {
  id: '',
  content: '',
};

// Define the commentBox
const commentBox = new Box('comment', initialState);

// Define actions and mutations for the commentBox
const createComment = commentBox.mutation((state, comment) => ({ ...state, ...comment }));
const updateComment = commentBox.mutation((state, comment) => ({ ...state, ...comment }));
const deleteComment = commentBox.mutation(() => initialState);

// Define the Comment component
const Comment = () => {
  const dispatch = useDispatch();
  const [comment] = useSelector(commentBox);

  const handleCreateComment = (comment) => {
    dispatch(createComment(comment));
  };

  const handleUpdateComment = (comment) => {
    dispatch(updateComment(comment));
  };

  const handleDeleteComment = () => {
    dispatch(deleteComment());
  };

  return (
    <div>
      <p>{comment.content}</p>
      <button onClick={handleCreateComment}>Create Comment</button>
      <button onClick={handleUpdateComment}>Update Comment</button>
      <button onClick={handleDeleteComment}>Delete Comment</button>
    </div>
  );
};

export default Comment;
