import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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
  careerStatsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  careerStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(0, 2),
  },
  seasonSelector: {
    margin: theme.spacing(2, 0),
  },
  seasonStatsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  seasonStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(0, 2),
  },
}));

const PlayerDetail = () => {
  const { player_id } = useParams();
  const [player, setPlayer] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [season, setSeason] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(
          `http://${config.server_host}:${config.server_port}/player_career_stats/${player_id}`
        );
        const data = await response.json();
        setPlayer(data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlayerData();
  }, [player_id]);

  const fetchPlayerSeasonStats = async () => {
    try {
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/player_season_stats/${player_id}/${selectedSeason}`
      );
      const data = await response.json();
      setSeason(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };


  return (
    <div className={classes.playerContainer}>
      {player && (
        <>
          <Typography variant="h4" component="h1">
            {player.player_name}
          </Typography>
          <img
            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player_id}.png`}
            alt={player.player_name}
            className={classes.playerPhoto}
          />
          <Typography variant="h6">Career Stats:</Typography>
          <div className={classes.careerStatsContainer}>
            <div className={classes.careerStat}>
              <Typography variant="body1">Points</Typography>
              <Typography variant="body1">{player.points.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Assists</Typography>
              <Typography variant="body1">{player.assists.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Rebounds</Typography>
              <Typography variant="body1">{player.rebounds.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Steals</Typography>
              <Typography variant="body1">{player.steals.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Blocks</Typography>
              <Typography variant="body1">{player.blocks.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Turnovers</Typography>
              <Typography variant="body1">{player.turnovers.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Field Goal %</Typography>
              <Typography variant="body1">{(player.fg_pct * 100).toFixed(2)}%</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Three-Point %</Typography>
              <Typography variant="body1">{(player.fg3_pct * 100).toFixed(2)}%</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Free Throw %</Typography>
              <Typography variant="body1">{(player.ft_pct * 100).toFixed(2)}%</Typography>
            </div>
          </div>

          <Typography variant="h6">Season Stats:</Typography>
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

          <button onClick={fetchPlayerSeasonStats}>Get Season Stats</button>
        </>
      )}
      {season ? (
        <>
          <br />
          <div className={classes.careerStatsContainer}>
            <div className={classes.careerStat}>
              <Typography variant="body1">Points</Typography>
              <Typography variant="body1">{season.points.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Assists</Typography>
              <Typography variant="body1">{season.assists.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Rebounds</Typography>
              <Typography variant="body1">{season.rebounds.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Steals</Typography>
              <Typography variant="body1">{season.steals.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Blocks</Typography>
              <Typography variant="body1">{season.blocks.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Turnovers</Typography>
              <Typography variant="body1">{season.turnovers.toFixed(2)}</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Field Goal %</Typography>
              <Typography variant="body1">{(season.fg_pct * 100).toFixed(2)}%</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Three-Point %</Typography>
              <Typography variant="body1">{(season.fg3_pct * 100).toFixed(2)}%</Typography>
            </div>
            <div className={classes.careerStat}>
              <Typography variant="body1">Free Throw %</Typography>
              <Typography variant="body1">{(season.ft_pct * 100).toFixed(2)}%</Typography>
            </div>
          </div>
        </>
      ) : (
        <Typography variant="h6">He didn't play in this season.</Typography>
      )}
    </div>
  );
};

export default PlayerDetail;