import React, { useState, useEffect } from "react";

import { Button, Card, Typography, CardContent } from "@mui/material";

const Post = (props) => {
  console.log(props);
  return (
    <Card
      sx={{ marginTop: "20px", paddingLeft: "40px", paddingRight: "40px" }}
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h3" sx={{ fontSize: 14, marginTop: 1 }}>
          {props.post.body}
        </Typography>
        <br />
        <Typography variant="p" sx={{ fontSize: 11 }}>
          Author:
          <br />
          {props.post.citation}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
