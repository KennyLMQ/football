import { Card, CardMedia } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { NextPage } from "next";
import * as React from "react";

import Link from "../src/Link";

const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            height="140"
            image="/images/wip.png"
            alt="WIP"
          />
        </Card>
        <br />
        <Link href="/football/epl" color="secondary">
          Go to the EPL page
        </Link>
      </Box>
    </Container>
  );
};

export default Home;
