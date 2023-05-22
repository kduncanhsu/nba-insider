// import necessary packages and components
import React from 'react';
import { Container, Grid, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import BuildIcon from '@material-ui/icons/Build';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  // create hover effect when user hovers over "paper"
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '200px',
    color: theme.palette.text.secondary,
    '&:hover': {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.02)',
      transition: 'all 0.3s ease',
    },
  },
  title: {
    paddingBottom: theme.spacing(4),
  },
  icon: {
    fontSize: '48px',
    marginBottom: theme.spacing(1),
  },
}));

const HomePage = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant="h2" align="center" className={classes.title}>
        Welcome to NBA Insider!
      </Typography>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} sm={6} md={4}>
        <Link to="/players" style={{ textDecoration: 'none' }}>
            <Paper className={classes.paper}>
              <SportsBasketballIcon className={classes.icon} />
              <Typography variant="h4">Players</Typography>
              <Typography variant="body1">Search for players and learn more about them!</Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/teams" style={{ textDecoration: 'none' }}>
            <Paper className={classes.paper}>
              <SportsBasketballIcon className={classes.icon} />
              <Typography variant="h4">Teams</Typography>
              <Typography variant="body1">Search for teams and learn more about them!</Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/bestROI" style={{ textDecoration: 'none' }}>
            <Paper className={classes.paper}>
              <SportsBasketballIcon className={classes.icon} />
              <Typography variant="h4">Best ROI</Typography>
              <Typography variant="body1">Find out which players have the best return on investment!</Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/worstInvestments" style={{ textDecoration: 'none' }}>
            <Paper className={classes.paper}>
              <SportsBasketballIcon className={classes.icon} />
              <Typography variant="h4">Worst Investments</Typography>
              <Typography variant="body1">Find out which teams have made the worst investments!</Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/head2head" style={{ textDecoration: 'none' }}>
            <Paper className={classes.paper}>
              <SportsBasketballIcon className={classes.icon} />
              <Typography variant="h4">Head2Head</Typography>
              <Typography variant="body1">Compare and contrast your favorite players!</Typography>
            </Paper>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.paper}>
            <BuildIcon className={classes.icon} />
            <Typography variant="h4">In The Works...</Typography>
            <Typography variant="body1">Stay tuned for new pages and exciting updates!</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;