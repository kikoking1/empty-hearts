import { useRef, useState, useEffect } from "react";

import axios from "../../util/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, Link, Container } from "@mui/material";
import classes from "./SignUp.module.scss";
import { PASSWORD_REGEX, RFC2882_EMAIL_REGEX } from "../../util/globals/regex";

const SignUp = () => {
  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validPasswordMatch, setValidPasswordMatch] = useState(false);
  const [matchPasswordTouched, setMatchPasswordTouched] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUsername(RFC2882_EMAIL_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));

    if (matchPasswordTouched) {
      setValidPasswordMatch(
        password === matchPassword &&
          password.length > 0 &&
          matchPassword.length > 0
      );
    }
  }, [password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/Auth/register",
        JSON.stringify({
          username: username.toLowerCase(),
          password: password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setSuccess(true);
      //clear state and controlled inputs
      setUsername("");
      setPassword("");
      setMatchPassword("");
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
      <Card className={classes.signupCard} variant="outlined">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Register</h1>
        {success ? (
          <section>
            <h3>Account Created!</h3>
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

              <TextField
                label="Confirm Password"
                error={!validPasswordMatch && matchPasswordTouched}
                variant="standard"
                type="password"
                id="confirm_password"
                autoComplete="off"
                onInput={(e) => setMatchPassword(e.target.value)}
                value={matchPassword}
                size="small"
                fullWidth
                required
                aria-invalid={validPasswordMatch ? "false" : "true"}
                onBlur={() => setMatchPasswordTouched(true)}
                helperText="Passwords must match."
              />

              <Button
                className={classes.signUpBtnSpacerTop}
                variant="contained"
                type="submit"
                disabled={
                  !validUsername || !validPassword || !validPasswordMatch
                    ? true
                    : false
                }
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
