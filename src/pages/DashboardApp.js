import { forwardRef, useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getDocs, collection, addDoc, updateDoc, doc } from '@firebase/firestore';
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
// ----------------------------------------------------------------------

const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

export default function DashboardApp() {
  const theme = useTheme();
  const [drugList, setDrugList] = useState([]);
  const [newDrug, setNewDrug] = useState('');

  const [consultationPrice, setConsultationPrice] = useState(0);
  const [eegPrice, setEegPrice] = useState(0);
  const [emgPrice, setEmgPrice] = useState(0);
  const [id, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const getPatients = async () => {
      const data = await getDocs(collection(db, 'drugs'));
      const drugArr = data.docs.map((doc) => doc.data().drugDesc);
      console.log(drugArr);
      setDrugList(drugArr);
    };
    getPatients();
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
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
