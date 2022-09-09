import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link, Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { collection, getDocs, query, where, orderBy as firebaseOrderBy } from '@firebase/firestore';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
// import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { PatientListHead, PatientListToolbar, PatientMoreMenu } from '../sections/@dashboard/patient';
import { db } from '../firebase-config';
import AppointmentMoreMenu from '../sections/@dashboard/patient/AppointmentMoreMenu';
import { useAuth } from '../contexts/AuthContext';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullname', label: 'Nom et prenom', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
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

export default function Appointments() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { currentUser } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const appointmentRef = collection(db, 'appointments');
  const usersRef = collection(db, 'users');
  useEffect(() => {
    const getAppointments = async () => {
      const qUser = currentUser ? query(usersRef, where('email', '==', currentUser.email)) : null;
      const dataUser = await getDocs(qUser);
      const profiles = dataUser.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const role = profiles[0].role ? profiles[0].role : '';

      const q =
        role === 'doctor'
          ? query(appointmentRef, where('doctor', '==', currentUser.email))
          : query(appointmentRef, firebaseOrderBy('date', 'asc'));
      const data = await getDocs(q);

      setAppointments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getAppointments();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = appointments.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) : 0;

  const filteredUsers = applySortFilter(appointments, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Patient">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Calendrier
          </Typography>
        </Stack>

        <Card>
          <PatientListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PatientListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={appointments.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, firstName, lastName, date } = row;
                    const name = `${firstName} ${lastName}`;
                    const isItemSelected = selected.indexOf(id) !== -1;
                    console.log(isItemSelected);
                    console.log(date.toDate().toString());
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
                            <Avatar alt={name} src={'/static/mock-images/avatar_22.jpg'} />
                            {/* <Link to={`/dashboard/patient/${id}`}> */}
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                            {/* </Link> */}
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          {/* {date.toDate().toLocaleDateString('fr-FR')} {date.toDate().toLocaleTimeString('fr-FR')} */}
                          {date.toDate().toUTCString()}
                        </TableCell>
                        {/* <TableCell align="left">
                          <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <AppointmentMoreMenu id={id} />
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

                {isUserNotFound && (
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
            count={appointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
