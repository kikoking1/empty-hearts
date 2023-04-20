import { useRef, useState, useEffect, useReducer } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../util/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, Link, Container, Alert } from "@mui/material";
import classes from "./Login.module.scss";
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
          "Must contain at least one uppercase letter, one lowercase letter, one number, one special character, no spaces, and between 8 to 24 characters.";
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

const Login = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { setAuth } = useAuth();

  const [apiErrMsg, setApiErrMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/Auth/login",
        JSON.stringify({
          username: formState.username.value.toLowerCase(),
          password: formState.password.value,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data;
      const tokenParsed = JSON.parse(window.atob(accessToken.split(".")[1]));
      let roles = ["User"];

      Object.keys(tokenParsed).forEach((key) => {
        if (key.includes("/role")) {
          roles = [tokenParsed[key]];
        }
      });

      setAuth({
        username: formState.username.value.toLowerCase(),
        password: formState.password.value,
        roles,
        accessToken,
      });
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

      navigate("/posts", { replace: true });
    } catch (err) {
      if (!err?.response) {
        setApiErrMsg("Login failed. Please try again later.");
      } else {
        setApiErrMsg(err?.response?.data);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Card className={classes.loginCard} variant="outlined">
        <h1>Login</h1>
        {apiErrMsg && (
          <Alert severity="error" variant="outlined" sx={{ marginBottom: 3 }}>
            {apiErrMsg}
          </Alert>
        )}
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            error={formState.username.hasError && formState.username.touched}
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
            error={formState.password.hasError && formState.password.touched}
            variant="standard"
            type="password"
            id="password"
            autoComplete="off"
            onChange={(e) =>
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
            inputProps={{ maxLength: 24 }}
          />

          <Button
            className={classes.loginBtnSpacerTop}
            variant="contained"
            type="submit"
            disabled={!formState.isFormValid}
          >
            Login
          </Button>
        </form>

        <p>
          <br />
          Need an Account?
          <br />
          <Link
            component="button"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </Link>
        </p>
      </Card>
    </Container>
  );
};

export default Login;
