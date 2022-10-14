import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
  IconButton,
  Box,
  Collapse,
  Typography,
} from "@mui/material";
import Link from "../../src/Link";
import { FixtureDb } from "../../types/fixturesDb";
import { Event, EventType } from "../../types/fixturesApi";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

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

function FixtureRow({ fixture }: { fixture: FixtureDb }) {
  const [open, setOpen] = useState(false);
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

      if (event.type === EventType.Goal) {
        details[event.author.id]["g"]++;
      }
    } else {
      details[event.author.id] = {
        name: event.author.name,
        xg: event.xg,
        g: event.type === EventType.Goal ? 1 : 0,
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

  const onClickOpen = async () => {
    if (!open && playerDetailRows === undefined) {
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

    setOpen(!open);
  };

  return (
    <>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={onClickOpen}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <Link
            color="inherit"
            href={`/football/team/${fixture.home_name.toLowerCase()}`}
          >
            {fixture.home_name}
          </Link>
        </TableCell>
        <TableCell align="center">
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Player's xG
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>xG</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>xG</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* <TableRow>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow> */}
                  {playerDetailRows?.map((value, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{value.homeName}</TableCell>
                        <TableCell>{value.homeXg}</TableCell>
                        <TableCell>{value.awayName}</TableCell>
                        <TableCell>{value.awayXg}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function FixtureTable({ fixtures }: { fixtures: FixtureDb[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Home</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="left">Away</TableCell>
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
