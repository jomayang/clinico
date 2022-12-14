import { useState, useEffect, forwardRef } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  orderBy,
  updateDoc,
  query,
  serverTimestamp,
} from '@firebase/firestore';
// material
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Grid,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Box,
  Tooltip,
  IconButton,
  FormControl,
  TextField,
  Snackbar,
  Link,
} from '@mui/material';
// components
import {
  DescriptionOutlined,
  ArticleOutlined,
  BadgeOutlined,
  WorkOutline,
  MedicalInformationOutlined,
} from '@mui/icons-material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import FollowupForm from '../sections/@dashboard/patient/FollowupForm';
import AppointmentAddForm from '../sections/@dashboard/patient/AppointmentAddForm';
import { db } from '../firebase-config';
import DocSection from '../components/Patient/DocSection';
import Ordonance from '../components/documents/Ordonance';
import { useAuth } from '../contexts/AuthContext';

// import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
const rows = [
  {
    type: 'nom',
    value: 'ghazi',
  },
  {
    type: 'prenom',
    value: 'mehdi',
  },
  {
    type: 'age',
    value: '27',
  },
  {
    type: 'telephone',
    value: '055499721',
  },
  {
    type: 'assurance',
    value: 'CNAS',
  },
  {
    type: 'genre',
    value: 'male',
  },
];
const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// const followups = [
//   {
//     date: '05/12/2021',
//     pattern: 'avc',
//     clinicalExam: 'Lorem ipsum dolor sit emmet',
//     complementaryExam: 'Nothing more than a fat cow',
//   },
//   {
//     date: '05/12/2020',
//     pattern: 'avc',
//     clinicalExam: 'Lorem ipsum dolor sit emmet',
//     complementaryExam: 'Nothing more than a fat cow',
//   },
//   {
//     date: '05/12/2022',
//     pattern: 'avc',
//     clinicalExam: 'Lorem ipsum dolor sit emmet',
//     complementaryExam: 'Nothing more than a fat cow',
//   },
// ];
export default function PatientDetails() {
  const [page, setPage] = useState(0);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState();
  const patientsCollectionRef = collection(db, 'patients');
  const [followups, setFollowups] = useState([]);
  const [cleanCredit, setCleanCredit] = useState(0);
  const [patientCredit, setPatientCredit] = useState(0);
  const [patientPayed, setPatientPayed] = useState(0);
  const { id } = useParams();
  const patientRef = doc(db, 'patients', id);
  const followupsRef = collection(db, 'patients', id, 'folder');
  const q = query(followupsRef, orderBy('consultationDate', 'desc'));

  const [number, setNumber] = useState(0);
  const [age, setAge] = useState(0);

  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { currentUser } = useAuth();
  useEffect(() => {
    const getPatients = async () => {
      const data = await getDoc(patientRef);
      setPatient(data.data());
      setAge(Math.floor((new Date() - data.data().dateOfBirth.toDate().getTime()) / 3.15576e10));
      // setPatients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPatients();
    console.log(id);
  }, []);
  useEffect(() => {
    const getOrdonances = async () => {
      const data = await getDocs(collection(db, 'ordonances'));
      setNumber(data.docs.length);
    };
    getOrdonances();
  }, []);
  useEffect(() => {
    const getFollowups = async () => {
      // const query = await get(followupsRef, orderBy('date', 'desc'));
      // query(citiesRef, orderBy("name", "desc")
      const data = await getDocs(q);
      console.log(data);
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, ' => ', doc.data());
      // });
      // console.log(data);
      const fetchedFollowups = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const initialCredit = 0;
      const initialPaid = 0;
      const credits = fetchedFollowups.map((f) => f.credit);
      const paids = fetchedFollowups.map((f) => f.payed);

      const totalCredit = credits.reduce((previousValue, currentValue) => previousValue + currentValue, initialCredit);
      const totalPaid = paids.reduce((previousValue, currentValue) => previousValue + currentValue, initialPaid);

      setPatientPayed(totalPaid.toFixed(2));
      setPatientCredit(totalCredit.toFixed(2));
      setFollowups(fetchedFollowups);
    };
    getFollowups();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleCleanCredit = async (fid, credit, fpayed, fcredit) => {
    const newCredit = fcredit - credit;
    const newPayed = +fpayed + credit;
    const followupDoc = doc(db, 'patients', id, 'folder', fid);
    const paymentsCol = collection(db, 'payments');
    const newFields = { credit: newCredit, payed: newPayed };
    const doctor = currentUser ? currentUser.email : '';
    try {
      await updateDoc(followupDoc, newFields);
      await addDoc(paymentsCol, {
        firstName: patient.firstName,
        lastName: patient.lastName,
        date: serverTimestamp(),
        payed: credit,
        credit: -credit,
        doctor,
      });
      setFeedback(`cleaned ${credit} DA`);

      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page title="Ajouter Patient">
      <Container>
        <Stack mb={1}>
          <Typography variant="h4" gutterBottom>
            {patient && `${patient.firstName} ${patient.lastName}`}
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 5 }}>Details de patient.</Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid item sm={8}>
            <Card sx={{ padding: '2rem' }}>
              <Scrollbar>
                {patient && (
                  <FollowupForm
                    diagnosisList={patient.diagnosisList || []}
                    firstName={patient.firstName}
                    lastName={patient.lastName}
                    dateOfBirth={patient.dateOfBirth}
                    address={patient.address}
                    gender={patient.gender}
                    number={number}
                    id={id}
                  />
                )}
              </Scrollbar>
            </Card>
            <Stack spacing={2} sx={{ marginTop: '1rem' }}>
              {followups.map((followup, i) => (
                <Card sx={{ padding: '2rem 2rem 1rem 2rem' }} key={i}>
                  {followup.atcd && (
                    <Box sx={{ marginBottom: '10px' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>ATCD: </Typography>
                      <Typography sx={{ fontSize: '14px', lineHeight: 1.5, color: '#878f97' }}>
                        <span dangerouslySetInnerHTML={{ __html: followup.atcd }} />
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ marginBottom: '10px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Motif: </Typography>
                    <Typography sx={{ fontSize: '14px', lineHeight: 1.5, color: '#878f97' }}>
                      <span dangerouslySetInnerHTML={{ __html: followup.pattern }} />
                    </Typography>
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Examen Clinique: </Typography>
                    <Typography sx={{ fontSize: '14px', lineHeight: 1.5, color: '#878f97' }}>
                      <span dangerouslySetInnerHTML={{ __html: followup.clinicalExam }} />
                    </Typography>
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Examen Complementaire: </Typography>
                    <Typography sx={{ fontSize: '14px', lineHeight: 1.5, color: '#878f97' }}>
                      <span dangerouslySetInnerHTML={{ __html: followup.complementaryExam }} />
                    </Typography>
                  </Box>
                  {followup.diagnosisType && (
                    <Box sx={{ marginBottom: '10px' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Type de diagnostique: </Typography>
                      <Typography sx={{ fontSize: '14px', lineHeight: 1.5, color: '#878f97' }}>
                        {followup.diagnosisType}
                      </Typography>
                    </Box>
                  )}
                  {followup.treatments && (
                    <Box sx={{ marginBottom: '10px' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Traitement: </Typography>
                      <Typography sx={{ fontSize: '14px', lineHeight: 1.5, color: '#878f97' }}>
                        {followup.treatments.map((drug) => drug.drugName).join(', ')}
                      </Typography>
                    </Box>
                  )}
                  {followup.images && (
                    <Box sx={{ marginBottom: '10px' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Images: </Typography>
                      {followup.images.map((image, i) => (
                        <Link key={i} href={image} underline="hover">
                          <Typography sx={{ fontSize: '14px' }}>Image {i}</Typography>
                        </Link>
                      ))}
                    </Box>
                  )}
                  {followup.diagnosisDetails && (
                    <Box sx={{ marginBottom: '10px' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Details de diagnostique: </Typography>
                      <Typography sx={{ fontSize: '14px', lineHeight: 1.5, color: '#878f97' }}>
                        {followup.diagnosisDetails}
                      </Typography>
                    </Box>
                  )}

                  {followup.credit && followup.credit !== 0 ? (
                    <>
                      <Stack spacing={2} sx={{ paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <FormControl fullWidth>
                          <TextField
                            name="credit"
                            label="Cr??dit a effacer"
                            value={cleanCredit}
                            onChange={(e) => setCleanCredit(+e.target.value)}
                          />
                        </FormControl>
                        <Typography>Cr??dit: {followup.credit} DA</Typography>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => handleCleanCredit(followup.id, cleanCredit, followup.payed, followup.credit)}
                          variant="outlined"
                        >
                          Effacer
                        </Button>
                      </Stack>
                    </>
                  ) : (
                    <></>
                  )}
                  <Stack
                    direction="row"
                    sx={{ borderTop: '1px solid #eee', paddingTop: '1rem', justifyContent: 'space-between' }}
                  >
                    {followup.treatments ? (
                      <Box sx={{ marginBottom: '10px' }}>
                        <PDFDownloadLink
                          document={
                            <Ordonance
                              firstName={patient.firstName}
                              lastName={patient.lastName}
                              age={age}
                              gender={patient.gender}
                              number={number}
                              address={patient.address}
                              ordonance={followup.treatments}
                            />
                          }
                          fileName="ordonance"
                        >
                          {({ loading, error }) =>
                            loading ? (
                              <Button variant="outlined">chargement...</Button>
                            ) : (
                              <Button variant="contained">Ordonance</Button>
                            )
                          }
                        </PDFDownloadLink>
                      </Box>
                    ) : (
                      <div />
                    )}
                    <Box sx={{ justifyContent: 'end', textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                        Date de consultation:
                      </Typography>
                      <Typography>{followup.consultationDate.toDate().toDateString()}</Typography>
                    </Box>
                  </Stack>
                </Card>
              ))}

              {/* )} */}
            </Stack>
          </Grid>

          {patient && (
            <Grid item sm={4}>
              <Card sx={{ padding: '2rem' }}>
                {/* {console.log(patient)} */}
                <Table aria-label="simple table" size="small">
                  <TableBody>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        Nom:
                      </TableCell>
                      <TableCell align="right">{patient.lastName}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        Prenom:
                      </TableCell>
                      <TableCell align="right">{patient.firstName}</TableCell>
                    </TableRow>
                    {patient.diagnosis && (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                          Diagnostique:
                        </TableCell>
                        <TableCell align="right">{patient.diagnosis.join(', ')}</TableCell>
                      </TableRow>
                    )}
                    {patient.dateOfBirth && (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                          Age:
                        </TableCell>
                        {/* Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10) */}

                        <TableCell align="right">
                          {Math.floor((new Date() - patient.dateOfBirth.toDate().getTime()) / 3.15576e10)}
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        Telephone:
                      </TableCell>
                      <TableCell align="right">{patient.phone}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        Assurance:
                      </TableCell>
                      <TableCell align="right">{patient.insurance}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        Pay??:
                      </TableCell>
                      <TableCell align="right">{patientPayed} DA</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        cr??dit:
                      </TableCell>
                      <TableCell align="right" sx={patientCredit > 0 ? { color: '#FF4842', fontWeight: 'bold' } : {}}>
                        {patientCredit} DA
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {/* <hr /> */}
                <Box>
                  <DocSection id={id} patient={patient} />
                </Box>
              </Card>
              <Card sx={{ padding: '2rem', marginTop: '1rem' }}>
                <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
                  Rendez-vous
                </Typography>
                <AppointmentAddForm firstName={patient.firstName} lastName={patient.lastName} />
              </Card>
            </Grid>
          )}
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
