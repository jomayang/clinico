import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import { collection, query, where, getDocs } from '@firebase/firestore';
// mock
import account from '../../_mock/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import { adminNavConfig, doctorNavConfig, receptionistNavConfig } from './NavConfig';
import Iconify from '../../components/Iconify';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const [displayName, setDisplayName] = useState('');
  const isDesktop = useResponsive('up', 'lg');
  const { currentUser } = useAuth();
  const [navConfig, setNavConfig] = useState([]);
  const usersRef = collection(db, 'users');
  const q = currentUser ? query(usersRef, where('email', '==', currentUser.email)) : null;

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const getProfile = async () => {
      if (currentUser) {
        const data = await getDocs(q);
        const profiles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const fname = profiles[0].firstName ? profiles[0].firstName : '';
        const lname = profiles[0].lastName ? profiles[0].lastName : '';
        const role = profiles[0].role ? profiles[0].role : '';
        if (fname !== '' || lname !== '') {
          setDisplayName(`${fname} ${lname}`);
        }

        if (role === 'admin') setNavConfig(adminNavConfig);
        else if (role === 'doctor') setNavConfig(doctorNavConfig);
        else setNavConfig(receptionistNavConfig);
      }
    };
    getProfile();
  }, []);
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar
              src={
                currentUser ? `https://robohash.org/${currentUser.email}.png?size=200x200&set=set3` : account.photoURL
              }
              alt="photoURL"
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
                {currentUser && <>{displayName !== '' ? displayName : currentUser.email}</>}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          {/* <Box
            component="img"
            src="/static/illustrations/doctor.png"
            sx={{ width: 100, position: 'absolute', top: -50, opacity: 0.8 }}
          /> */}

          <Button
            href="/dashboard/add-patient"
            size="large"
            target="_blank"
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Nouveau Patient
          </Button>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
