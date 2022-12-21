import { Fixture } from "../types/fixturesApi";
import { pool } from "./db";

export async function getTeams(season: Number) {
  return await pool.query(
    `
        SELECT DISTINCT home_id AS team_id,
                        home_name AS team_name
        FROM fixtures_${season}
        UNION
        SELECT DISTINCT away_id AS team_id,
                        away_name AS team_name
        FROM fixtures_${season};
    `
  );
}

export async function getIdsAndUpdateTime(season: Number) {
  return await pool.query(
    `SELECT fixture_id, 
            TRUNC(EXTRACT(EPOCH FROM update_time)) AS update_time
     FROM fixtures_${season}`
  );
}

export async function insertFixture(season: Number, fixture: Fixture) {
  return await pool.query(
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
      $1,
      TO_TIMESTAMP($2),
      TO_TIMESTAMP($3),
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13
    )
    `,
    [
      fixture.id,
      fixture.startTime,
      fixture.updateTime,
      fixture.homeTeam.id,
      fixture.homeTeam.name,
      fixture.homeScore?.final,
      fixture.xg?.home,
      fixture.awayTeam.id,
      fixture.awayTeam.name,
      fixture.awayScore?.final,
      fixture.xg?.away,
      JSON.stringify(fixture.events).replaceAll("'", "_"),
      JSON.stringify(fixture.odds),
    ]
  );
}

export async function updateFixture(season: Number, fixture: Fixture) {
  return await pool.query(
    `
    UPDATE fixtures_${season}
    SET start_time = TO_TIMESTAMP($1),
        update_time = TO_TIMESTAMP($2),
        home_id = $3,
        home_name = $4,
        home_score = $5,
        home_xg = $6,
        away_id = $7,
        away_name = $8,
        away_score = $9,
        away_xg = $10,
        events = $11,
        odds = $12
    WHERE fixture_id = $13;
    `,
    [
      fixture.startTime,
      fixture.updateTime,
      fixture.homeTeam.id,
      fixture.homeTeam.name,
      fixture.homeScore?.final,
      fixture.xg?.home,
      fixture.awayTeam.id,
      fixture.awayTeam.name,
      fixture.awayScore?.final,
      fixture.xg?.away,
      JSON.stringify(fixture.events).replaceAll("'", "_"),
      JSON.stringify(fixture.odds),
      fixture.id,
    ]
  );
}
