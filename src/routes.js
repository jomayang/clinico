import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import Patient from './pages/Patient';
import AddPatient from './pages/AddPatient';
import PatientDetails from './pages/PatientDetails';
import Appointments from './pages/Appointments';
import Payments from './pages/Payments';
import Stats from './pages/Stats';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'patient', element: <Patient /> },
        { path: 'add-patient', element: <AddPatient /> },
        { path: 'products', element: <Products /> },
        { path: 'payment', element: <Payments /> },
        { path: 'blog', element: <Blog /> },
        { path: 'stats', element: <Stats /> },
        { path: 'calendar', element: <Appointments /> },
        { path: 'patient/:id', element: <PatientDetails /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
