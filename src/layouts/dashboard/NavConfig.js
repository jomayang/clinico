// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'patient',
    path: '/dashboard/patient',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'calendar',
    path: '/dashboard/calendar',
    icon: getIcon('eva:calendar-fill'),
  },
  {
    title: 'payments',
    path: '/dashboard/payment',
    icon: getIcon('eva:credit-card-fill'),
  },
  {
    title: 'stats',
    path: '/dashboard/stats',
    icon: getIcon('eva:activity-fill'),
  },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
