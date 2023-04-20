import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Post from "../Post/Post";
import { Typography } from "@mui/material";

const PostFeed = () => {
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");

  const [posts, setPosts] = useState([]);

  const handleLoadPosts = async () => {
    try {
      const response = await axiosPrivate.get("/api/Post/0/100", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setPosts(response?.data);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Failed to fetch posts...");
      }
    }
  };

  useEffect(() => {
    handleLoadPosts();
  }, []);

  return (
    <div>
      <Typography
        sx={{ mb: 1.5, fontSize: 14, fontStyle: "italic" }}
        color={"error"}
      >
        {errMsg}
      </Typography>
      {posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </div>
  );
};

export default PostFeed;
