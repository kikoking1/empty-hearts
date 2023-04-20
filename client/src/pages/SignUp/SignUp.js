import { useRef, useState, useEffect, useReducer } from "react";

import axios from "../../util/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, Link, Container } from "@mui/material";
import classes from "./SignUp.module.scss";
import { PASSWORD_REGEX, RFC2882_EMAIL_REGEX } from "../../util/globals/regex";

const UPDATE_FORM = "UPDATE_FORM";

const initialState = {
  username: { value: "", touched: false, hasError: true, error: "" },
  password: { value: "", touched: false, hasError: true, error: "" },
  passwordMatch: { value: "", touched: false, hasError: true, error: "" },
};

const validateInput = (name, value, formState) => {
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

const onFocusOut = (name, value, dispatch, formState) => {
  const { hasError, error } = validateInput(name, value, formState);
  let isFormValid = true;
  for (const key in formState) {
    const item = formState[key];
    if (key === name && hasError) {
      isFormValid = false;
      break;
    } else if (key !== name && item.hasError) {
      isFormValid = false;
      break;
    }
  }

  dispatch({
    type: UPDATE_FORM,
    data: { name, value, hasError, error, touched: true, isFormValid },
  });
};

const onInputChange = (name, value, dispatch, formState) => {
  const { hasError, error } = validateInput(name, value, formState);
  let isFormValid = true;

  for (const key in formState) {
    const item = formState[key];
    // Check if the current field has error
    if (key === name && hasError) {
      isFormValid = false;
      break;
    } else if (key !== name && item.hasError) {
      // Check if any other field has error
      isFormValid = false;
      break;
    }
  }

  dispatch({
    type: UPDATE_FORM,
    data: {
      name,
      value,
      hasError,
      error,
      touched: formState[name].touched,
      isFormValid,
    },
  });
};

const formsReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_FORM:
      const { name, value, hasError, error, touched, isFormValid } =
        action.data;
      return {
        ...state,
        // update the state of the particular field,
        // by retaining the state of other fields
        [name]: { ...state[name], value, hasError, error, touched },
        isFormValid,
      };
    default:
      return state;
  }
};

const SignUp = () => {
  const [formState, dispatch] = useReducer(formsReducer, initialState);

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
    } catch (err) {
      if (!err?.response) {
        setApiErrMsg("Registration failed. Please try again later.");
      } else {
        setApiErrMsg(err?.response);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Card className={classes.signupCard} variant="outlined">
        <p className={errApiMsg ? "errmsg" : "offscreen"} aria-live="assertive">
          {errApiMsg}
        </p>
        <h1>Register</h1>
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
                  onInputChange("username", e.target.value, dispatch, formState)
                }
                value={formState.username.value}
                size="small"
                fullWidth
                required
                aria-invalid={!formState.username.hasError ? "false" : "true"}
                onBlur={(e) =>
                  onFocusOut("username", e.target.value, dispatch, formState)
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
                  onInputChange("password", e.target.value, dispatch, formState)
                }
                value={formState.password.value}
                size="small"
                fullWidth
                required
                aria-invalid={!formState.password.hasError ? "false" : "true"}
                onBlur={(e) =>
                  onFocusOut("password", e.target.value, dispatch, formState)
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
                    formState
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
                    formState
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
