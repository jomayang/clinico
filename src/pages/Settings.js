import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Stack, Button, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import { RegisterForm } from '../sections/auth/register';
import ProfileForm from '../sections/auth/ProfileForm';
// import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

export default function Settings() {
  const [page, setPage] = useState(0);

  return (
    <Page title="Ajouter Patient">
      <Container>
        <Stack mb={1}>
          <Typography variant="h4" gutterBottom>
            Profile.
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 5 }}>Ajouter nouveau patient.</Typography>
        </Stack>

        <Card sx={{ padding: '2rem' }}>
          <Scrollbar>
            <ProfileForm />
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
