// import neccesary packages and components
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

// import configuration data
const config = require('../config.json');

const useStyles = makeStyles((theme) => ({
  playerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  playerPhoto: {
    width: '200px',
    height: 'auto',
    marginBottom: theme.spacing(2),
  },
  refreshButton: {
    position: 'absolute',
    top: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

const HexagonGraph = ({ player1, player2 }) => {
  const data = [
    { stat: 'Points', player1: player1.points, player2: player2.points },
    { stat: 'Assists', player1: player1.assists, player2: player2.assists },
    { stat: 'Rebounds', player1: player1.rebounds, player2: player2.rebounds },
    { stat: 'Steals', player1: player1.steals, player2: player2.steals },
    { stat: 'Blocks', player1: player1.blocks, player2: player2.blocks },
  ];

  // return hexagon graph which compares the two players statistics
  return (
    <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="stat" />
      <PolarRadiusAxis angle={30}/>
      <Radar name={player1.player_name} dataKey="player1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Radar name={player2.player_name} dataKey="player2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      <Legend wrapperStyle={{ marginBottom: '40px' }} />
    </RadarChart>
  );
};

const Head2Head = () => {
  const { player_id_1, player_id_2 } = useParams();
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const classes = useStyles();
  
  useEffect(() => {

    // fetch player 2 data based on player_id_1
    const fetchPlayer1Data = async () => {
      try {
        const response = await fetch(
          `http://${config.server_host}:${config.server_port}/player_career_stats/${player_id_1}`
        );
        const data = await response.json();
        setPlayer1(data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    // fetch player 2 data based on player_id_2
    const fetchPlayer2Data = async () => {
      try {
        const response = await fetch(
          `http://${config.server_host}:${config.server_port}/player_career_stats/${player_id_2}`
        );
        const data = await response.json();
        setPlayer2(data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlayer1Data();
    fetchPlayer2Data();
  }, [player_id_1, player_id_2]);

  return (
    <Box>
      <IconButton
      className={classes.refreshButton}
      color="primary"
      onClick={() => (window.location.href = '/head2head/')}
      >
      <RefreshIcon />
     </IconButton>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {player1 && (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop={5}>
              <Typography variant="h4" component="h1"> {player1.player_name} </Typography>
              <img
              src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player1.player_id}.png`}
              alt={player1.player_name}
              className={classes.playerPhoto}
              />
              <Typography variant="body1">Points</Typography>
              <Typography variant="body1">{player1.points.toFixed(2)}</Typography>
              <Typography variant="body1">Assists</Typography>
              <Typography variant="body1">{player1.assists.toFixed(2)}</Typography>
              <Typography variant="body1">Rebounds</Typography>
              <Typography variant="body1">{player1.rebounds.toFixed(2)}</Typography>
              <Typography variant="body1">Steals</Typography>
              <Typography variant="body1">{player1.steals.toFixed(2)}</Typography>
              <Typography variant="body1">Blocks</Typography>
              <Typography variant="body1">{player1.blocks.toFixed(2)}</Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {player2 && (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop={5}>
              <Typography variant="h4" component="h1"> {player2.player_name} </Typography>
              <img
              src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player2.player_id}.png`}
              alt={player2.player_name}
              className={classes.playerPhoto}
              />
              <Typography variant="body1">Points</Typography>
              <Typography variant="body1">{player2.points.toFixed(2)}</Typography>
              <Typography variant="body1">Assists</Typography>
              <Typography variant="body1">{player2.assists.toFixed(2)}</Typography>
              <Typography variant="body1">Rebounds</Typography>
              <Typography variant="body1">{player2.rebounds.toFixed(2)}</Typography>
              <Typography variant="body1">Steals</Typography>
              <Typography variant="body1">{player2.steals.toFixed(2)}</Typography>
              <Typography variant="body1">Blocks</Typography>
              <Typography variant="body1">{player2.blocks.toFixed(2)}</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      {player1 && player2 && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" marginTop={-20}>
          <HexagonGraph player1={player1} player2={player2} />
        </Box>
      )}
    </Box>
  );
};

export default Head2Head;

