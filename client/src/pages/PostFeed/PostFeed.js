import React from "react";
import { Container, Card } from "@mui/material";
import classes from "./PostFeed.module.scss";
import AddPostForm from "../../components/AddPostForm.js/AddPostForm";

const PostFeed = () => {
  return (
    <Container maxWidth="sm">
      <h1>Post Feed</h1>

      <AddPostForm />
    </Container>
  );
};

export default PostFeed;
