import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import AddPostForm from "../../components/AddPostForm.js/AddPostForm";
import PostFeed from "../../components/PostFeed/PostFeed";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Posts = () => {
  const axiosPrivate = useAxiosPrivate();

  const [apiErrMsg, setApiErrMsg] = useState("");

  const [posts, setPosts] = useState([]);

  const handleLoadPosts = async () => {
    try {
      const response = await axiosPrivate.get("/api/Post/0/100", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setPosts(response?.data);
      setApiErrMsg("");
    } catch (err) {
      if (!err?.response) {
        setApiErrMsg(err?.response?.data);
      } else {
        setApiErrMsg("Failed to fetch posts...");
      }
    }
  };

  useEffect(() => {
    handleLoadPosts();
  }, []);

  return (
    <Container maxWidth="sm">
      <h1>Post Feed</h1>

      <AddPostForm handleLoadPosts={handleLoadPosts} />
      <PostFeed posts={posts} apiErrMsg={apiErrMsg} />
    </Container>
  );
};

export default Posts;
