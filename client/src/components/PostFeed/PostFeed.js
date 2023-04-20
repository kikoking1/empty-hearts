import React from "react";
import Post from "../Post/Post";
import { Alert, Typography } from "@mui/material";

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
      {props.posts.length === 0 && (
        <Typography
          sx={{
            mb: 1.5,
            fontSize: 20,
            textAlign: "center",
            marginTop: 3,
          }}
          color="text.secondary"
        >
          No posts yet... <br /> Be the first to mae a post!
        </Typography>
      )}
      {props.posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </div>
  );
};

export default PostFeed;
