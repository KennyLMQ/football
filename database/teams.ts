import { pool } from "./db";

export async function getTeamIds() {
  return await pool.query("SELECT team_id FROM teams");
}

export async function insertTeam(id: Number, name: String) {
  return await pool.query(
    `
      INSERT INTO teams
      VALUES
      ($1, $2)
    `,
    [id, name]
  );
}
