import { pool } from "../../../../database/db";
import { Event } from "../../../../types/fixturesApi";

export default async function handler(req: any, res: any) {
  const season = 12310;
  const { fixture_id } = req.query;

  console.log(fixture_id)

  let events: { events: Event[] } = { events: [] };

  try {
    const eventsQuery = await pool.query(
      `SELECT events FROM fixtures_${season} where fixture_id=${fixture_id}`
    );

    if (eventsQuery.rowCount === 0) {
      res.status(400).json({ message: "Bad request" });
    }

    events = eventsQuery.rows[0];
  } catch (err: any) {
    console.error(err.stack);
    res.status(500).json({ message: "Error retrieving data" });
  }

  res.status(200).json(events.events);
}
