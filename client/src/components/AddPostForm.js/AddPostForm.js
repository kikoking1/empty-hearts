import React, { useState, useReducer } from "react";
import SentimentSatisfiedAltSharpIcon from "@mui/icons-material/SentimentSatisfiedAltSharp";
import classes from "./AddPostForm.module.scss";
import { yellow } from "@mui/material/colors";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  UPDATE_FORM,
  formReducer,
  onFocusOut,
  onInputChange,
} from "../../util/formUtils";

import {
  Button,
  Card,
  Typography,
  CardContent,
  Alert,
  TextField,
  Link,
  dividerClasses,
} from "@mui/material";

const initialState = {
  message: { value: "", touched: false, hasError: true, error: "" },
  citation: { value: "", touched: false, hasError: false, error: "" },
};

const inputValidation = (name, value, formState) => {
  let hasError = false,
    error = "";
  switch (name) {
    case "message":
      if (value.trim() === "") {
        hasError = true;
        error = "Message cannot be empty.";
      } else {
        hasError = false;
        error = "";
      }
      break;
    default:
      break;
  }
  return { hasError, error };
};

const AddPostForm = (props) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [formState, dispatch] = useReducer(
    formReducer,
    structuredClone(initialState)
  );

  const [apiErrMsg, setApiErrMsg] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosPrivate.post(
        "/api/Post",
        JSON.stringify({
          body: formState.message.value,
          citation: formState.citation.value,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Reset state
      for (const name in formState) {
        if (name !== "isFormValid") {
          dispatch({
            type: UPDATE_FORM,
            data: {
              name,
              value: initialState[name].value,
              hasError: initialState[name].hasError,
              error: initialState[name].error,
              touched: initialState[name].touched,
              isFormValid: false,
            },
          });
        }
      }
      setApiErrMsg("");
      props.handleLoadPosts();
    } catch (err) {
      if (!err?.response) {
        setApiErrMsg("Create Post Failed...");
      } else {
        setApiErrMsg(err?.response?.data);
      }
    }
  };

  console.log("auth: ", auth);

  return (
    <Card className={classes.addPostFormCard} variant="outlined">
      <CardContent>
        {!auth?.accessToken ? (
          <Typography
            sx={{ mb: 1.5, fontSize: 18, marginTop: 2 }}
            color="text.primary"
          >
            Have a positive message to share with the world? <br />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/signup");
              }}
              sx={{ marginLeft: 2 }}
            >
              Sign Up
            </Button>
          </Typography>
        ) : (
          <>
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
            {apiErrMsg && (
              <Alert
                severity="error"
                variant="outlined"
                sx={{ marginBottom: 3 }}
              >
                {apiErrMsg}
              </Alert>
            )}

            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                error={formState.message.hasError && formState.message.touched}
                variant="standard"
                label="Message"
                id="message"
                autoComplete="off"
                onChange={(e) =>
                  onInputChange(
                    "message",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                onBlur={(e) =>
                  onFocusOut(
                    "message",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                value={formState.message.value}
                size="small"
                fullWidth
                required
                multiline={true}
                inputProps={{ maxLength: 500 }}
                helperText={`${formState.message.value.length}/500`}
              />

              <TextField
                variant="standard"
                label="Author/Source"
                id="citation"
                autoComplete="off"
                onChange={(e) =>
                  onInputChange(
                    "citation",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                onBlur={(e) =>
                  onFocusOut(
                    "citation",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                value={formState.citation.value}
                size="small"
                fullWidth
                inputProps={{ maxLength: 100 }}
                helperText={`${formState.citation.value.length}/100`}
                sx={{ marginTop: 1 }}
              />
              <Button
                className={classes.addPostBtnSpacerTop}
                variant="contained"
                type="submit"
                disabled={!formState.isFormValid}
              >
                Submit
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPostForm;
