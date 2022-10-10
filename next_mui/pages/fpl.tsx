import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ResultDb } from "../types/fixture_db";
import XgTable from "../components/xg/table";
import { pool } from "../database/db";

type Props = {
  fixture: ResultDb[];
};

const About: NextPage<Props> = ({ fixture }) => {
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
        <Typography variant="h5" component="h1" gutterBottom>
          Premier League 2022/2023 Completed Fixtures
        </Typography>
        <Box maxWidth="lg">
          <XgTable fixture={fixture}></XgTable>
        </Box>
      </Box>
    </Container>
  );
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  const season = 12310;

  let fixture: ResultDb[] = [];
  try {
    const queryResult = await pool.query(`
      SELECT fixture_id,
             TRUNC(EXTRACT(EPOCH FROM start_time)) as start_time,
             home_id,
             home_name,
             home_score,
             home_xg,
             away_id,
             away_name,
             away_score,
             away_xg
      FROM fixture_${season}
      ORDER BY start_time DESC, home_name;
      `);

    fixture = queryResult.rows;
  } catch (err: any) {
    console.error(err.message);
  }

  return {
    props: { fixture: fixture },
  };
}

export default About;
