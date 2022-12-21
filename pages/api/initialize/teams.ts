import { getTeams } from "../../../database/fixtures";
import { getTeamIds, insertTeam } from "../../../database/teams";

export default async function handler(req: any, res: any) {
  if (req.headers["api-secret"] !== process.env.API_SECRET) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const season = 12310;
  let teams = [];
  let teamIds: number[] = [];

  try {
    const [r1, r2] = await Promise.all([getTeams(season), getTeamIds()]);
    // console.log(r1.rows);
    // console.log(r2.rows);
    teams = r1.rows;
    teamIds = r2.rows.map((value) => value.team_id);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error retrieving data" });
  }

  const teamsNotInTeamTable = teams.filter(
    (value) => !teamIds.find((id) => id === value.team_id)
  );

  teamsNotInTeamTable.forEach(async (value) => {
    try {
      await insertTeam(value.team_id, value.team_name);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ message: "Error inserting table" });
    }
  });

  res
    .status(200)
    .json({ message: `Inserted ${teamsNotInTeamTable.length} team(s)` });
}
