import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import {
  Collapse,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";

import Link from "../../src/Link";
import { Event, EventType } from "../../types/fixturesApi";
import { FixtureDb } from "../../types/fixturesDb";

interface PlayerDetails {
  name: string;
  xg: number;
  g: number;
  teamId: number;
}

interface PlayerDetailsRow {
  homeName?: string;
  homeXg?: number;
  homeG?: number;
  awayName?: string;
  awayXg?: number;
  awayG?: number;
}

function Balls({ goals }: { goals: number | undefined }) {
  if (goals == undefined) {
    return <></>;
  }

  const result: EmotionJSX.Element[] = [];

  for (let index = 0; index < goals; index++) {
    result.push(
      <SportsSoccerIcon color="info" sx={{ fontSize: "0.8rem" }} key={index} />
    );
  }

  return <>{result}</>;
}

function FixtureRow({ fixture }: { fixture: FixtureDb }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playerDetailRows, setPlayerDetailRows] = useState<
    PlayerDetailsRow[] | undefined
  >(undefined);

  const savePlayerDetails = (
    details: { [key: string]: PlayerDetails },
    event: Event
  ) => {
    if (event.xg === null || event.xg === 0) {
      return;
    }

    if (event.author.id in details) {
      details[event.author.id]["xg"] += event.xg;
      details[event.author.id]["xg"] = Number(
        details[event.author.id]["xg"].toFixed(3)
      );

      if (
        event.type === EventType.Goal ||
        event.type === EventType.PenaltyGoal
      ) {
        details[event.author.id]["g"]++;
      }
    } else {
      details[event.author.id] = {
        name: event.author.name,
        xg: event.xg,
        g:
          event.type === EventType.Goal || event.type === EventType.PenaltyGoal
            ? 1
            : 0,
        teamId: event.teamId,
      };
    }
  };

  const generateRows = (
    homeDetails: { [key: string]: PlayerDetails },
    awayDetails: { [key: string]: PlayerDetails }
  ) => {
    const homeDetailsArray = Object.values(homeDetails).sort(
      (a, b) => b.xg - a.xg
    );
    const awayDetailsArray = Object.values(awayDetails).sort(
      (a, b) => b.xg - a.xg
    );

    const maxLength: number =
      homeDetailsArray.length > awayDetailsArray.length
        ? homeDetailsArray.length
        : awayDetailsArray.length;
    const detailsRows: PlayerDetailsRow[] = Array(maxLength)
      .fill(undefined)
      .map(Object); // To ensure separate objects are created

    for (let index = 0; index < maxLength; index++) {
      if (index < homeDetailsArray.length) {
        detailsRows[index].homeName = homeDetailsArray[index].name;
        detailsRows[index].homeXg = homeDetailsArray[index].xg;
        detailsRows[index].homeG = homeDetailsArray[index].g;
      }

      if (index < awayDetailsArray.length) {
        detailsRows[index].awayName = awayDetailsArray[index].name;
        detailsRows[index].awayXg = awayDetailsArray[index].xg;
        detailsRows[index].awayG = awayDetailsArray[index].g;
      }
    }

    return detailsRows;
  };

  const onClickScore = async () => {
    if (!open && playerDetailRows === undefined) {
      setIsLoading(true);

      const response = await fetch(
        `/api/football/team/events?fixture_id=${fixture.fixture_id}`
      );
      const events: Event[] = await response.json();

      const homeDetails: { [key: string]: PlayerDetails } = {};
      const awayDetails: { [key: string]: PlayerDetails } = {};

      events.forEach((event) => {
        if (event.teamId === fixture.home_id) {
          savePlayerDetails(homeDetails, event);
        } else {
          savePlayerDetails(awayDetails, event);
        }
      });

      setPlayerDetailRows(generateRows(homeDetails, awayDetails));
    }

    setIsLoading(false);
    setOpen(!open);
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="right">
          <Link
            color="inherit"
            href={`/football/team/${fixture.home_name.toLowerCase()}`}
          >
            {fixture.home_name}
          </Link>
        </TableCell>
        <TableCell
          align="center"
          onClick={onClickScore}
          sx={{
            "&:hover": { cursor: "pointer" },
            boxShadow:
              "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
          }}
        >
          <Table
            size="small"
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
                p: 0,
              },
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  {fixture.home_score} - {fixture.away_score}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">
                  {fixture.home_xg}
                  <small>xG</small> - {fixture.away_xg}
                  <small>xG</small>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <LinearProgress
            sx={{
              display: isLoading ? "block" : "none",
            }}
          />
        </TableCell>
        <TableCell align="left">
          <Link
            color="inherit"
            href={`/football/team/${fixture.away_name.toLowerCase()}`}
          >
            {fixture.away_name}
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TableContainer
              component={Paper}
              sx={{
                width: "max-content",
              }}
            >
              <Table
                size="small"
                aria-label="Player's xG"
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    fontSize: "90%",
                    paddingY: 0,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="right" sx={{ width: 200 }}>
                      Name
                    </TableCell>
                    <TableCell align="center" sx={{ width: 75 }}>
                      xG
                    </TableCell>
                    <TableCell align="center" sx={{ width: 75 }}>
                      xG
                    </TableCell>
                    <TableCell align="left" sx={{ width: 200 }}>
                      Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playerDetailRows?.map((value, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="right">
                          <Balls goals={value.homeG} /> {value.homeName}
                        </TableCell>
                        <TableCell align="center">{value.homeXg}</TableCell>
                        <TableCell align="center">{value.awayXg}</TableCell>
                        <TableCell align="left">
                          {value.awayName} <Balls goals={value.awayG} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function FixtureTable({ fixtures }: { fixtures: FixtureDb[] }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "max-content",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right" sx={{ width: 200 }}>
              Home
            </TableCell>
            <TableCell align="center" sx={{ width: 150 }}></TableCell>
            <TableCell align="left" sx={{ width: 200 }}>
              Away
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fixtures.map((fixture) => (
            <FixtureRow fixture={fixture} key={fixture.fixture_id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FixtureTable;
