import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';


const config = require('../config.json');

const useStyles = makeStyles((theme) => ({
  teamContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  teamLogo: {
    width: '200px',
    height: 'auto',
    marginBottom: theme.spacing(2),
  },
  seasonSelector: {
    margin: theme.spacing(2, 0),
  },
  teamStatsContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  teamStatItem: {
    margin: theme.spacing(1),
  },
  playersContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  playerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  playerPhoto: {
    width: '200px',
    height: 'auto',
    marginBottom: theme.spacing(1),
  },
  gridContainer: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  refreshButton: {
    position: 'absolute',
    top: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

const TeamDetail = () => {
  const { team_id, team_name } = useParams();
  const [selectedSeason, setSelectedSeason] = useState('');
  const [season, setSeason] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teamRecord, setTeamRecord] = useState(null);
  const classes = useStyles();

  // fetch team statistics route using the team_id and selectedSeason (which the user will select)
  useEffect(() => {
    const fetchTeamSeasonStats = async () => {
      if (selectedSeason) {
        try {
          const response = await fetch(
            `http://${config.server_host}:${config.server_port}/team_season_stats/${team_id}/${selectedSeason}`
          );
          const data = await response.json();
          setSeason(data[0]);
        } catch (error) {
          console.log(error);
        }
      } else {
        setSeason(null);
      }
    };

    const fetchTeamRecord = async () => {
      if (selectedSeason) {
        try {
          const response = await fetch(
            `http://${config.server_host}:${config.server_port}/team_season_record/${team_id}/${selectedSeason}`
          );
          const data = await response.json();
          setTeamRecord(data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setSeason(null);
      }
    };

    const fetchPlayersOnTeam = async () => {
      if (selectedSeason) {
        try {
          const response = await fetch(
            `http://${config.server_host}:${config.server_port}/players_on_team/${team_id}/${selectedSeason}`
          );
          const data = await response.json();
          setPlayers(data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setSeason(null);
      }
    };

    fetchTeamSeasonStats();
    fetchPlayersOnTeam();
    fetchTeamRecord();
  }, [team_id, selectedSeason]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  return (
    <div className={classes.teamContainer}>
      <IconButton
        className={classes.refreshButton}
        color="primary"
        onClick={() => (window.location.href = '/teams/')}
        >
        <RefreshIcon />
      </IconButton>
      <Typography variant="h4" component="h1">
        {team_name}
      </Typography>
      <img
        src={`https://cdn.nba.com/logos/nba/${team_id}/global/L/logo.svg`}
        alt={team_name}
        className={classes.teamLogo}
      />

      <Typography variant="h6">Select a Season:</Typography>
      <select
        className={classes.seasonSelector}
        value={selectedSeason}
        onChange={handleSeasonChange}
      >
        <option value="">-- Select a Season --</option>
        {/* Generate options for seasons from 2003 to 2022 */}
        {Array.from({ length: 2022 - 2003 + 1 }, (_, index) => {
          const season = 2003 + index;
          return (
            <option key={season} value={season}>
              {season}
            </option>
          );
        })}
      </select>

      {season ? (
        <>
          {teamRecord ? (
            <div>
              <Typography variant="body1">Wins: {teamRecord.wins}, Losses: {teamRecord.losses}</Typography>
            </div>
          ) : (
            <Typography>Loading team record...</Typography>
          )}

        <div className={classes.teamStatsContainer}>
          <div className={classes.teamStatItem}>
            <Typography variant="body1">Points: {season.points.toFixed(2)}</Typography>
          </div>
          <div className={classes.teamStatItem}>
            <Typography variant="body1">Assists: {season.assists.toFixed(2)}</Typography>
          </div>
          <div className={classes.teamStatItem}>
            <Typography variant="body1">Rebounds: {season.rebounds.toFixed(2)}</Typography>
          </div>
          <div className={classes.teamStatItem}>
            <Typography variant="body1">Field Goal Percentage: {(season.fg_pct.toFixed(4)) * 100}%</Typography>
          </div>
          <div className={classes.teamStatItem}>
            <Typography variant="body1">Three-Point Percentage: {(season.fg3_pct.toFixed(4)) * 100}%</Typography>
          </div>
          <div className={classes.teamStatItem}>
            <Typography variant="body1">Free Throw Percentage: {(season.ft_pct.toFixed(4)) * 100}%</Typography>
          </div>
        </div>

        <div className={classes.playersContainer}>
          <Typography variant="h6">Roster:</Typography>
          <Grid container spacing={2} className={classes.gridContainer}>
            {players.map((player) => (
              <Grid item xs={12} sm={6} md={4} key={player.player_id}>
                  <Card className={classes.playerCard}>
                  <Link to={`/player/${player.player_id}`} key={player.player_id} className={classes.playerCard}>
                    <img
                      src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.player_id}.png`}
                      alt={player.player_name}
                      className={classes.playerPhoto}
                    />
                  </Link>
                  <Link to={`/player/${player.player_id}`} key={player.player_id} className={classes.playerCard}>
                    <CardContent>
                      <Typography variant="subtitle1">{player.player_name}</Typography>
                    </CardContent>
                  </Link>
                  </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </>   
      ) : (
        <Typography>Select a season to view stats</Typography>
      )}
    </div>
  );
};

export default TeamDetail;