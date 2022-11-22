import { pool } from "../../../database/db";
import { Fixtures, Status } from "../../../types/fixturesApi";

export default async function handler(req: any, res: any) {
  if (req.headers["api-secret"] !== process.env.API_SECRET) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const season = 12310;

  const response = await fetch(
    `${process.env.XG_URL!}/seasons/${season}/fixtures/`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.XG_KEY!,
        "X-RapidAPI-Host": process.env.XG_HOST!,
      },
    }
  );

  if (response.status !== 200) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const posts: Fixtures = await response.json();

  let fixture_time_map: { [key: string]: number } = {};
  try {
    const fixtureIdQuery = await pool.query(
      `SELECT fixture_id, 
              TRUNC(EXTRACT(EPOCH FROM update_time)) AS update_time
       FROM fixtures_${season}`
    );

    fixtureIdQuery.rows.forEach((value) => {
      fixture_time_map[value.fixture_id] = value.update_time;
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error retrieving data" });
  }

  const newFixtures = posts.result.filter(
    (value) =>
      value.status === Status.Finished && !(value.id in fixture_time_map)
  );
  console.debug("newFixtures", newFixtures);

  const updatedFixtures = posts.result.filter(
    (value) =>
      value.status === Status.Finished &&
      value.id in fixture_time_map &&
      fixture_time_map[value.id] < value.updateTime
  );
  console.debug("updatedFixtures", updatedFixtures);

  if (newFixtures.length === 0 && updatedFixtures.length === 0) {
    return res
      .status(200)
      .json({ message: "Is there success in doing nothing?" });
  }

  try {
    newFixtures.forEach(async (value) => {
      const insertFixtureQuery = await pool.query(
        `
        INSERT INTO fixtures_${season} 
        (
          fixture_id,
          start_time,
          update_time,
          home_id,
          home_name,
          home_score,
          home_xg,
          away_id,
          away_name,
          away_score,
          away_xg,
          events,
          odds
        ) 
        VALUES(
          ${value.id},
          TO_TIMESTAMP(${value.startTime}),
          TO_TIMESTAMP(${value.updateTime}),
          ${value.homeTeam.id},
          '${value.homeTeam.name}',
          ${value.homeScore?.final},
          ${value.xg?.home},
          ${value.awayTeam.id},
          '${value.awayTeam.name}',
          ${value.awayScore?.final},
          ${value.xg?.away},
          '${JSON.stringify(value.events).replaceAll("'", "_")}',
          '${JSON.stringify(value.odds)}'
        )
        `
      );
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error inserting table" });
  }

  try {
    updatedFixtures.forEach(async (value) => {
      const updateFixtureQuery = await pool.query(
        `
        UPDATE fixtures_${season}
        SET start_time = TO_TIMESTAMP(${value.startTime}),
            update_time = TO_TIMESTAMP(${value.updateTime}),
            home_id = ${value.homeTeam.id},
            home_name = '${value.homeTeam.name}',
            home_score = ${value.homeScore?.final},
            home_xg = ${value.xg?.home},
            away_id = ${value.awayTeam.id},
            away_name = '${value.awayTeam.name}',
            away_score = ${value.awayScore?.final},
            away_xg = ${value.xg?.away},
            events = '${JSON.stringify(value.events).replaceAll("'", "_")}',
            odds = '${JSON.stringify(value.odds)}'
        WHERE fixture_id = ${value.id};
        `
      );
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error updating table" });
  }

  res.status(200).json({
    message: `Inserted ${newFixtures.length} fixture(s); Updated ${updatedFixtures.length} fixture(s)`,
  });
}
