import React from "react";
import { Container } from "@mui/material";
import AddPostForm from "../../components/AddPostForm.js/AddPostForm";
import PostFeed from "../../components/PostFeed/PostFeed";

const Posts = () => {
  return (
    <Container maxWidth="sm">
      <h1>Post Feed</h1>

      <AddPostForm />
      <PostFeed />
    </Container>
  );
};

export default Posts;
