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
  CircularProgress,
  Alert,
  Container,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { fetchCombinedResults, CombinedResult } from "../api/api";
import chainLeague from '../assets/chain-LEAGUE.png';
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: '#31666a',
    color: '#fefefe',
    fontWeight: 700,
    fontSize: '0.875rem',
    letterSpacing: '0.5px',
    padding: theme.spacing(2),
    borderBottom: '2px solid rgba(149, 185, 184, 0.3)',
  },
  [`&.MuiTableCell-body`]: {
    fontSize: '0.9rem',
    padding: theme.spacing(1.5, 2),
    borderBottom: '1px solid rgba(193, 216, 207, 0.3)',
    color: '#0f3d40',
  },
  "&:last-child, &:first-child, &:nth-child(2)": {
    fontWeight: 600,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  transition: 'all 0.2s ease-in-out',
  "&:nth-of-type(odd)": {
    backgroundColor: 'rgba(222, 240, 239, 0.3)',
  },
  "&:hover": {
    backgroundColor: 'rgba(193, 216, 207, 0.5)',
    transform: 'scale(1.01)',
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const GlassCard = styled(Paper)(() => ({
  background: 'rgba(254, 254, 254, 0.98)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px 0 rgba(15, 61, 64, 0.2)',
  overflow: 'hidden',
}));

const ModernToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1, 2.5),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  border: '2px solid rgba(193, 216, 207, 0.5)',
  color: '#31666a',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.Mui-selected': {
    background: 'linear-gradient(135deg, #4d8686 0%, #31666a 50%, #215356 100%)',
    color: '#fefefe',
    border: '2px solid transparent',
    boxShadow: '0 4px 12px rgba(33, 83, 86, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #31666a 0%, #215356 50%, #0f3d40 100%)',
    },
  },
  '&:hover': {
    border: '2px solid rgba(77, 134, 134, 0.7)',
    borderLeft: '2px solid rgba(77, 134, 134, 0.7)',
    transform: 'translateY(-2px)',
    backgroundColor: 'rgba(222, 240, 239, 0.3)',
  },
}));

