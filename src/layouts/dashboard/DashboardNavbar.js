import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography, Chip } from '@mui/material';
import { collection, getDocs, query, where } from '@firebase/firestore';
// components
import { useAuth } from '../../contexts/AuthContext';
import Iconify from '../../components/Iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import { db } from '../../firebase-config';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const { currentUser } = useAuth();
  const [revenue, setRevenue] = useState(0);
  const [isDoctor, setIsDoctor] = useState(false);
  const paymentsRef = collection(db, 'payments');
  const transactionsRef = collection(db, 'transactions');

  const usersRef = collection(db, 'users');
  const q = currentUser ? query(paymentsRef, where('doctor', '==', currentUser.email)) : null;
  const tq = currentUser ? query(transactionsRef, where('doctor', '==', currentUser.email)) : null;
  useEffect(() => {
    const getBalance = async () => {
      const qUser = currentUser ? query(usersRef, where('email', '==', currentUser.email)) : null;

      const dataUser = await getDocs(qUser);
      const profiles = dataUser.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const role = profiles[0].firstName ? profiles[0].role : '';
      setIsDoctor(role === 'doctor');

      const data = await getDocs(q);
      const payments = data.docs.map((doc) => doc.data().payed);

      const transactionsData = await getDocs(tq);
      const transactions = transactionsData.docs.map((doc) => doc.data().amount);
      console.log(transactions);
      let revenue = 0;
      revenue = payments.reduce((previousValue, currentValue) => previousValue + currentValue, 0) * 0.5;
      console.log(revenue);
      let totalPaid = 0;
      totalPaid = transactions.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      console.log(totalPaid);
      setRevenue(revenue - totalPaid);
    };
    getBalance();
  }, []);

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}
          {isDoctor && <Chip label={`Crédit: ${revenue} DA`} color="success" variant="outlined" />}
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
