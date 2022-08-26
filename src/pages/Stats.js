import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
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

// ----------------------------------------------------------------------

export default function Stats() {
  const theme = useTheme();

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
              total={714000}
              currency="DA"
              icon={'ant-design:bank-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="nombre de Patients"
              total={135}
              color="info"
              icon={'ant-design:container-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="patients par jour"
              total={17}
              color="warning"
              icon={'ant-design:medicine-box-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="revenu total"
              total={3320000}
              currency="DA"
              color="error"
              icon={'ant-design:euro-circle-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Taux de crédit"
              chartData={[
                { label: 'Payments', value: 4344 },
                { label: 'Credit', value: 5435 },
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
              chartData={[
                { label: 'type 9', value: 1380 },
                { label: 'type 8', value: 1200 },
                { label: 'type 7', value: 1100 },
                { label: 'type 6', value: 690 },
                { label: 'type 5', value: 580 },
                { label: 'type 4', value: 540 },
                { label: 'type 3', value: 470 },
                { label: 'type 2', value: 448 },
                { label: 'type 1', value: 430 },
                { label: 'avg', value: 400 },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
