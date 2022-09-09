import { forwardRef, useEffect, useState } from 'react';
import { filter } from 'lodash';
// @mui
import { useTheme } from '@mui/material/styles';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getDocs, collection, addDoc, updateDoc, doc, where, query } from '@firebase/firestore';
import {
  Grid,
  Container,
  Typography,
  CardHeader,
  Card,
  FormControl,
  Autocomplete,
  TextField,
  CardContent,
  Snackbar,
  Button,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Stack,
  TablePagination,
  Avatar,
  IconButton,
  Modal,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { db } from '../firebase-config';
import { PatientListHead, PatientListToolbar } from '../sections/@dashboard/patient';
import SearchNotFound from '../components/SearchNotFound';
import Scrollbar from '../components/Scrollbar';
import { drugListStatic } from '../utils/drugs';

// ----------------------------------------------------------------------

const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const TABLE_HEAD = [
  { id: 'fullname', label: 'Nom et prenom', alignRight: false },
  { id: 'revenue', label: 'Revenue', alignRight: false },
  { id: 'credit', label: 'Crédit', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DashboardApp() {
  const theme = useTheme();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [payAmount, setPayAmount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [drugList, setDrugList] = useState([]);
  const [newDrug, setNewDrug] = useState('');

  const [consultationPrice, setConsultationPrice] = useState(0);
  const [eegPrice, setEegPrice] = useState(0);
  const [emgPrice, setEmgPrice] = useState(0);
  const [id, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getDrugs = async () => {
      const data = await getDocs(collection(db, 'drugs'));
      const drugArr = data.docs.map((doc) => doc.data().drugDesc);
      // console.log(drugArr);
      const newDrugList = [...drugListStatic, ...drugArr];
      setDrugList(newDrugList);
      // setDrugList(drugArr);
    };
    getDrugs();
  }, []);

  useEffect(() => {
    const getPrices = async () => {
      const data = await getDocs(collection(db, 'prices'));
      const pricesArr = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setConsultationPrice(pricesArr[0].consultation);
      setEegPrice(pricesArr[0].eeg);
      setEmgPrice(pricesArr[0].emg);
      setId(pricesArr[0].id);
    };
    getPrices();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
      const data = await getDocs(q);
      const doctorsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(doctorsData);

      setUsers(doctorsData);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getCredits = async () => {
      console.log('users: ', users);
      const doctorsArr = [];
      const docs = users.map(async (user) => {
        const pq = query(collection(db, 'payments'), where('doctor', '==', user.email));
        const tq = query(collection(db, 'transactions'), where('doctor', '==', user.email));
        const paymentsData = await getDocs(pq);
        const payments = paymentsData.docs.map((doc) => doc.data().payed);
        const transactionsData = await getDocs(tq);
        const transactions = transactionsData.docs.map((doc) => doc.data().amount);
        console.log(payments);
        let revenue = 0;
        let totalPaid = 0;
        revenue = payments.reduce((previousValue, currentValue) => previousValue + currentValue, 0) * 0.5;
        totalPaid = transactions.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        // console.log({ ...user, credit: revenue });
        setDoctors([...doctorsArr, { ...user, revenue, credit: revenue - totalPaid }]);
      });
      console.log('doc arr: ', docs);
      // setDoctors(doctorsArr);
    };
    getCredits();
  }, [users]);

  const getBalance = async () => {};

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = doctors.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - doctors.length) : 0;
  console.log('doctors: ', doctors);
  const filteredDoctors = applySortFilter(doctors, getComparator(order, orderBy), filterName);

  const isDoctorNotFound = filteredDoctors.length === 0;

  const addNewDrug = async () => {
    try {
      await addDoc(collection(db, 'drugs'), {
        drugDesc: newDrug,
      });
      setFeedback('Drug added!');
      setOpen(true);
    } catch (err) {
      setFeedback('a Problem accured when adding Drug!');
      setIsError(true);
    }
  };

  const updatePrices = async () => {
    try {
      await updateDoc(doc(db, 'prices', id), {
        consultation: consultationPrice,
        eeg: eegPrice,
        emg: emgPrice,
      });
      setFeedback('Prices updated!');
      setOpen(true);
    } catch (err) {
      setFeedback('a Problem accured when updating prices!');
      setIsError(true);
    }
  };
  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const payDoctor = async () => {
    try {
      await addDoc(collection(db, 'transactions'), {
        doctor: currentDoctor,
        amount: payAmount,
      });
      setFeedback('Payment succeed!');
      setOpen(true);
    } catch (err) {
      setFeedback('a Problem accured when paying the doctor!');
      setIsError(true);
    }
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            {currentDoctor !== '' && (
              <Card sx={{ marginBottom: '2rem' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                    Médecin: {currentDoctor}
                  </Typography>

                  <FormControl>
                    <TextField
                      name="pay-amount"
                      label="Amount (DA)"
                      aria-label="maximum height"
                      value={payAmount}
                      onChange={(e) => setPayAmount(+e.target.value)}
                    />
                  </FormControl>
                  <Button size="large" onClick={payDoctor} variant="contained" sx={{ marginLeft: '1rem' }}>
                    Pay
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <PatientListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <PatientListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={doctors.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredDoctors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const { id, firstName, lastName, email, revenue, credit } = row;
                        const name = `${firstName} ${lastName}`;
                        const isItemSelected = selected.indexOf(id) !== -1;
                        console.log(isItemSelected);
                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                  a: {
                                    textDecoration: 'initial',
                                    color: '#333',
                                    transition: '.3s all ease-in-out',
                                  },
                                  'a:hover': {
                                    color: '#2065D1',
                                  },
                                }}
                              >
                                <Avatar alt={name} src={`https://robohash.org/${email}.png?size=200x200&set=set3`} />
                                {/* <Link to={`/dashboard/patient/${id}`}> */}
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
                                {/* </Link> */}
                              </Stack>
                            </TableCell>
                            {/* <TableCell>{payed.toFixed(2)} DA</TableCell> */}
                            <TableCell>{revenue.toFixed(2)} DA</TableCell>
                            <TableCell>{credit.toFixed(2)} DA</TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => setCurrentDoctor(email)}
                                color={currentDoctor === email ? 'error' : 'primary'}
                              >
                                <Iconify icon="eva:credit-card-outline" width={20} height={20} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isDoctorNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={doctors.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader title={'Liste des médicaments'} />
              <CardContent sx={{ paddingBottom: '1rem' }}>
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    id="drug-list"
                    options={drugList}
                    renderInput={(params) => <TextField {...params} label="Médicaments" />}
                  />
                </FormControl>
                <Box sx={{ paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
                  <Typography variant="h6">Ajouter médicament</Typography>
                  <FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <TextField
                      name="new-drug"
                      label="Nouveau médicament"
                      value={newDrug}
                      onChange={(e) => setNewDrug(e.target.value)}
                    />
                  </FormControl>

                  <Button fullWidth size="large" onClick={addNewDrug} variant="contained">
                    Ajouter médicament
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ marginTop: '2rem' }}>
              <CardHeader title={'Prix'} />
              <CardContent>
                <FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <TextField
                    name="consultation-price"
                    label="Prix de consultation"
                    value={consultationPrice}
                    onChange={(e) => setConsultationPrice(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <TextField
                    name="eeg-price"
                    label="Prix d'EEG"
                    value={eegPrice}
                    onChange={(e) => setEegPrice(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <TextField
                    name="emg-price"
                    label="Prix d'EMG"
                    value={emgPrice}
                    onChange={(e) => setEmgPrice(e.target.value)}
                  />
                </FormControl>
                <Button fullWidth size="large" onClick={updatePrices} variant="contained">
                  Modifier prix
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={isError ? 'error' : 'success'} sx={{ width: '100%' }}>
            {feedback}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}
