import React, { useState, useEffect } from "react";
import SentimentSatisfiedAltSharpIcon from "@mui/icons-material/SentimentSatisfiedAltSharp";
import classes from "./AddPostForm.module.scss";
import { yellow, red } from "@mui/material/colors";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Container,
  Button,
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
} from "@mui/material";

const AddPostForm = () => {
  const [message, setMessage] = useState("");
  const [validMessage, setValidMessage] = useState(false);
  const [messageTouched, setMessageTouched] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (messageTouched) {
      setValidMessage(message.length > 0);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        "/api/Post",
        JSON.stringify({
          body: message,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage("");
      setMessageTouched(false);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
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

        <Typography
          sx={{ mb: 1.5, fontSize: 14, fontStyle: "italic" }}
          color={"error"}
        >
          {errMsg}
        </Typography>

        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            error={!validMessage && messageTouched}
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
            onBlur={() => setMessageTouched(true)}
            multiline={true}
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
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};

export default AddPostForm;
