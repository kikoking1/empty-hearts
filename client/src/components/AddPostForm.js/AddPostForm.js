import React, { useState, useEffect } from "react";
import SentimentSatisfiedAltSharpIcon from "@mui/icons-material/SentimentSatisfiedAltSharp";
import classes from "./AddPostForm.module.scss";
import { yellow } from "@mui/material/colors";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {
  Button,
  Card,
  Typography,
  CardContent,
  Alert,
  TextField,
  Link,
} from "@mui/material";

const AddPostForm = () => {
  const [message, setMessage] = useState("");
  const [validMessage, setValidMessage] = useState(false);
  const [citation, setCitation] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setValidMessage(message.length > 0);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosPrivate.post(
        "/api/Post",
        JSON.stringify({
          body: message,
          citation: citation,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage("");
      setCitation("");
      setValidMessage(false);
      setErrMsg("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response.");
      } else {
        setErrMsg("Create Post Failed...");
      }
    }
  };

  return (
    <Card className={classes.addPostFormCard} variant="outlined">
      <CardContent>
        <Typography
          variant="h3"
          sx={{ fontSize: 20, marginBottom: 1, marginTop: 1 }}
        >
          Add Post
        </Typography>
        <Typography
          sx={{ mb: 1.5, fontSize: 14, fontStyle: "italic" }}
          color="text.primary"
        >
          Share something positive with the world today {""}
          <SentimentSatisfiedAltSharpIcon
            sx={{
              fontSize: 18,
              verticalAlign: "text-bottom",
              color: yellow[700],
            }}
          />
        </Typography>

        <Typography sx={{ mb: 1.5, fontSize: 12 }} color="text.primary">
          Need a positive message idea? Check this out: <br />
          <Link
            href="https://www.brainyquote.com/topics/positive-quotes"
            target="_blank"
          >
            https://www.brainyquote.com/topics/positive-quotes
          </Link>
        </Typography>

        {errMsg && (
          <Alert severity="error" variant="outlined" sx={{ marginBottom: 2 }}>
            {errMsg}
          </Alert>
        )}

        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            variant="standard"
            label="Message"
            id="message"
            autoComplete="off"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            size="small"
            fullWidth
            required
            aria-invalid={validMessage ? "false" : "true"}
            multiline={true}
            inputProps={{ maxLength: 500 }}
            helperText={`${message.length}/500`}
          />

          <TextField
            variant="standard"
            label="Citation/Source"
            id="citation"
            autoComplete="off"
            onChange={(e) => setCitation(e.target.value)}
            value={citation}
            size="small"
            fullWidth
            inputProps={{ maxLength: 100 }}
            helperText={`${citation.length}/100`}
            sx={{ marginTop: 1 }}
          />
          <Button
            className={classes.addPostBtnSpacerTop}
            variant="contained"
            type="submit"
            disabled={!validMessage ? true : false}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPostForm;
