import { pool } from "../../../../database/db";

export default async function handler(req: any, res: any) {
  if (req.headers["api-secret"] !== process.env.API_SECRET) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const season = 12310;
  let teams = [];

  try {
    const createTable = await pool.query(
      `
        CREATE TABLE IF NOT EXISTS teams (
          team_id INT UNIQUE NOT NULL,
          team_name CHAR(64) NOT NULL
        );
      `
    );
    // console.debug(createTable);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error creating table" });
  }

  try {
    const teamsQuery = await pool.query(
      `
        SELECT home_id AS team_id,
               home_name AS team_name
        FROM fixtures_${season}
        UNION
        SELECT away_id AS team_id,
               away_name AS team_name
        FROM fixtures_${season};
      `
    );

    if (teamsQuery.rowCount === 0) {
      return res.status(404).json({ message: "Not Found"})
    }
    teams = teamsQuery.rows;
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error retrieving fixture data" });
  }

  let teamIdList: number[] = [];
  try {
    const teamIdQuery = await pool.query(`SELECT team_id FROM teams`);
    teamIdList = teamIdQuery.rows.map((value) => value.team_id);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error retrieving team data" });
  }

  const filteredResult = teams.filter(
    (value) => !teamIdList.find((id) => id === value.team_id)
  );

  console.log(filteredResult);

  filteredResult.forEach(async (value) => {
    try {
      const insertTeam = await pool.query(
        `
          INSERT INTO teams
          VALUES
          (${value.team_id}, '${value.team_name.trim()}');
        `
      );
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ message: "Error inserting table" });
    }
  });

  res
    .status(200)
    .json({ message: `Inserted ${filteredResult.length} team(s)` });
}
