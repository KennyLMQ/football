import { pool } from "../../../../database/db";
import { Fixtures, Status } from "../../../../types/fixturesApi";

export default async function handler(req: any, res: any) {
  if (req.headers["api-secret"] !== process.env.API_SECRET) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const season = 12310;

  try {
    const createTable = await pool.query(
      `
        CREATE TABLE IF NOT EXISTS fixtures_${season} (
          fixture_id INT UNIQUE NOT NULL,
          start_time TIMESTAMP NOT NULL,
          home_id INT NOT NULL,
          home_name CHAR(64) NOT NULL,
          home_score INT NOT NULL,
          home_xg NUMERIC NOT NULL,
          away_id INT NOT NULL,
          away_name CHAR(64) NOT NULL,
          away_score INT NOT NULL,
          away_xg NUMERIC NOT NULL,
          events JSON NOT NULL,
          odds JSON NOT NULL
        );
      `
    );
    // console.debug(createTable);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error creating table" });
  }

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

  let fixture_id_list: number[] = [];
  try {
    const fixture_id = await pool.query(
      `SELECT fixture_id FROM fixtures_${season}`
    );

    fixture_id_list = fixture_id.rows.map((value) => value.fixture_id);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error retrieving data" });
  }

  const filteredResult = posts.result.filter(
    (value) =>
      value.status === Status.Finished &&
      !fixture_id_list.find((id) => id === value.id)
  );

  if (filteredResult.length === 0) {
    return res
      .status(200)
      .json({ message: "Is there success in doing nothing?" });
  }

  try {
    filteredResult.forEach(async (value) => {
      const newFixture = await pool.query(
        `
        INSERT INTO fixtures_${season} 
        (
          fixture_id,
          start_time,
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
          ${value.homeTeam.id},
          '${value.homeTeam.name.trim()}',
          ${value.homeScore?.final},
          ${value.xg?.home},
          ${value.awayTeam.id},
          '${value.awayTeam.name.trim()}',
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

  res
    .status(200)
    .json({ message: `Inserted ${filteredResult.length} fixture(s)` });
}
