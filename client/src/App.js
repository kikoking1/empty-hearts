import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import NotFound from "./pages/NotFound/NotFound";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Posts from "./pages/Posts/Posts";
import Home from "./pages/Home/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blueGrey, grey } from "@mui/material/colors";

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
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

function App() {
  return (
    <ThemeProvider theme={themeDark}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* we want to protect these routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/posts" element={<Posts />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* catch all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
