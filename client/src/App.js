import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import NotFound from "./pages/NotFound/NotFound";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import Posts from "./pages/Posts/Posts";
import Home from "./pages/Home/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import TopNavigationBar from "./components/TopNavigationBar/TopNavigationBar";

const ROLES = {
  User: "User",
  Admin: "Admin",
};

const themeDark = createTheme({
  palette: {
    mode: "dark",
    primary: blueGrey,
    divider: "rgb(0, 16, 32)",
    background: {
      default: "rgb(0, 16, 32)",
      paper: "rgb(6 28 46)",
    },
    text: {
      primary: "#ccc",
      secondary: "#637d93",
    },
  },
});

const themeLight = createTheme({
  palette: {
    mode: "light",
    primary: blueGrey,
  },
});

function App() {
  return (
    <ThemeProvider theme={themeDark}>
      <CssBaseline />
      <TopNavigationBar />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/" element={<Home />} />

          {/* we want to protect these routes (NOTE: none to protect, yet!) */}

          {/* catch all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