const Classification: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<{ [key: string]: CombinedResult[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('vol4');

  // Get indices of the 4 highest rounds (returns array of round numbers: 1-7)
  // For every player, returns the best 4 rounds (or all rounds if 4 or fewer)
  const getTopFourRoundIndices = (player: CombinedResult): number[] => {
    const rounds = [
      { value: player.points1, index: 1 },
      { value: player.points2, index: 2 },
      { value: player.points3, index: 3 },
      { value: player.points4, index: 4 },
      { value: player.points5, index: 5 },
      { value: player.points6, index: 6 },
      ...(selectedSeason === 'vol4' && player.points7 !== undefined 
        ? [{ value: player.points7, index: 7 }] 
        : []),
    ].filter((round): round is { value: number; index: number } => 
      round.value !== null && round.value !== undefined
    );

    if (rounds.length === 0) return [];

    // Sort by value descending and take top 4 (or all if 4 or fewer)
    const sortedRounds = [...rounds].sort((a, b) => b.value - a.value);
    const roundsToTake = Math.min(4, sortedRounds.length);
    return sortedRounds.slice(0, roundsToTake).map(round => round.index);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCombinedResults(selectedSeason);
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
  }, [selectedSeason]);

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

  const handleSeasonChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSeason: string | null
  ) => {
    if (newSeason !== null) {
      setSelectedSeason(newSeason);
    }
  };

  const getSeasonDisplayName = (season: string): string => {
    const seasonNumber = season.replace('vol', '');
    return `vol. ${seasonNumber}`;
  };

  const getPlaceBackgroundColor = (place: number): string | undefined => {
    if (place === 1) return 'rgba(255, 215, 0, 0.5)'; // Gold
    if (place === 2) return 'rgba(192, 192, 192, 0.5)'; // Silver
    if (place === 3) return 'rgba(205, 127, 50, 0.5)'; // Bronze
    return undefined;
  };

  // Adjust player order for vol. 3 playoff results
  // Mateusz Nitka won the playoff and should be 2nd, Filip Górski should be 3rd
  const adjustVol3Results = (categoryResults: CombinedResult[]): CombinedResult[] => {
    if (selectedSeason !== 'vol3') return categoryResults;

    const mateusz = categoryResults.find(p => p.name === 'Mateusz Nitka');
    const filip = categoryResults.find(p => p.name === 'Filip Górski');
    
    if (!mateusz || !filip) return categoryResults;

    // Get players who need to be moved down (were in 2nd or 3rd but aren't Mateusz or Filip)
    const playersToMoveDown = categoryResults.filter(
      p => (p.place === 2 || p.place === 3) && p.name !== 'Mateusz Nitka' && p.name !== 'Filip Górski'
    );

    // Sort players to move down by their original place
    const sortedToMoveDown = [...playersToMoveDown].sort((a, b) => a.place - b.place);
    
    // Assign new places starting from 4
    const placeMapping = new Map<string, number>();
    let nextPlace = 4;
    sortedToMoveDown.forEach(player => {
      placeMapping.set(player.name, nextPlace);
      nextPlace++;
    });
    
    const adjusted = categoryResults.map(player => {
      if (player.name === 'Mateusz Nitka') {
        return { ...player, place: 2 };
      }
      if (player.name === 'Filip Górski') {
        return { ...player, place: 3 };
      }
      // Apply new place if player needs to be moved down
      const newPlace = placeMapping.get(player.name);
      if (newPlace !== undefined) {
        return { ...player, place: newPlace };
      }
      return player;
    });

    // Sort by place to ensure correct order
    return adjusted.sort((a, b) => a.place - b.place);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: '32px', pb: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2, color: '#215356' }} />
          <Typography variant="h6" sx={{ color: '#215356', fontWeight: 500 }}>Ładowanie danych...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: '32px', pb: '32px' }}>
        <Alert severity="error" sx={{ borderRadius: '16px', fontSize: '1rem' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: '32px', pb: '32px', px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              aria-label="Powrot do strony glownej"
              sx={{
                minWidth: 44,
                width: 44,
                height: 44,
                padding: 0,
                borderRadius: '999px',
                backgroundColor: '#31666a',
                color: '#fefefe',
                boxShadow: '0 6px 16px rgba(15, 61, 64, 0.3)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#215356',
                  boxShadow: '0 8px 20px rgba(15, 61, 64, 0.4)',
                },
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{ width: 24, height: 24, display: 'block' }}
                aria-hidden="true"
              >
                <path
                  d="M10.828 12l4.95-4.95a1 1 0 10-1.414-1.414l-5.657 5.657a1 1 0 000 1.414l5.657 5.657a1 1 0 001.414-1.414L10.828 12z"
                  fill="currentColor"
                />
              </Box>
            </Button>
          </Box>
      <Box
        component="img"
        sx={{height: 250}}
        src={chainLeague}
        alt="CRDGC Logo"
        className="mx-auto"
      />
      <GlassCard sx={{ mb: 4, p: { xs: 3, sm: 4, md: 5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            minWidth: '750px',
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{
              fontFamily: 'Jost, sans-serif',
              fontWeight: 700,
              background: '#215356',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
            }}
          >
            Chain Reaction League {getSeasonDisplayName(selectedSeason)}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', alignItems: 'center' }}>
            <ToggleButtonGroup
              value={selectedSeason}
              exclusive
              onChange={handleSeasonChange}
              sx={{ 
                mb: 1,
                gap: 0,
                '& .MuiToggleButton-root': {
                  margin: 0,
                },
              }}
            >
              <ModernToggleButton value="vol3">Vol. 3</ModernToggleButton>
              <ModernToggleButton value="vol4">Vol. 4</ModernToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={selectedCategory}
              exclusive
              onChange={handleCategoryChange}
              sx={{
                flexWrap: 'wrap',
                gap: 0,
                justifyContent: 'center',
                '& .MuiToggleButton-root': {
                  margin: 0,
                },
              }}
            >
              {results &&
                Object.keys(results).map((category) => (
                  <ModernToggleButton key={category} value={category}>
                    {category}
                  </ModernToggleButton>
                ))}
            </ToggleButtonGroup>
          </Box>
        </Box>
      </GlassCard>

      <GlassCard>
        <TableContainer sx={{ borderRadius: '24px', overflow: 'hidden' }}>
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
              {selectedSeason === 'vol4' && (
                <StyledTableCell align='center'>#7</StyledTableCell>
              )}
              <StyledTableCell align='center'>Suma</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results &&
              selectedCategory &&
              adjustVol3Results(results[selectedCategory] || []).map((player) => {
                const topFourIndices = getTopFourRoundIndices(player);
                const isTopFour = (roundNum: number) => topFourIndices.includes(roundNum);
                const placeBgColor = getPlaceBackgroundColor(player.place);
                
                return (
                  <StyledTableRow 
                    key={player.name}
                    sx={{
                      ...(placeBgColor && {
                        backgroundColor: placeBgColor,
                        '&:nth-of-type(odd)': {
                          backgroundColor: placeBgColor,
                        },
                      }),
                    }}
                  >
                    <StyledTableCell align='center'>{player.place}</StyledTableCell>
                    <StyledTableCell>{player.name}</StyledTableCell>
                    <StyledTableCell 
                      align='center'
                      sx={{ fontWeight: isTopFour(1) ? 600 : 'normal' }}
                    >
                      {player.points1 ?? "-"}
                    </StyledTableCell>
                    <StyledTableCell 
                      align='center'
                      sx={{ fontWeight: isTopFour(2) ? 600 : 'normal' }}
                    >
                      {player.points2 ?? "-"}
                    </StyledTableCell>
                    <StyledTableCell 
                      align='center'
                      sx={{ fontWeight: isTopFour(3) ? 600 : 'normal' }}
                    >
                      {player.points3 ?? "-"}
                    </StyledTableCell>
                    <StyledTableCell 
                      align='center'
                      sx={{ fontWeight: isTopFour(4) ? 600 : 'normal' }}
                    >
                      {player.points4 ?? "-"}
                    </StyledTableCell>
                    <StyledTableCell 
                      align='center'
                      sx={{ fontWeight: isTopFour(5) ? 600 : 'normal' }}
                    >
                      {player.points5 ?? "-"}
                    </StyledTableCell>
                    <StyledTableCell 
                      align='center'
                      sx={{ fontWeight: isTopFour(6) ? 600 : 'normal' }}
                    >
                      {player.points6 ?? "-"}
                    </StyledTableCell>
                    {selectedSeason === 'vol4' && (
                      <StyledTableCell 
                        align='center'
                        sx={{ fontWeight: isTopFour(7) ? 600 : 'normal' }}
                      >
                        {player.points7 ?? "-"}
                      </StyledTableCell>
                    )}
                    <StyledTableCell align='center'>{player.totalPoints}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      </GlassCard>
    </Container>
  );
};

export default Classification;
