import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

// import configuration data
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
}));

const PlayerSearch = () => {
  const classes = useStyles();
  const [query, setQuery] = useState('');
  const [playerNames, setPlayerNames] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // search for players based off user input
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
      <Typography variant="h4" component="h1" gutterBottom>
        H2H: Who do you want as Player 1?
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
                  <Link to={`/head2head/${player.player_id}?name=${encodeURIComponent(player.player_name)}`}>{player.player_name}</Link>
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

export default PlayerSearch;