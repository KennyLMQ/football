import { getFixtures } from "../../../api/xrapid";
import {
  getIdsAndUpdateTime,
  insertFixture,
  updateFixture,
} from "../../../database/fixtures";
import { Fixtures, Status } from "../../../types/fixturesApi";

export default async function handler(req: any, res: any) {
  if (req.headers["api-secret"] !== process.env.API_SECRET) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const season = 12310;

  console.time("new");
  let fixtures: Fixtures;
  let fixturesLastUpdateTime: { [key: string]: number } = {};
  try {
    const [r1, r2] = await Promise.all([
      getFixtures(season),
      getIdsAndUpdateTime(season),
    ]);

    fixtures = r1;
    r2.rows.forEach((value) => {
      fixturesLastUpdateTime[value.fixture_id] = value.update_time;
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error retrieving data" });
  }
  console.timeEnd("new");

  const newFixtures = fixtures.result.filter(
    (value) =>
      value.status === Status.Finished && !(value.id in fixturesLastUpdateTime)
  );
  console.debug("newFixtures", newFixtures);

  const updatedFixtures = fixtures.result.filter(
    (value) =>
      value.status === Status.Finished &&
      value.id in fixturesLastUpdateTime &&
      fixturesLastUpdateTime[value.id] < value.updateTime
  );
  console.debug("updatedFixtures", updatedFixtures);

  if (newFixtures.length === 0 && updatedFixtures.length === 0) {
    return res
      .status(200)
      .json({ message: "Is there success in doing nothing?" });
  }

  try {
    newFixtures.forEach(async (value) => {
      await insertFixture(season, value);
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error inserting table" });
  }

  try {
    updatedFixtures.forEach(async (value) => {
      await updateFixture(season, value);
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ message: "Error updating table" });
  }

  res.status(200).json({
    message: `Inserted ${newFixtures.length} fixture(s); Updated ${updatedFixtures.length} fixture(s)`,
  });
}
