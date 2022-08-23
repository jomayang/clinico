import * as Yup from 'yup';
import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { collection, addDoc } from '@firebase/firestore';
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
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { db } from '../../../firebase-config';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import RHFSelect from '../../../components/hook-form/RHFSelect';

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// ----------------------------------------------------------------------

export default function AppointmentAddForm({ firstName, lastName }) {
  const navigate = useNavigate();

  const [appointmentDate, setAppointmentDate] = useState('');

  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const appointmentsCollectionRef = collection(db, 'appointments');
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

  const createAppointment = async () => {
    try {
      await addDoc(appointmentsCollectionRef, {
        firstName,
        lastName,
        date: appointmentDate,
      });
      setFeedback('Appointment added!');
      setOpen(true);
    } catch (error) {
      setFeedback('a Problem accured when adding appointment!');
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
          <FormControl fullWidth>
            <DateTimePicker
              label="Date de naissance"
              value={appointmentDate}
              onChange={(newDate) => setAppointmentDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>

          <Button fullWidth size="large" onClick={createAppointment} variant="contained">
            Ajouter Rendez-vous
          </Button>
        </Stack>
      </form>
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
    </LocalizationProvider>
  );
}
