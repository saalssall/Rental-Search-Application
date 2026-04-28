import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import logo from "/images/logo.png"; // update path if needed

const NAV_LINKS = [
  { label: "About", path: "/" },
  { label: "Home", path: "/home" },
  { label: "Search", path: "/search" },
];

const activeStyle = ({ isActive }) => ({
  color: isActive ? "yellow" : "white",
  textDecoration: "none",
});

export default function AppNavigation() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1B4332" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* Logo */}
        <Box component={NavLink} to="/">
          <Box component="img" src={logo} alt="Rental Search" sx={{ height: 100 }} />
        </Box>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {NAV_LINKS.map(({ label, path }) => (
            <Button key={label} component={NavLink} to={path} style={activeStyle}>
              {label}
            </Button>
          ))}

          {loggedIn ? (
            <Button sx={{ color: "white" }} onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button component={NavLink} to="/register" style={activeStyle}>Register</Button>
              <Button component={NavLink} to="/login" style={activeStyle}>Login</Button>
            </>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}