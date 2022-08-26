import * as Yup from 'yup';
import { useState, forwardRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui

import MuiAlert, { AlertProps } from '@mui/material/Alert';
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
  FormGroup,
  Switch,
  Typography,
  FormControlLabel,
  Snackbar,
} from '@mui/material';
import { addDoc, collection, serverTimestamp, setDoc, doc, updateDoc } from '@firebase/firestore';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import RHFSelect from '../../../components/hook-form/RHFSelect';
import { db } from '../../../firebase-config';

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// ----------------------------------------------------------------------

const CONSULTATION_PRICE = 1500;
const EEG_PRICE = 12000;
const EMG_PRICE = 8000;

export default function FollowupForm({ id, firstName, lastName, diagnosisList }) {
  const navigate = useNavigate();

  const [pattern, setPattern] = useState(''); // motif
  const [clinicalExam, setClinicalExam] = useState('');
  const [complementaryExam, setComplementaryExam] = useState('');
  const [images, setImages] = useState([]);
  const [EEG, setEEG] = useState(false);
  const [EMG, setEMG] = useState(false);
  const [credit, setCredit] = useState(0);
  const [payed, setPayed] = useState(0);
  const [total, setTotal] = useState(0);
  const [isNewDiagnosis, setIsNewDiagnosis] = useState(false);

  const [diagnosisType, setDiagnosisType] = useState('');
  const [diagnosisDetails, setDiagnosisDetails] = useState('');
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

  const handleAddPatient = () => {};

  const createFollowup = async () => {
    try {
      const followupObject = isNewDiagnosis
        ? {
            pattern,
            clinicalExam,
            complementaryExam,
            EEG,
            EMG,
            images,
            consultationDate: serverTimestamp(),
            payed,
            credit,
            diagnosisType,
            diagnosisDetails,
          }
        : {
            pattern,
            clinicalExam,
            complementaryExam,
            EEG,
            EMG,
            images,
            consultationDate: serverTimestamp(),
            payed,
            credit,
          };
      await addDoc(collection(db, 'patients', id, 'folder'), followupObject);
      await addDoc(collection(db, 'payments'), {
        firstName,
        lastName,
        date: serverTimestamp(),
        payed,
        credit,
      });
      console.log(diagnosisList);
      console.log([...diagnosisList, diagnosisType]);
      if (isNewDiagnosis) {
        const diagnosisArray = [...diagnosisList, diagnosisType];
        await updateDoc(doc(db, 'patients', id), {
          diagnosis: diagnosisArray,
        });
      }
      setPayed(0);
      setCredit(0);
      setFeedback('Followup added!');
      setOpen(true);
    } catch (error) {
      console.log(error);
      setFeedback('a Problem accured when adding Followup!');
      setIsError(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  useEffect(() => {
    let total = CONSULTATION_PRICE;
    if (EEG) {
      total += EEG_PRICE;
    }
    if (EMG) {
      total += EMG_PRICE;
    }

    setTotal(total.toFixed(2));
    setCredit(+(total - payed).toFixed(2));
  }, [EEG, EMG, payed]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form>
        <Stack spacing={3}>
          <FormControl>
            <TextField name="motif" label="Motif" value={pattern} onChange={(e) => setPattern(e.target.value)} />
          </FormControl>

          <FormControl>
            <TextField
              name="examenClinique"
              multiline
              rows={4}
              label="Examen Clinique"
              aria-label="maximum height"
              value={clinicalExam}
              onChange={(e) => setClinicalExam(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <TextField
              name="examenComplementaire"
              label="Examen Complementaire"
              multiline
              rows={4}
              value={complementaryExam}
              onChange={(e) => setComplementaryExam(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <TextField name="images" label="Images" />
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={EEG}
                  onChange={(e) => setEEG(e.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="EEG"
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={EMG}
                  onChange={(e) => setEMG(e.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="EMG"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isNewDiagnosis}
                  onChange={(e) => setIsNewDiagnosis(e.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Nouveau Diagnostique"
            />
          </FormGroup>
          {isNewDiagnosis && (
            <>
              <FormControl>
                <TextField
                  name="diagnosis-type"
                  label="Type de diagnostique"
                  value={diagnosisType}
                  onChange={(e) => setDiagnosisType(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <TextField
                  name="diagnosis-details"
                  multiline
                  rows={4}
                  label="Details de diagnostique"
                  aria-label="maximum height"
                  value={diagnosisDetails}
                  onChange={(e) => setDiagnosisDetails(e.target.value)}
                />
              </FormControl>
            </>
          )}
          <hr />
          <FormControl>
            <TextField name="payed" label="payé" value={payed} onChange={(e) => setPayed(+e.target.value)} />
          </FormControl>
          <Typography>Total: {total} DA</Typography>
          <Typography>Reste: {credit} DA</Typography>

          <Button fullWidth size="large" onClick={createFollowup} variant="contained">
            Ajouter Suivi
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
