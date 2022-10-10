export interface ResultDb {
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

export interface Detail {
  id: number;
  name: string;
}

export interface Event {
  homeScore: number;
  awayScore: number;
  minute: number;
  author: Detail;
  teamId: number;
  type: EventType;
  xg: number | null;
  additionalMinute?: number;
}

export enum EventType {
  Block = "block",
  Goal = "goal",
  Miss = "miss",
  OwnGoal = "own-goal",
  PenaltyGoal = "penalty-goal",
  PenaltyMiss = "penalty-miss",
  RedCard = "red-card",
  Save = "save",
}

export interface Odd {
  type: OddType;
  open: number;
  last: number;
}

export enum OddType {
  Away = "away",
  Draw = "draw",
  Home = "home",
  TotalOver25 = "totalOver25",
  TotalUnder25 = "totalUnder25",
}
