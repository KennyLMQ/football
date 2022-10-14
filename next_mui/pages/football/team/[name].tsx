import * as React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FixtureDb } from "../../../types/fixturesDb";
import XgTable from "../../../components/xg/table";
import { pool } from "../../../database/db";

type Props = {
  fixtures: FixtureDb[];
};

const Team: NextPage<Props> = ({ fixtures }) => {
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
          <XgTable fixtures={fixtures} />
        </Box>
      </Box>
    </Container>
  );
};

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps({ params }: { params: { name: string } }) {
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
      WHERE LOWER (home_name) = '${params.name}'
        OR  LOWER (away_name) = '${params.name}'
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

export async function getStaticPaths() {
  let teamList: { team_id: number; team_name: string }[] = [];

  try {
    const teamQuery = await pool.query(`SELECT * FROM teams`);
    teamList = teamQuery.rows;
  } catch (err: any) {
    console.error(err.message);
  }

  let params = teamList.map((value) => {
    return {
      params: {
        name: value.team_name.trim().toLowerCase(),
      },
    };
  });

  return {
    paths: params,
    fallback: false,
  };
}

export default Team;
