import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PlayerSearch from './pages/PlayerSearch'
import Player from './pages/Player'
import Teams from './pages/Teams'
import Team from './pages/Team'
import BestROI from './pages/BestROI'
import WorstInvestments from './pages/WorstInvestments'
import PlayerSearchH2HPart1 from './pages/PlayerSearchH2HPart1'
import PlayerSearchH2HPart2 from './pages/PlayerSearchH2HPart2'
import Head2Head from './pages/Head2Head'

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayerSearch />} />
          <Route path="/player/:player_id" element={<Player />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/team/:team_id/:team_name" element={<Team />} />
          <Route path="/bestROI" element={<BestROI />} />
          <Route path="/worstInvestments" element={<WorstInvestments />} />
          <Route path="/head2head" element={<PlayerSearchH2HPart1 />} /> 
          <Route path="/head2head/:player_id_1/" element={<PlayerSearchH2HPart2 />} /> 
          <Route path="/head2head/:player_id_1/:player_id_2" element={<Head2Head />} /> 
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
