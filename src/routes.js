import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import { collection, query, where, getDocs } from '@firebase/firestore';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import { useAuth } from './contexts/AuthContext';
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
import Profile from './pages/Profile';
import Roles from './pages/Roles';
import Archieve from './pages/Archieve';
import Settings from './pages/Settings';
import { db } from './firebase-config';

// ----------------------------------------------------------------------
const ADMIN_ROUTES = [
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
      { path: 'profile', element: <Profile /> },
      { path: 'patient/:id', element: <PatientDetails /> },
    ],
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      { path: 'roles', element: <Roles /> },
      { path: 'settings', element: <Settings /> },
      { path: 'archieve', element: <Archieve /> },
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
];

const RECEPTIONIST_ROUTES = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      // { path: 'app', element: <DashboardApp /> },
      { path: 'add-patient', element: <AddPatient /> },
      { path: 'calendar', element: <Appointments /> }, // with identifier
      { path: 'profile', element: <Profile /> },
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
];

const DOCTOR_ROUTES = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      // { path: 'app', element: <DashboardApp /> },
      { path: 'patient', element: <Patient /> },
      { path: 'add-patient', element: <AddPatient /> },
      { path: 'payment', element: <Payments /> }, // with identifier
      { path: 'calendar', element: <Appointments /> }, // with identifier
      { path: 'profile', element: <Profile /> },
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
];

const DEFAULT_ROUTES = [
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
];

export default function Router() {
  const { currentUser } = useAuth();
  const [route, setRoute] = useState([]);

  const usersRef = collection(db, 'users');
  const q = currentUser ? query(usersRef, where('email', '==', currentUser.email)) : null;

  useEffect(() => {
    const getProfile = async () => {
      if (currentUser) {
        const data = await getDocs(q);
        const profiles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const role = profiles[0].firstName ? profiles[0].role : '';

        if (role === 'admin') setRoute(ADMIN_ROUTES);
        else if (role === 'doctor') setRoute(DOCTOR_ROUTES);
        else if (role === 'receptionist') setRoute(RECEPTIONIST_ROUTES);
        else setRoute(DEFAULT_ROUTES);
      } else {
        setRoute(DEFAULT_ROUTES);
      }
    };
    getProfile();
  }, []);

  return useRoutes(route);
}
