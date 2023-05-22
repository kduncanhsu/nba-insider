const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

// LEBRON JAMES ID (FOR TESTING PURPOSES): 2544
// LAKERS TEAM ID (FOR TESTING PURPOSES): 1610612747

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/player_performance_opponents/:player_id', routes.player_performance_opponents);
app.get('/triple_doubles/:player_id', routes.triple_doubles);
app.get('/best_ROI', routes.best_ROI);
app.get('/worst_investments', routes.worst_investments);
app.get('/player_career_stats/:player_id', routes.player_career_stats);
app.get('/player_season_stats/:player_id/:season', routes.player_season_stats);
app.get('/team_season_stats/:team_id/:season', routes.team_season_stats);
app.get('/search_players/:query', routes.search_players);
app.get('/players_on_team/:team_id/:season', routes.players_on_team);
app.get('/teams', routes.teams);
app.get('/team_season_record/:team_id/:season', routes.team_season_record);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
