// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export const adminNavConfig = [
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
  {
    title: 'Roles',
    path: '/admin/roles',
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'Archieve',
    path: '/admin/archieve',
    icon: getIcon('eva:archive-outline'),
  },
];

export const doctorNavConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
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
];

export const receptionistNavConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
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
];

// export default { adminNavConfig, doctorNavConfig, receptionistNavConfig };
