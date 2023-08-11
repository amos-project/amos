import React from 'react';
import { Box, useDispatch, useSelector } from 'amos';

// Define the initial state for the blogBox
const initialState = {
  id: '',
  title: '',
  content: '',
  comments: [],
};

// Define the blogBox
const blogBox = new Box('blog', initialState);

// Define actions and mutations for the blogBox
const createBlog = blogBox.mutation((state, blog) => ({ ...state, ...blog }));
const updateBlog = blogBox.mutation((state, blog) => ({ ...state, ...blog }));
const deleteBlog = blogBox.mutation(() => initialState);

// Define the Blog component
const Blog = () => {
  const dispatch = useDispatch();
  const [blog] = useSelector(blogBox);

  const handleCreateBlog = (blog) => {
    dispatch(createBlog(blog));
  };

  const handleUpdateBlog = (blog) => {
    dispatch(updateBlog(blog));
  };

  const handleDeleteBlog = () => {
    dispatch(deleteBlog());
  };

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
      <button onClick={handleCreateBlog}>Create Blog</button>
      <button onClick={handleUpdateBlog}>Update Blog</button>
      <button onClick={handleDeleteBlog}>Delete Blog</button>
    </div>
  );
};

export default Blog;