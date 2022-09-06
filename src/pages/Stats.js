// import { faker } from '@faker-js/faker';
// @mui
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { query, getDocs, collection } from '@firebase/firestore';
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

export default function Stats() {
  const theme = useTheme();

  const [numberOfPatients, setNumberOfPatients] = useState(0);
  const [patients, setPatients] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [credit, setCredit] = useState(0);
  const [total, setTotal] = useState(0);
  const [creditRate, setCreditRate] = useState(0);
  const [revenueLastMonth, setRevenueLastMonth] = useState(0);
  const [patientsPerDay, setPatientsPerDay] = useState(0);
  const [diagnosisStats, setDiagnosisStats] = useState([{ label: 'Nothing', value: 0 }]);
  const query = collection(db, 'patients');
  useEffect(() => {
    const getPatients = async () => {
      const data = await getDocs(collection(db, 'patients'));
      console.log(data.docs);
      setPatients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setNumberOfPatients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).length);

      const avcCount = data.docs.filter((doc) => doc.data().diagnosis && doc.data().diagnosis.includes('AVC')).length;
      const epilepsieCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Epilepsie')
      ).length;
      const sepCount = data.docs.filter((doc) => doc.data().diagnosis && doc.data().diagnosis.includes('SEP')).length;
      const neuroVascCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Neuro Vascularite')
      ).length;
      const neuroPathieCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Neuropathie')
      ).length;
      const myopathieCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Myopathie')
      ).length;
      const demenceCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Démence')
      ).length;
      const parkinsonCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Maladie de Parkinson')
      ).length;
      const pyramidalCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Syndrome extra pyramidal')
      ).length;
      const myasthCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Myasthénie')
      ).length;
      const troubleSommCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Trouble du sommeil')
      ).length;
      const neuroDegenCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Maladie neuro dégénérative')
      ).length;
      const psychoSomaCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Trouble psycho somatique')
      ).length;
      const vertigeCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Vertige')
      ).length;
      const rhumatoCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Rhumatologique')
      ).length;
      const orthopeCount = data.docs.filter(
        (doc) => doc.data().diagnosis && doc.data().diagnosis.includes('Orthopédique')
      ).length;
      const eegCount = data.docs.filter((doc) => doc.data().diagnosis && doc.data().diagnosis.includes('EEG')).length;
      const emgCount = data.docs.filter((doc) => doc.data().diagnosis && doc.data().diagnosis.includes('EMG')).length;
      const otherCount = data.docs.filter((doc) => !doc.data().diagnosis || doc.data().diagnosis.length === 0).length;

      const diagnosisStatList = [];

      if (avcCount !== 0) diagnosisStatList.push({ label: 'AVC', value: avcCount });
      if (epilepsieCount !== 0) diagnosisStatList.push({ label: 'Epilepsie', value: epilepsieCount });
      if (sepCount !== 0) diagnosisStatList.push({ label: 'SEP', value: sepCount });
      if (neuroVascCount !== 0) diagnosisStatList.push({ label: 'Neuro Vascularite', value: neuroVascCount });
      if (neuroPathieCount !== 0) diagnosisStatList.push({ label: 'Neuropathie', value: neuroPathieCount });
      if (myopathieCount !== 0) diagnosisStatList.push({ label: 'Myopathie', value: myopathieCount });
      if (demenceCount !== 0) diagnosisStatList.push({ label: 'Démence', value: demenceCount });
      if (parkinsonCount !== 0) diagnosisStatList.push({ label: 'Maladie de Parkinson', value: parkinsonCount });
      if (myasthCount !== 0) diagnosisStatList.push({ label: 'Myasthénie', value: myasthCount });
      if (pyramidalCount !== 0) diagnosisStatList.push({ label: 'Syndrome extra pyramidal', value: pyramidalCount });
      if (troubleSommCount !== 0) diagnosisStatList.push({ label: 'Trouble du sommeil', value: troubleSommCount });
      if (neuroDegenCount !== 0)
        diagnosisStatList.push({ label: 'Maladie neuro dégénérative', value: neuroDegenCount });
      if (psychoSomaCount !== 0) diagnosisStatList.push({ label: 'Trouble psycho somatique', value: psychoSomaCount });
      if (vertigeCount !== 0) diagnosisStatList.push({ label: 'Vertige', value: vertigeCount });
      if (rhumatoCount !== 0) diagnosisStatList.push({ label: 'Rhumatologique', value: rhumatoCount });
      if (orthopeCount !== 0) diagnosisStatList.push({ label: 'Orthopédique', value: orthopeCount });
      if (eegCount !== 0) diagnosisStatList.push({ label: 'EEG', value: eegCount });
      if (emgCount !== 0) diagnosisStatList.push({ label: 'EMG', value: emgCount });
      if (otherCount !== 0) diagnosisStatList.push({ label: 'Autre', value: otherCount });

      setDiagnosisStats(diagnosisStatList);
    };
    getPatients();
  }, []);

  useEffect(() => {
    const getPayments = async () => {
      const data = await getDocs(collection(db, 'payments'));

      // Credit Rate
      const payments = data.docs.map((doc) => doc.data().payed);
      const credits = data.docs.map((doc) => doc.data().credit);
      const revenue = payments.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      const totalCredit = credits.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
      const expectedRevenue = revenue + totalCredit;

      setRevenue(revenue);
      setCredit(totalCredit);
      setTotal(expectedRevenue);
      setCreditRate(totalCredit / expectedRevenue);

      const currentDate = new Date();
      const lastMonth = currentDate.getMonth();
      console.log(lastMonth);
      const months = data.docs.map((doc) => {
        const date = doc.data().date.toDate();
        return date.getMonth();
      });
      const paymentsLastMonth = data.docs
        .filter((doc) => doc.data().date.toDate().getMonth() + 1 === lastMonth)
        .map((doc) => doc.data().payed);
      // const paymentsLastMonth = data.docs.map((doc) => doc.data().date);
      // console.log('payments last month: ', paymentsLastMonth);
      const paymentsLastMonthCount = paymentsLastMonth.length;
      setPatientsPerDay(paymentsLastMonthCount / 24);
      const revenueLastMonth = paymentsLastMonth.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      );
      setRevenueLastMonth(revenueLastMonth);
      // console.log('payments last month: ', months);
      // console.log(paymentsLastMonth);
    };
    getPayments();
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        {/* <Typography></Typography> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="revenus le mois dernier"
              total={revenueLastMonth}
              currency="DA"
              icon={'ant-design:bank-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="nombre de Patients"
              total={numberOfPatients}
              color="info"
              icon={'ant-design:container-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="patients par jour"
              total={patientsPerDay}
              color="warning"
              icon={'ant-design:medicine-box-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="revenu total"
              total={revenue}
              currency="DA"
              color="error"
              icon={'ant-design:euro-circle-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Taux de crédit"
              chartData={[
                { label: 'Payments', value: revenue },
                { label: 'Credit', value: credit },
              ]}
              chartColors={[
                theme.palette.primary.main,
                // theme.palette.chart.blue[0],
                // theme.palette.chart.violet[0],
                theme.palette.chart.red[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Patients par diagnostique"
              // subheader="(+43%) than last year"
              chartData={diagnosisStats}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
