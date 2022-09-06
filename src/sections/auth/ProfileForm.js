import * as Yup from 'yup';
import { useState, forwardRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Stack,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  TextareaAutosize,
  Button,
  Snackbar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { collection, getDocs, addDoc, updateDoc, doc, where, query } from '@firebase/firestore';
import Iconify from '../../components/Iconify';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import RHFSelect from '../../components/hook-form/RHFSelect';
import { db } from '../../firebase-config';
import { useAuth } from '../../contexts/AuthContext';
// ----------------------------------------------------------------------

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ProfileForm() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(''); // prenom
  const [lastName, setLastName] = useState(''); // nom
  const [avatar, setAvatar] = useState('');

  const patientsCollectionRef = collection(db, 'users');

  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');

  const { currentUser } = useAuth();
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', currentUser.email));

  const RegisterSchema = Yup.object().shape({
    // nom: Yup.string().required('First name required'),
    // prenom: Yup.string().required('Last name required'),
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    // nom: '',
    // prenom: '',
    // email: '',
    // password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    const getProfile = async () => {
      const data = await getDocs(q);
      const profiles = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const fname = profiles[0].firstName ? profiles[0].firstName : '';
      const lname = profiles[0].lastName ? profiles[0].lastName : '';
      setFirstName(fname);
      setLastName(lname);
    };
    getProfile();
  }, []);
  const createProfile = async () => {
    try {
      const data = await getDocs(q);
      // console.log(data.docs.data());
      const ids = data.docs.map((doc) => ({ id: doc.id }));
      const profileId = ids[0].id;

      await updateDoc(doc(db, 'users', profileId), {
        firstName,
        lastName,
      });
      setFeedback('User Updated');
      // const { id } = await addDoc(patientsCollectionRef, {
      //   firstName,
      //   lastName,
      //   gender,
      //   insurance,
      //   dateOfBirth,
      //   address,
      //   phone,
      //   payed: 0,
      //   credit: 0,
      // });
      // // console.log(sample.id);
      // setIdentifier(id);
      // setFeedback('Patient added!');

      // // Reinitialize form
      // setFirstName('');
      // setLastName('');
      // setDateOfBirth('');
      // setGender('');
      // setAddress('');
      // setPhone('');
      // setInsurance('');

      // setOpen(true);
    } catch (error) {
      console.log(error);
      setFeedback('a Problem accured when adding Patient!');
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form>
        <Stack spacing={3}>
          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '1rem' }}> */}
          <FormControl fullWidth>
            <TextField name="nom" label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormControl>
          <FormControl fullWidth>
            <TextField name="prenom" label="Prenom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormControl>
          {/* </Stack> */}

          <FormControl>
            <TextField name="avatar" label="Avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
          </FormControl>

          <Button fullWidth size="large" onClick={createProfile} variant="contained">
            Save
          </Button>
        </Stack>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={isError ? 'error' : 'success'} sx={{ width: '100%' }}>
            {feedback}
            {/*  {!isError && <Link to={`/dashboard/patient/${identifier}`}>(click here)</Link>} */}
          </Alert>
        </Snackbar>
      </form>
    </LocalizationProvider>
  );
}
