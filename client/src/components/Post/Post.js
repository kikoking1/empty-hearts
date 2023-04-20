import React, { useState, useEffect } from "react";

import { Button, Card, Typography, CardContent } from "@mui/material";

const Post = (props) => {
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
        <Typography variant="p" sx={{ fontSize: 11, fontStyle: "italic" }}>
          ~ {props.post.citation ? props.post.citation : "Anonymous"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
