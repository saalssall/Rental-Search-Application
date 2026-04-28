import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import Cards from "../components/Cards";

const Hero = () => (
  <Box
    sx={{
      position: "relative",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <Box
      component="img"
      src="/images/pic_home.jpeg"
      alt="Rental property"
      sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.45)" }} />

    <Box sx={{ position: "relative", zIndex: 1, color: "white", px: 2 }}>
      <Typography variant="h2" fontWeight={700} gutterBottom color="white">
        Find Your Next Rental
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, opacity: 0.85 }}>
        Browse available listings or narrow down your search with filters.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" size="large" href="/properties">View Properties</Button>
        <Button variant="outlined" size="large" href="/filters" sx={{ color: "white", borderColor: "white" }}>Filters</Button>
      </Stack>
    </Box>
  </Box>
);

const Home = () => (
  <main>
    <Hero />
    <Box sx={{ p: 4 }}>
      <Cards />
    </Box>
  </main>
);

export default Home;
