import { useState, useReducer } from "react";

import axios from "../../util/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, Link, Container, Alert } from "@mui/material";
import classes from "./SignUp.module.scss";
import { PASSWORD_REGEX, RFC2882_EMAIL_REGEX } from "../../util/globals/regex";
import {
  UPDATE_FORM,
  formReducer,
  onFocusOut,
  onInputChange,
} from "../../util/formUtils";

const initialState = {
  username: { value: "", touched: false, hasError: true, error: "" },
  password: { value: "", touched: false, hasError: true, error: "" },
  passwordMatch: { value: "", touched: false, hasError: true, error: "" },
};

const inputValidation = (name, value, formState) => {
  let hasError = false,
    error = "";
  switch (name) {
    case "username":
      if (value.trim() === "") {
        hasError = true;
        error = "Username cannot be empty.";
      } else if (!RFC2882_EMAIL_REGEX.test(value)) {
        hasError = true;
        error = "Must be valid email syntax.";
      } else {
        hasError = false;
        error = "";
      }
      break;
    case "password":
      if (value === "") {
        hasError = true;
        error = "Password cannot be empty.";
      } else if (!PASSWORD_REGEX.test(value)) {
        hasError = true;
        error =
          "Must contain at least one uppercase letter, one lowercase letter, one number, one special character and between 8 to 24 characters.";
      } else {
        hasError = false;
        error = "";
      }
      break;
    case "passwordMatch":
      if (value !== formState.password.value) {
        hasError = true;
        error = "Passwords must match.";
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

const SignUp = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  const [errApiMsg, setApiErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/Auth/register",
        JSON.stringify({
          username: formState.username.value.toLowerCase(),
          password: formState.password.value,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setSuccess(true);

      //clear state and controlled inputs
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
        setApiErrMsg("Registration failed. Please try again later.");
      } else {
        setApiErrMsg(err?.response?.data);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Card className={classes.signupCard} variant="outlined">
        <h1>Register</h1>
        {errApiMsg && (
          <Alert severity="error" variant="outlined" sx={{ marginBottom: 3 }}>
            {errApiMsg}
          </Alert>
        )}

        {success ? (
          <section>
            <h3>Account Successfully Created!</h3>
            <p>
              <Link
                component="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign In
              </Link>
            </p>
          </section>
        ) : (
          <>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                error={
                  formState.username.hasError && formState.username.touched
                }
                variant="standard"
                type="email"
                label="Username"
                id="username"
                autoComplete="off"
                onChange={(e) =>
                  onInputChange(
                    "username",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                value={formState.username.value}
                size="small"
                fullWidth
                required
                aria-invalid={!formState.username.hasError ? "false" : "true"}
                onBlur={(e) =>
                  onFocusOut(
                    "username",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                helperText={
                  formState.username.hasError &&
                  formState.username.touched &&
                  formState.username.error
                }
              />

              <TextField
                label="Password"
                error={
                  formState.password.hasError && formState.password.touched
                }
                variant="standard"
                type="password"
                id="password"
                autoComplete="off"
                onInput={(e) =>
                  onInputChange(
                    "password",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                value={formState.password.value}
                size="small"
                fullWidth
                required
                aria-invalid={!formState.password.hasError ? "false" : "true"}
                onBlur={(e) =>
                  onFocusOut(
                    "password",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                helperText={
                  formState.password.hasError &&
                  formState.password.touched &&
                  formState.password.error
                }
                // helperText="Must contain at least one uppercase letter, one lowercase letter, one number, one special character and between 8 to 24 characters."
              />

              <TextField
                label="Confirm Password"
                error={
                  formState.passwordMatch.hasError &&
                  formState.passwordMatch.touched
                }
                variant="standard"
                type="password"
                id="confirm_password"
                autoComplete="off"
                onInput={(e) =>
                  onInputChange(
                    "passwordMatch",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                value={formState.passwordMatch.value}
                size="small"
                fullWidth
                required
                aria-invalid={
                  !formState.passwordMatch.hasError ? "false" : "true"
                }
                onBlur={(e) =>
                  onFocusOut(
                    "passwordMatch",
                    e.target.value,
                    dispatch,
                    formState,
                    inputValidation
                  )
                }
                helperText={
                  formState.passwordMatch.hasError &&
                  formState.passwordMatch.touched &&
                  formState.passwordMatch.error
                }
              />

              <Button
                className={classes.signUpBtnSpacerTop}
                variant="contained"
                type="submit"
                disabled={!formState.isFormValid}
              >
                Sign Up
              </Button>
            </form>

            <p>
              <br />
              Already registered?
              <br />
              <Link
                component="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign In
              </Link>
            </p>
          </>
        )}
      </Card>
    </Container>
  );
};

export default SignUp;
