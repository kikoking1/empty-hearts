import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import AddPostForm from "../../components/AddPostForm/AddPostForm";
import PostFeed from "../../components/PostFeed/PostFeed";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const Posts = () => {
  const { auth } = useAuth();
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

  const handleLikeButtonClick = async (post) => {
    if (!auth?.accessToken) return;

    let isSuccess = false;

    try {
      if (post.likedByUser) {
        await axiosPrivate.delete(`/api/Like/${post.id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } else {
        await axiosPrivate.post(`/api/Like/${post.id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }

      isSuccess = true;
      setApiErrMsg("");
    } catch (err) {
      if (!err?.response) {
        setApiErrMsg(err?.response?.data);
      } else {
        setApiErrMsg("Failed to fetch posts...");
      }
    }

    if (isSuccess) {
      setPosts((prevPosts) => {
        const newPosts = [...prevPosts];
        const postIndex = newPosts.findIndex(
          (postItem) => postItem.id === post.id
        );
        newPosts[postIndex].likedByUser = !newPosts[postIndex].likedByUser;
        newPosts[postIndex].likeCount += newPosts[postIndex].likedByUser
          ? 1
          : -1;
        return newPosts;
      });
    }
  };

  useEffect(() => {
    handleLoadPosts();
  }, []);

  useEffect(() => {
    if (!auth?.accessToken) {
      handleLoadPosts();
    }
  }, [auth?.accessToken]);

  return (
    <Container maxWidth="sm">
      <h1>Post Feed</h1>

      <AddPostForm handleLoadPosts={handleLoadPosts} />
      <PostFeed
        posts={posts}
        handleLikeButtonClick={handleLikeButtonClick}
        apiErrMsg={apiErrMsg}
      />
    </Container>
  );
};

export default Posts;
