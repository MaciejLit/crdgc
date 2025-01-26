import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { fetchCombinedResults, CombinedResult } from "../api/api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.MuiTableCell-body`]: {
    fontSize: 14,
  },
  "&:last-child, &:first-child, &:nth-child(2)": {
    fontWeight: 600,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Classification: React.FC = () => {
  const [results, setResults] = useState<{ [key: string]: CombinedResult[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCombinedResults();
        setResults(data);
        setSelectedCategory(Object.keys(data)[0] || null);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    } else {
      console.log(event);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box
      sx={{
        minHeight: "80vh",
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          padding: '16px 16px 0 16px ',
          borderRadius: '4px 4px 0 0',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{
          fontFamily: 'Jost, sans-serif', fontWeight: '700'}}>
            Chain Reaction League vol. 3
        </Typography>
        <Typography variant="h6" gutterBottom sx={{
          fontFamily: 'Jost, sans-serif',
          color: 'grey'
          }}>
          Klasyfikacja generalna
          
        </Typography>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          sx={{ marginBottom: 2, alignSelf: 'center'}}
        >
          {results &&
            Object.keys(results).map((category) => (
              <ToggleButton key={category} value={category}>
                {category}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </Box>

      <TableContainer component={Paper} sx={{borderRadius: '0 0 4px 4px'}}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Miejsce</StyledTableCell>
              <StyledTableCell>Gracz</StyledTableCell>
              <StyledTableCell align='center'>#1</StyledTableCell>
              <StyledTableCell align='center'>#2</StyledTableCell>
              <StyledTableCell align='center'>#3</StyledTableCell>
              <StyledTableCell align='center'>#4</StyledTableCell>
              <StyledTableCell align='center'>#5</StyledTableCell>
              <StyledTableCell align='center'>#6</StyledTableCell>
              <StyledTableCell align='center'>Suma</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results &&
              selectedCategory &&
              results[selectedCategory]?.map((player) => (
                <StyledTableRow key={player.name}>
                  <StyledTableCell align='center'>{player.place}</StyledTableCell>
                  <StyledTableCell>{player.name}</StyledTableCell>
                  <StyledTableCell align='center'>{player.points1 ?? "-"}</StyledTableCell>
                  <StyledTableCell align='center'>{player.points2 ?? "-"}</StyledTableCell>
                  <StyledTableCell align='center'>{player.points3 ?? "-"}</StyledTableCell>
                  <StyledTableCell align='center'>{player.points4 ?? "-"}</StyledTableCell>
                  <StyledTableCell align='center'>{player.points5 ?? "-"}</StyledTableCell>
                  <StyledTableCell align='center'>{player.points6 ?? "-"}</StyledTableCell>
                  <StyledTableCell align='center'>{player.totalPoints}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Classification;
