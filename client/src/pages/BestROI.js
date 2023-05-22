import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const config = require('../config.json');

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  gridContainer: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  playerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    textDecoration: 'none',
  },
  playerPhoto: {
    width: '200px',
    height: 'auto',
    marginBottom: theme.spacing(1),
  },
}));

const BestROI = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const fetchBestROI = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/best_ROI`);
        const data = await response.json();
        setPlayers(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBestROI();
  }, []);

  return (
    <div className={classes.container}>
      <Typography variant="h4" component="h1">
        Best ROI Players
      </Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2} className={classes.gridContainer}>
          {players.map((player) => (
            <Grid item xs={12} sm={6} md={4} key={player.player_id}>
                <Card>
                <Link to={`/player/${player.player_id}`} className={classes.playerCard}>
                  <img
                    src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.player_id}.png`}
                    alt={player.player_name}
                    className={classes.playerPhoto}
                  />
                </Link>
                  <CardContent>
                    <Typography variant="subtitle1">{player.player_name}</Typography>
                    <Typography variant="body2">Season: {player.season}</Typography>
                    <Typography variant="body2">Salary: ${player.salary}</Typography>
                  </CardContent>
                </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default BestROI;