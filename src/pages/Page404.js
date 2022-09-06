import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
// components
import Page from '../components/Page';
import { useAuth } from '../contexts/AuthContext';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const { currentUser } = useAuth();

  return (
    <Page title="404 Page Not Found">
      <Container>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>

          {!currentUser && (
            <Typography sx={{ color: 'text.secondary' }}>Make sure to login before using this app.</Typography>
          )}

          <Box
            component="img"
            src="/static/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />
          {currentUser ? (
            <Button to="/dashboard/app" size="large" variant="contained" component={RouterLink}>
              Go to Home
            </Button>
          ) : (
            <Button to="/login" size="large" variant="contained" component={RouterLink}>
              Login
            </Button>
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}
