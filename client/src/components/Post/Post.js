import React from "react";

import { Card, Typography, CardContent } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { red } from "@mui/material/colors";

const Post = (props) => {
  const heartIconStyles = {
    fontSize: 18,
    verticalAlign: "text-bottom",
    color: red[700],
    cursor: "pointer",
  };
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
        <Typography
          variant="p"
          sx={{
            fontSize: 11,
            fontStyle: "italic",
            display: "block",
            marginBottom: 2,
          }}
        >
          ~ {props.post.citation ? props.post.citation : "Anonymous"}
        </Typography>

        <div>
          {props.post.likedByUser ? (
            <FavoriteIcon
              sx={heartIconStyles}
              onClick={() => props.handleLikeButtonClick(props.post)}
            />
          ) : (
            <FavoriteBorderIcon
              sx={heartIconStyles}
              onClick={() => props.handleLikeButtonClick(props.post)}
            />
          )}

          <Typography
            variant="p"
            sx={{
              fontSize: 11,
              verticalAlign: "text-bottom",
              marginLeft: 1,
            }}
          >
            {props.post.likeCount}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
