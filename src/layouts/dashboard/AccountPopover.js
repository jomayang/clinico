import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
import { collection, query, where, getDocs } from '@firebase/firestore';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';

import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/dashboard/app',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '/dashboard/profile',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [displayName, setDisplayName] = useState('');
  const { currentUser, logout } = useAuth();

  const usersRef = collection(db, 'users');
  const q = currentUser ? query(usersRef, where('email', '==', currentUser.email)) : null;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  useEffect(() => {
    const getProfile = async () => {
      if (currentUser) {
        const data = await getDocs(q);
        const profiles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const fname = profiles[0].firstName ? profiles[0].firstName : '';
        const lname = profiles[0].lastName ? profiles[0].lastName : '';
        if (fname !== '' || lname !== '') {
          setDisplayName(`${fname} ${lname}`);
        }
      }
    };
    getProfile();
  }, []);

  const handleClose = async () => {
    setOpen(null);
  };

  const handleLogoutClose = async () => {
    setOpen(null);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar
          src={currentUser ? `https://robohash.org/${currentUser.email}.png?size=200x200&set=set3` : account.photoURL}
          alt="photoURL"
        />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {currentUser && <>{displayName !== '' ? displayName : currentUser.email}</>}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {currentUser && currentUser.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogoutClose} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
