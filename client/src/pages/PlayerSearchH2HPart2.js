import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

const config = require('../config.json');

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    maxWidth: '500px',
    width: '100%',
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  searchButton: {
    minWidth: '80px',
  },
  tableContainer: {
    maxWidth: '500px',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  refreshButton: {
    position: 'absolute',
    top: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PlayerSearchH2HPart2 = () => {
  const classes = useStyles();
  const { player_id_1 } = useParams();
  const [query, setQuery] = useState('');
  const [playerNames, setPlayerNames] = useState([]);

   // decode the player name from user input in PlayerSearchH2HPart1.js which has been encoded in the URL
  const queryParam = useQuery();
  const firstPlayerName = decodeURIComponent(queryParam.get('name') || '');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  
  // fetch player names based on user input
  const fetchPlayerNames = async () => {
    try {
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/search_players/${query}`
      );
      const data = await response.json();
      setPlayerNames(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
       <IconButton
        className={classes.refreshButton}
        color="primary"
        onClick={() => (window.location.href = '/head2head/')}
      >
        <RefreshIcon />
      </IconButton>
      <Typography variant="h4" component="h1" gutterBottom>
        H2H: Search for Player 2
      </Typography>
      <Typography variant="h6" component="p" gutterBottom>
        Comparing with: {firstPlayerName}
      </Typography>
      <div className={classes.searchContainer}>
        <TextField
          className={classes.searchInput}
          label="Enter player name"
          value={query}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
        />
        <Button
          className={classes.searchButton}
          variant="contained"
          color="primary"
          onClick={fetchPlayerNames}
        >
          Search
        </Button>
      </div>

      {playerNames.length > 0 && (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player ID</TableCell>
                <TableCell>Player Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerNames.map((player) => (
                <TableRow key={player.player_id}>
                  <TableCell>{player.player_id}</TableCell>
                  <TableCell>
                    <Link to={`/head2head/${player_id_1}/${player.player_id}`}>{player.player_name}</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default PlayerSearchH2HPart2;