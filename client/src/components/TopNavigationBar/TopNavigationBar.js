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
import { Hidden, SwipeableDrawer, IconButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const TopNavigationBar = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const navItems = [
    {
      id: 1,
      name: "Post Feed",
      clickHandler: () => {
        navigate("/posts");
      },
    },
  ];

  if (!auth?.accessToken) {
    navItems.push({
      id: 2,
      name: "Log In",
      clickHandler: () => {
        navigate("/login");
      },
    });
    navItems.push({
      id: 3,
      name: "Sign Up",
      clickHandler: () => {
        navigate("/signup");
      },
    });
  } else {
    navItems.push({
      id: 4,
      name: "Log Out",
      clickHandler: async () => {
        await axiosPrivate.get("/api/Auth/Logout");
        setAuth({});
        navigate("/posts");
      },
    });
  }

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
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            {navItems.map((item) => (
              <Button
                key={item.id}
                color={"inherit"}
                sx={{ textAlign: "center" }}
                onClick={item.clickHandler}
              >
                {item.name}
              </Button>
            ))}
          </Hidden>
        </Toolbar>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          <div>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronRightIcon />
            </IconButton>
          </div>

          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={item.clickHandler}
                color={"text.primary"}
                sx={{ width: 150 }}
              >
                {item.name}
              </ListItem>
            ))}
          </List>
        </SwipeableDrawer>
      </AppBar>
    </Box>
  );
};

export default TopNavigationBar;
