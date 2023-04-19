import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../util/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, Link, Container } from "@mui/material";
import classes from "./Login.module.scss";
import { PASSWORD_REGEX, RFC2882_EMAIL_REGEX } from "../../util/globals/regex";

const Login = () => {
  const { setAuth } = useAuth();

  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUsername(RFC2882_EMAIL_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/Auth/login",
        JSON.stringify({
          username: username.toLowerCase(),
          password: password,
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

      setAuth({ username, password, roles, accessToken });
      setUsername("");
      setPassword("");
      navigate("/posts", { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <Container maxWidth="sm">
      <Card className={classes.loginCard} variant="outlined">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Login</h1>

        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            error={!validUsername && usernameTouched}
            variant="standard"
            type="email"
            label="Username"
            id="username"
            ref={usernameRef}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            size="small"
            fullWidth
            required
            aria-invalid={validUsername ? "false" : "true"}
            onBlur={() => setUsernameTouched(true)}
            helperText={"must be valid email syntax"}
          />

          <TextField
            label="Password"
            error={!validPassword && passwordTouched}
            variant="standard"
            type="password"
            id="password"
            autoComplete="off"
            onInput={(e) => setPassword(e.target.value)}
            value={password}
            size="small"
            fullWidth
            required
            aria-invalid={validPassword ? "false" : "true"}
            onBlur={() => setPasswordTouched(true)}
            helperText="Must contain at least one uppercase letter, one lowercase letter, one number, one special character and between 8 to 24 characters."
          />

          <Button
            className={classes.loginBtnSpacerTop}
            variant="contained"
            type="submit"
            disabled={!validUsername || !validPassword ? true : false}
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
