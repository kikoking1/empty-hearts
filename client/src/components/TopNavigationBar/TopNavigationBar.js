import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { red } from "@mui/material/colors";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Hidden, SwipeableDrawer, IconButton, Link } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const TopNavigationBar = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ marginBottom: 6 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            (Beta) Empty Hearts{" "}
            <FavoriteBorderIcon
              sx={{
                fontSize: 22,
                verticalAlign: "text-bottom",
                color: red[700],
              }}
            />
          </Typography>
          <Hidden smUp>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon onClick={() => setOpen(true)} />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            {!auth?.accessToken ? (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  LogIn
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
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Log Out
              </Button>
            )}
          </Hidden>
        </Toolbar>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          <div>
            <IconButton>
              <ChevronRightIcon onClick={() => setOpen(false)} />
            </IconButton>
          </div>

          <List>
            <ListItem
              button
              onClick={() => {
                navigate("/posts");
              }}
              color={"text.primary"}
              sx={{ width: 150 }}
            >
              Posts Feed
            </ListItem>
            {!auth?.accessToken ? (
              <>
                <ListItem
                  button
                  onClick={() => {
                    navigate("/login");
                  }}
                  color={"text.primary"}
                  sx={{ width: 150 }}
                >
                  Log In
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    navigate("/signup");
                  }}
                  color={"text.primary"}
                  sx={{ width: 150 }}
                >
                  Sign Up
                </ListItem>
              </>
            ) : (
              <ListItem
                button
                onClick={() => {
                  window.location.reload();
                }}
                color={"text.primary"}
                sx={{ width: 150 }}
              >
                Log Out
              </ListItem>
            )}
          </List>
        </SwipeableDrawer>
      </AppBar>
    </Box>
  );
};

export default TopNavigationBar;
