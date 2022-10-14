import { Odd } from "./fixturesApi";

export interface FixtureDb {
  fixture_id: number;
  start_time: number;
  home_id: number;
  home_name: string;
  home_score: number;
  home_xg: number;
  away_id: number;
  away_name: string;
  away_score: number;
  away_xg: number;
  events: Event[];
  odds: Odd[];
}
