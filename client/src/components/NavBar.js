import { AppBar, Container, Toolbar, Typography, styled } from '@mui/material';
import { NavLink } from 'react-router-dom';
import logo from './nba-logo.png';

const StyledNavLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  position: relative;

  &::after {
    content: ${({ noUnderline }) => (noUnderline ? 'none' : "''")};
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: white;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const NavText = ({ href, text, isMain, isLarger, noUnderline }) => {
  const variant = isLarger ? 'h4' : isMain ? 'h5' : 'h7';

  return (
    <Typography
      variant={variant}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <StyledNavLink to={href} noUnderline={noUnderline}>
        {text}
      </StyledNavLink>
    </Typography>
  );
};

export default function NavBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '30px',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
            }}
          >
            <StyledNavLink to="/" noUnderline>
              <img src={logo} alt="logo" style={{ width: '40px', height: '40px', marginRight: '15px', marginTop: '7.5px' }} />
            </StyledNavLink>
            <StyledNavLink to="/" noUnderline>
              NBAINSIDER
            </StyledNavLink>
          </Typography>
          <NavText href="/players" text="PLAYERS" isMain />
          <NavText href="/teams" text="TEAMS" isMain />
          <NavText href="/bestROI" text="BEST ROI" isMain />
          <NavText href="/worstInvestments" text="WORST INVESTMENTS" isMain />
          <NavText href="/head2head" text="HEAD2HEAD" isMain />
        </Toolbar>
      </Container>
    </AppBar>
  );
}