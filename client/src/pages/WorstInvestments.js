import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

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
  },
  teamCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
}));

// define WorstInvestments component
const WorstInvestments = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const fetchWorstInvestments = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/worst_investments`);
        const data = await response.json();
        setTeams(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWorstInvestments();
  }, []);

  // render WorstInvestments component
  return (
    <div className={classes.container}>
      <Typography variant="h4" component="h1">
        Worst Investments
      </Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2} className={classes.gridContainer}>
          {teams.map((team, index) => (
            <Grid item xs={12} sm={6} md={4} key={team.team_id}>
              <Card className={classes.teamCard}>
                <CardContent>
                  <Typography variant="subtitle1">Rank: {index + 1}</Typography>
                  <img
                    src={`https://cdn.nba.com/logos/nba/${team.team_id}/global/L/logo.svg`}
                    alt={team.team_name}
                    className={classes.teamLogo}
                  />
                  <Typography variant="subtitle1">{team.team_name}</Typography>
                  <Typography variant="body2">Average Performance-to-Salary Ratio: {team.avg_performance_to_salary}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default WorstInvestments;