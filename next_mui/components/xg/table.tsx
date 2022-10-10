import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
} from "@mui/material";
import Link from "../../src/Link";
import { ResultDb } from "../../types/fixture_db";

type Props = {
  fixture: ResultDb[];
};

export function XgTable({ fixture }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Home</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="left">Away</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fixture.map((match) => (
            <TableRow
              key={match.fixture_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">
                <Link
                  color="inherit"
                  href={`/football/team/${match.home_name.toLowerCase()}`}
                >
                  {match.home_name}
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
                        {match.home_score} - {match.away_score}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">
                        {match.home_xg}
                        <small>xG</small> - {match.away_xg}
                        <small>xG</small>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>
              <TableCell align="left">
                <Link
                  color="inherit"
                  href={`/football/team/${match.away_name.toLowerCase()}`}
                >
                  {match.away_name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default XgTable;
