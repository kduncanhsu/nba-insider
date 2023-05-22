import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

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
  opponentTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: theme.spacing(2),
  },
  opponentTableHead: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  opponentTableCell: {
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[400]}`,
  },
  opponentTableBodyRow: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  refreshButton: {
    position: 'absolute',
    top: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

const PlayerDetail = () => {
  const { player_id } = useParams();
  const [player, setPlayer] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [season, setSeason] = useState(null);
  const [selectedStatsType, setSelectedStatsType] = useState('career');
  const [opponentPerformance, setOpponentPerformance] = useState([]);
  const [tripleDoubles, setTripleDoubles] = useState([]);
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
    const fetchOpponentPerformance = async () => {
      try {
        const response = await fetch(
          `http://${config.server_host}:${config.server_port}/player_performance_opponents/${player_id}`
        );
        const data = await response.json();
        setOpponentPerformance(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchTripleDoubles = async () => {
      try {
        const response = await fetch(
          `http://${config.server_host}:${config.server_port}/triple_doubles/${player_id}`
        );
        const data = await response.json();
        setTripleDoubles(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlayerData();
    fetchOpponentPerformance();
    fetchTripleDoubles();
  }, [player_id]);

  const handleSeasonChange = async (event) => {
    setSelectedSeason(event.target.value);

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

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className={classes.playerContainer}>
      <IconButton
        className={classes.refreshButton}
        color="primary"
        onClick={() => (window.location.href = '/players/')}
        >
        <RefreshIcon />
      </IconButton>
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
          <Typography variant="h6">Choose from the following:</Typography>
          <select
            value={selectedStatsType}
            onChange={(event) => setSelectedStatsType(event.target.value)}
          >
            <option value="career">Career Stats</option>
            <option value="season">Season Stats</option>
            <option value="opponent">Performance By Team</option>
            <option value="triple-doubles">Triple Doubles</option>
          </select>

          {selectedStatsType === 'career' && (
            <>
              <br/>
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
            </>
          )}
          {selectedStatsType === 'season' && (
            <>
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
            </>
          )}
          {selectedStatsType === 'opponent' && (
            <>
              {opponentPerformance.length > 0 ? (
                <table className={classes.opponentTable}>
                  <thead>
                    <tr className={classes.opponentTableHead}>
                      <th className={classes.opponentTableCell}>Opponent Team</th>
                      <th className={classes.opponentTableCell}>Avg Points</th>
                      <th className={classes.opponentTableCell}>Avg Rebounds</th>
                      <th className={classes.opponentTableCell}>Avg Assists</th>
                      <th className={classes.opponentTableCell}>Avg Steals</th>
                      <th className={classes.opponentTableCell}>Avg Blocks</th>
                      <th className={classes.opponentTableCell}>Avg Performance Metric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opponentPerformance.map((opponent) => (
                      <tr key={opponent.opponent_team_id} className={classes.opponentTableBodyRow}>
                        <td>{opponent.opponent_team_name}</td>
                        <td>{opponent.avg_pts.toFixed(2)}</td>
                        <td>{opponent.avg_reb.toFixed(2)}</td>
                        <td>{opponent.avg_ast.toFixed(2)}</td>
                        <td>{opponent.avg_stl.toFixed(2)}</td>
                        <td>{opponent.avg_blk.toFixed(2)}</td>
                        <td>{opponent.avg_performance_metric.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Typography variant="h6">No opponent performance data available.</Typography>
              )}
            </>
          )}
          {selectedStatsType === 'triple-doubles' && (
            <>
              <Typography variant="h6">Triple Doubles:</Typography>
              {tripleDoubles.length > 0 ? (
                <table className={classes.opponentTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Opponent</th>
                      <th>Points</th>
                      <th>Rebounds</th>
                      <th>Assists</th>
                      <th>Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripleDoubles.map((tripleDouble) => (
                      <tr key={tripleDouble.game_id} className={classes.opponentTableBodyRow}>
                        <td className={classes.opponentTableCell}>
                          {formatDateString(tripleDouble.game_date_est)}
                        </td>
                        <td className={classes.opponentTableCell}>
                          {tripleDouble.opponent_team_name}
                        </td>
                        <td className={classes.opponentTableCell}>
                          {tripleDouble.total_pts}
                        </td>
                        <td className={classes.opponentTableCell}>
                          {tripleDouble.total_reb}
                        </td>
                        <td className={classes.opponentTableCell}>
                          {tripleDouble.total_ast}
                        </td>
                        <td className={classes.opponentTableCell}>
                          {tripleDouble.game_outcome}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Typography>No triple doubles found.</Typography>
              )}
            </>
          )}
        </>
      )}
      {!player && <Typography>Loading player data...</Typography>}
    </div>
  );
};

export default PlayerDetail;