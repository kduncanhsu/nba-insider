const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// Route 1: GET /player_performance_opponents/:player_id
const player_performance_opponents = async function(req, res) {
  connection.query(`
  WITH PlayerPerformance AS (
   SELECT
     gd.player_id,
     ps.player_name,  -- Retrieve the player name
     CASE
       WHEN gd.team_id = g.home_team_id THEN g.visitor_team_id
       ELSE g.home_team_id
     END AS opponent_team_id,  -- Identify the opponent team
     AVG(gd.pts) AS avg_pts,
     AVG(gd.reb) AS avg_reb,
     AVG(gd.ast) AS avg_ast,
     AVG(gd.stl) AS avg_stl,
     AVG(gd.blk) AS avg_blk,
     AVG(gd.pts + gd.reb + gd.ast + gd.stl + gd.blk) AS avg_performance_metric
   FROM
     Game_Details gd
   JOIN
     Games g ON gd.game_id = g.game_id
   JOIN
     Player_Season ps ON gd.player_id = ps.player_id
   WHERE
     ps.player_id = '${req.params.player_id}'
   GROUP BY
     gd.player_id, ps.player_name, opponent_team_id
  )
  SELECT
   pp.player_id,
   pp.player_name,
   t.team_name AS opponent_team_name,  -- Retrieve the opponent team name
   pp.avg_pts,
   pp.avg_reb,
   pp.avg_ast,
   pp.avg_stl,
   pp.avg_blk,
   pp.avg_performance_metric
  FROM
   PlayerPerformance pp
  JOIN
   Teams t ON pp.opponent_team_id = t.team_id  -- Join with the Teams table
  ORDER BY
    pp.avg_performance_metric DESC;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 2: GET /triple_doubles/:player_id

const triple_doubles = async function(req, res) {
  connection.query(`
    WITH PlayerGameStats AS (
  SELECT
    gd.player_id,
    gd.game_id,
    gd.team_id,
    CASE
      WHEN gd.team_id = g.home_team_id THEN g.visitor_team_id
      ELSE g.home_team_id
    END AS opponent_team_id,
    gd.pts AS total_pts,
    gd.reb AS total_reb,
    gd.ast AS total_ast
  FROM
    Game_Details gd
  JOIN
    Games g ON gd.game_id = g.game_id
  JOIN
    Player_Season ps ON gd.player_id = ps.player_id
  WHERE
    ps.player_id = '${req.params.player_id}'
    AND gd.pts >= 10 AND gd.reb >= 10 AND gd.ast >= 10
)
SELECT DISTINCT
  g.game_date_est,
  ps.player_name,
  t.team_name AS opponent_team_name,
  pgs.total_pts,
  pgs.total_reb,
  pgs.total_ast,
  CASE
    WHEN (pgs.total_pts >= 10 AND pgs.total_reb >= 10 AND pgs.total_ast >= 10) AND
         ((pgs.team_id = g.home_team_id AND g.pts_home > g.pts_away) OR
          (pgs.team_id = g.visitor_team_id AND g.pts_away > g.pts_home)) THEN 'Win'
    ELSE 'Loss'
  END AS game_outcome
FROM
  PlayerGameStats pgs
JOIN
  Games g ON pgs.game_id = g.game_id
JOIN
  Player_Season ps ON pgs.player_id = ps.player_id
JOIN
  Teams t ON pgs.opponent_team_id = t.team_id
ORDER BY
  g.game_date_est;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 3: GET /best_ROI
const best_ROI = async function(req, res) {

  connection.query(`
    WITH PlayerPerformanceToSalary AS (
     SELECT
       ps.player_id,
       ps.player_name,
       g.season,
       ps.salary,
       (SUM(gd.pts) + SUM(gd.reb) + SUM(gd.ast) + SUM(gd.stl) + SUM(gd.blk)
         - SUM(gd.to_) - SUM(gd.pf)) / NULLIF(ps.salary, 0) AS performance_to_salary_ratio
     FROM
       Player_Season ps
     JOIN
       Game_Details gd ON ps.player_id = gd.player_id
     JOIN
       Games g ON gd.game_id = g.game_id
     WHERE
       ps.salary IS NOT NULL AND ps.season = g.season AND ps.salary >= 500000
     GROUP BY
       ps.player_id, ps.player_name, g.season, ps.salary
    ),
    RankedPlayers AS (
     SELECT
       player_id,
       player_name,
       season,
       salary,
       performance_to_salary_ratio,
       RANK() OVER (ORDER BY performance_to_salary_ratio DESC) AS rank_overall
     FROM
       PlayerPerformanceToSalary
    )
    SELECT player_id, player_name, season, salary,performance_to_salary_ratio
    FROM RankedPlayers
    WHERE rank_overall <= 200
    ORDER BY rank_overall;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 4: GET /worst_investments
const worst_investments = async function(req, res) {

  connection.query(`
    WITH PlayerPerformanceToSalary AS (
     SELECT
       ps.player_id,
       ps.team_id,
       g.season,
       ps.salary,
       (SUM(gd.pts) + SUM(gd.reb) + SUM(gd.ast) + SUM(gd.stl) + SUM(gd.blk)
         - SUM(gd.to_) - SUM(gd.pf)) / NULLIF(ps.salary, 0) AS performance_to_salary_ratio
     FROM
       Player_Season ps
     JOIN
       Game_Details gd ON ps.player_id = gd.player_id
     JOIN
       Games g ON gd.game_id = g.game_id
     WHERE
       ps.salary IS NOT NULL AND ps.season = g.season AND ps.salary >= 500000
     GROUP BY
       ps.player_id, ps.team_id, g.season, ps.salary
    ),
    TeamPerformanceToSalary AS (
     SELECT
       team_id,
       AVG(performance_to_salary_ratio) AS avg_performance_to_salary
     FROM
       PlayerPerformanceToSalary
     GROUP BY
       team_id
    )
    SELECT
     t.team_id,
     tm.team_name,  -- Retrieve the team name
     t.avg_performance_to_salary
    FROM
     TeamPerformanceToSalary t
    JOIN
     Teams tm ON t.team_id = tm.team_id  -- Join with the Teams table
    ORDER BY
     t.avg_performance_to_salary;  -- Order by the average performance-to-salary ratio
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 5: GET /player_career_stats/:player_id
const player_career_stats = async function(req, res) {

  connection.query(`
    SELECT player_id, player_name, AVG(pts) AS points, AVG(ast) as assists, AVG(reb) AS rebounds, AVG(stl) AS steals, AVG(blk) AS blocks
    , AVG(to_) as turnovers, AVG(fg_pct) as fg_pct, AVG(fg3_pct) as fg3_pct, AVG(ft_pct) as ft_pct FROM Game_Details
    WHERE player_id = '${req.params.player_id}'
    GROUP BY player_id;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 6: /player_season_stats/:player_id/:season
const player_season_stats = async function(req, res) {

  connection.query(`
  WITH game_details_with_dates AS (
   SELECT g.game_date_est, g.season, gd.*
   FROM Games g JOIN Game_Details gd ON g.game_id = gd.game_id
  )
  SELECT player_id, player_name, AVG(pts) AS points, AVG(ast) as assists, AVG(reb) AS rebounds, AVG(stl) AS steals, AVG(blk) AS blocks
    , AVG(to_) as turnovers, AVG(fg_pct) as fg_pct, AVG(fg3_pct) as fg3_pct, AVG(ft_pct) as ft_pct
  FROM game_details_with_dates
  WHERE season = '${req.params.season}' AND player_id = '${req.params.player_id}'
  GROUP BY player_id;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 7: GET /team_season_stats/:team_id/:season
const team_season_stats = async function (req, res) {
  connection.query(`
WITH TeamSeasonStats AS (
  SELECT
    g.home_team_id AS team_id,
    AVG(g.pts_home) AS total_points,
    AVG(g.ast_home) AS total_assists,
    AVG(g.reb_home) AS total_rebounds,
    AVG(g.fg_pct_home) AS avg_fg_pct,
    AVG(g.fg3_pct_home) AS avg_3p_pct,
    AVG(g.ft_pct_home) AS avg_ft_pct
  FROM
    Games g
  WHERE
    g.home_team_id = '${req.params.team_id}' AND g.season = '${req.params.season}'
  GROUP BY
    g.home_team_id
  UNION ALL
  SELECT
    g.visitor_team_id AS team_id,
    AVG(g.pts_away) AS total_points,
    AVG(g.ast_away) AS total_assists,
    AVG(g.reb_away) AS total_rebounds,
    AVG(g.fg_pct_away) AS avg_fg_pct,
    AVG(g.fg3_pct_away) AS avg_3p_pct,
    AVG(g.ft_pct_away) AS avg_ft_pct
  FROM
    Games g
  WHERE
    g.visitor_team_id = '${req.params.team_id}' AND g.season = '${req.params.season}'
  GROUP BY
    g.visitor_team_id
)
SELECT
  t.team_id,
  t.team_name,
  AVG(ts.total_points) AS points,
  AVG(ts.total_assists) AS assists,
  AVG(ts.total_rebounds) AS rebounds,
  AVG(ts.avg_fg_pct) AS fg_pct,
  AVG(ts.avg_3p_pct) AS fg3_pct,
  AVG(ts.avg_ft_pct) AS ft_pct
FROM
  TeamSeasonStats ts
JOIN
  Teams t ON ts.team_id = t.team_id
GROUP BY
  t.team_id,
  t.team_name;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 8: GET /search_players/:query
const search_players = async function (req, res) {
  connection.query(`
    SELECT
    player_id,
      player_name
    FROM
    Players
    WHERE
    MATCH(player_name) AGAINST('${req.params.query}' IN NATURAL LANGUAGE MODE)
    ORDER BY
    MATCH(player_name) AGAINST('${req.params.query}' IN NATURAL LANGUAGE MODE) DESC;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 9: GET /players_on_team/:team_id/:season
const players_on_team = async function (req, res) {
  connection.query(`
    SELECT
    player_id,
      player_name
    FROM
    Player_Season
    WHERE
    team_id = ${req.params.team_id} AND season = ${req.params.season}
    ORDER BY
    player_name;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 10: GET /teams
const teams = async function (req, res) {
  connection.query(`
    SELECT
    team_id,
      team_name
    FROM
    Teams
    ORDER BY
    team_name;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 11: GET /team_season_record/:team_id/:season
const team_season_record = async function (req, res) {
  connection.query(
    `
    SELECT
      SUM(CASE WHEN g.home_team_id = ${req.params.team_id} AND g.season = ${req.params.season} THEN IF(g.pts_home > g.pts_away, 1, 0) ELSE IF(g.pts_away > g.pts_home, 1, 0) END) AS wins,
      SUM(CASE WHEN g.home_team_id = ${req.params.team_id} AND g.season = ${req.params.season} THEN IF(g.pts_home < g.pts_away, 1, 0) ELSE IF(g.pts_away < g.pts_home, 1, 0) END) AS losses
    FROM
      Games g
    WHERE
      (g.home_team_id = ${req.params.team_id} OR g.visitor_team_id = ${req.params.team_id}) AND g.season = ${req.params.season}
    `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data[0]);
      }
    }
  );
};

module.exports = {
  player_performance_opponents,
  triple_doubles,
  best_ROI,
  worst_investments,
  player_career_stats,
  player_season_stats,
  team_season_stats,
  search_players,
  players_on_team,
  teams,
  team_season_record
}
