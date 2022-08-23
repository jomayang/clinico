import * as Yup from 'yup';
import { useState, forwardRef } from 'react';
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

import { collection, addDoc } from '@firebase/firestore';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import RHFSelect from '../../../components/hook-form/RHFSelect';
import { db } from '../../../firebase-config';
// ----------------------------------------------------------------------

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function PatientAddForm() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(''); // prenom
  const [lastName, setLastName] = useState(''); // nom
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [insurance, setInsurance] = useState('');
  const [pattern, setPattern] = useState(''); // motif
  const [clinicalExam, setClinicalExam] = useState('');
  const [complementaryExam, setComplementaryExam] = useState('');
  const [images, setImages] = useState([]);
  const [EEG, setEEG] = useState(false);
  const [EMG, setEMG] = useState(false);
  const [patients, setPatients] = useState([]);
  const [identifier, setIdentifier] = useState('');
  const patientsCollectionRef = collection(db, 'patients');

  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');
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

  const createPatient = async () => {
    try {
      const { id } = await addDoc(patientsCollectionRef, {
        firstName,
        lastName,
        gender,
        insurance,
        dateOfBirth,
        address,
        phone,
        payed: 0,
        credit: 0,
      });
      // console.log(sample.id);
      setIdentifier(id);
      setFeedback('Patient added!');

      // Reinitialize form
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setGender('');
      setAddress('');
      setPhone('');
      setInsurance('');

      setOpen(true);
    } catch (error) {
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '1rem' }}>
            <FormControl fullWidth>
              <TextField name="nom" label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                name="prenom"
                label="Prenom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select value={gender} label="Genre" onChange={(e) => setGender(e.target.value)}>
                <MenuItem value={'male'}>Male</MenuItem>
                <MenuItem value={'female'}>Female</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <DesktopDatePicker
                label="Date de naissance"
                inputFormat="MM/dd/yyyy"
                value={dateOfBirth}
                onChange={(newDate) => setDateOfBirth(newDate)}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Assurance</InputLabel>
              <Select value={insurance} label="Assurance" onChange={(e) => setInsurance(e.target.value)}>
                <MenuItem value={'cnas'}>CNAS</MenuItem>
                <MenuItem value={'casnos'}>CASNOS</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <TextField name="tel" label="Numero Telephone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>
          </Stack>

          <FormControl>
            <TextField name="adresse" label="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
          </FormControl>

          <Button fullWidth size="large" onClick={createPatient} variant="contained">
            Ajouter Patient
          </Button>
        </Stack>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={isError ? 'error' : 'success'} sx={{ width: '100%' }}>
            {feedback} {!isError && <Link to={`/dashboard/patient/${identifier}`}>(click here)</Link>}
          </Alert>
        </Snackbar>
      </form>
    </LocalizationProvider>
  );
}
