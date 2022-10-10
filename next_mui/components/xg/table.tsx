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
import { ResultDb } from "../../types/fixture_db";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

function FixtureRow({ fixture }: { fixture: ResultDb }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={fixture.fixture_id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
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
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={Math.random()}>
                    <TableCell component="th" scope="row">
                      asfdasdf
                    </TableCell>
                    <TableCell>asfdasfd</TableCell>
                    <TableCell align="right">asdfsadf</TableCell>
                    <TableCell align="right">sadfsdf</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function FixtureTable({ fixtures }: { fixtures: ResultDb[] }) {
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
            <FixtureRow fixture={fixture} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FixtureTable;
