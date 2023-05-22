// import necessary packages and components
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

// import configuration data
const config = require('../config.json');

const useStyles = makeStyles((theme) => ({
  teamCard: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  teamLogo: {
    width: '80px',
    height: 'auto',
    marginRight: theme.spacing(2),
  },
  gridContainer: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
}));

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/teams`);
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className={classes.container}>
      <br />
      <Typography variant="h4" component="h1">
        NBA Teams
      </Typography>
      <br />
      <Grid container spacing={3} className={classes.gridContainer}>
        {teams.length > 0 ? (
          teams.map((team) => (
            <Grid item xs={12} sm={6} md={4} key={team.team_id}>
              <Card className={classes.teamCard}>
                <Link
                  to={`/team/${team.team_id}/${encodeURIComponent(team.team_name)}`}
                  key={team.team_id}
                  className={classes.teamCard}
                >
                  <img
                    src={`https://cdn.nba.com/logos/nba/${team.team_id}/global/L/logo.svg`}
                    alt={team.team_name}
                    className={classes.teamLogo}
                  />
                </Link>
                <Link
                  to={`/team/${team.team_id}/${encodeURIComponent(team.team_name)}`}
                  key={team.team_id}
                  className={classes.teamCard}
                >
                  <CardContent>
                    <Typography variant="h6">{team.team_name}</Typography>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>Loading teams...</Typography>
        )}
      </Grid>
    </div>
  );
};

export default TeamsPage;