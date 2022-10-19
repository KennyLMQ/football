import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { NextPage } from "next";
import * as React from "react";

import XgTable from "../../components/xg/table";
import { pool } from "../../database/db";
import { FixtureDb } from "../../types/fixturesDb";

type Props = {
  fixtures: FixtureDb[];
};

const About: NextPage<Props> = ({ fixtures }) => {
  return (
    <Container
      sx={{
        my: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Premier League 2022/2023 Completed Fixtures
      </Typography>
      <XgTable fixtures={fixtures}></XgTable>
    </Container>
  );
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  const season = 12310;

  let fixtures: FixtureDb[] = [];
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
      FROM fixtures_${season}
      ORDER BY start_time DESC, home_name;
    `);

    fixtures = queryResult.rows;
  } catch (err: any) {
    console.error(err.message);
  }

  return {
    props: { fixtures },
    revalidate: 60,
  };
}

export default About;
