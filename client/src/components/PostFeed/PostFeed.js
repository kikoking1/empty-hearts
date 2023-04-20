import React from "react";
import Post from "../Post/Post";
import { Alert } from "@mui/material";

const PostFeed = (props) => {
  return (
    <div>
      {props.apiErrMsg && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ marginBottom: 3, marginTop: 3 }}
        >
          {props.apiErrMsg}
        </Alert>
      )}
      {props.posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </div>
  );
};

export default PostFeed;
