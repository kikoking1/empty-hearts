import React, { useState, useReducer } from "react";
import SentimentSatisfiedAltSharpIcon from "@mui/icons-material/SentimentSatisfiedAltSharp";
import classes from "./AddPostForm.module.scss";
import { yellow } from "@mui/material/colors";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
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

const AddPostForm = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState);

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
        dispatch({
          type: UPDATE_FORM,
          data: {
            name,
            value: "",
            hasError: true,
            error: "",
            touched: false,
            isFormValid: false,
          },
        });
      }
      setApiErrMsg("");
    } catch (err) {
      if (!err?.response) {
        setApiErrMsg("No Server Response.");
      } else {
        setApiErrMsg("Create Post Failed...");
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

        {apiErrMsg && (
          <Alert severity="error" variant="outlined" sx={{ marginBottom: 3 }}>
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
            label="Citation/Source"
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
      </CardContent>
    </Card>
  );
};

export default AddPostForm;
