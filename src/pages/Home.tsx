import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import crdgcLogo from '../assets/crdgcLogo.png';

const GlassCard = styled(Box)(({ theme }) => ({
  background: 'rgba(222, 240, 239, 0.25)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(193, 216, 207, 0.4)',
  boxShadow: '0 8px 32px 0 rgba(15, 61, 64, 0.3)',
  padding: theme.spacing(4),
  textAlign: 'center',
  maxWidth: 600,
  marginBottom: theme.spacing(5),
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px 0 rgba(15, 61, 64, 0.4)',
    background: 'rgba(222, 240, 239, 0.35)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const ModernButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #def0ef 0%, #c1d8cf 50%, #95b9b8 100%)',
  color: '#0f3d40',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(15, 61, 64, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #fefefe 0%, #def0ef 50%, #c1d8cf 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(15, 61, 64, 0.3)',
    color: '#092123',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/classification");
  };

  const handleDiscordClick = () => {
    window.open("https://discord.gg/93CDnK8T3A", "_blank", "noopener,noreferrer");
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: 0,
        pb: '16px',
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: 'calc(100vh - 300px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        sx={{height: 125, marginTop: 6, marginBottom: 6}}
        src={crdgcLogo}
        alt="CRDGC Logo"
        className="mx-auto"
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <GlassCard
          sx={{
            animation: 'fadeInUp 0.6s ease-out',
            '@keyframes fadeInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              background: '#215356',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Klasyfikacja generalna
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            sx={{
              color: '#0f3d40',
              mb: 1,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              maxWidth: '90%',
              mx: 'auto',
              fontWeight: 500,
            }}
          >
            Kliknij poniżej, aby zobaczyć wyniki aktualnej klasyfikacji Chain Reaction League
          </Typography>
          <ModernButton onClick={handleClick}>
            Zobacz wyniki
          </ModernButton>
        </GlassCard>

        <GlassCard
          sx={{
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              background: '#215356',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Chain Reaction Disc Golf Club
          </Typography>
          <Typography 
            variant="body1" 
            gutterBottom
            sx={{
              color: '#0f3d40',
              mb: 1,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              maxWidth: '90%',
              mx: 'auto',
              fontWeight: 500,
            }}
          >
            Kliknij poniżej, aby dowiedzieć się więcej o klubie i jak do nas dołączyć!
          </Typography>
          <ModernButton onClick={handleDiscordClick}>
            Dołącz do CRDGC
          </ModernButton>
        </GlassCard>
      </Box>
    </Container>
  );
};

export default Home;
