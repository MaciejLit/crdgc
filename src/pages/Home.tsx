import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/classification");
  };

  return (
    <Box
      sx={{

      }}
    >
    <Box
      sx={{
        padding: 4,
        borderRadius: 4,
        marginBottom: 6,
        boxShadow: "0px 0px 50px 0px rgba(66, 68, 90, 1)",
        maxWidth: 700,
        textAlign: "center",
        backgroundColor: 'rgba(171, 181, 180)'
      }}
    >
      <Typography variant="h5" gutterBottom>
        Klasyfikacja generalna
      </Typography>
      <Typography variant="body2" gutterBottom>
        Kliknij poniżej, aby zobaczyć wyniki aktualnej klasyfikacji Chain Reaction League vol. 3
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClick}
        sx={{
          marginTop: 2,
          backgroundColor: "white",
          color: "rgb(13,44,42)",
          "&:hover": {
            backgroundColor: "#e3f2fd",
          },
        }}
      >
        Zobacz wyniki
      </Button>
    </Box>

        <Box
        sx={{
          padding: 4,
          borderRadius: 4,
          boxShadow: "0px 0px 50px 0px rgba(66, 68, 90, 1)",
          maxWidth: 700,
          textAlign: "center",
          backgroundColor: 'rgba(171, 181, 180)'
        }}
      >
          <Typography variant="h5" gutterBottom>
            Chain Reaction Disc Golf Club
          </Typography>
          <Typography variant="body2" gutterBottom>
            Kliknij poniżej, aby dowiedzieć się więcej o klubie i jak do nas dołączyć!
          </Typography>
          <Button
          disabled
            variant="contained"
            color="secondary"
            onClick={handleClick}
            sx={{
              marginTop: 2,
              backgroundColor: "white",
              color: "rgb(13,44,42)",
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            Dołącz do CRDGC
          </Button>
        </Box>
    </Box>
  );
};

export default Home;
