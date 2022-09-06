import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, forwardRef, useEffect } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { doc, collection, addDoc, updateDoc, getDocs, serverTimestamp } from '@firebase/firestore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  ArticleOutlined,
  BadgeOutlined,
  DescriptionOutlined,
  MedicalInformationOutlined,
  WorkOutlined,
} from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Ordonance from '../documents/Ordonance';
import { db } from '../../firebase-config';
import ArretTravail from '../documents/ArretTravail';
import CertificatMedical from '../documents/CertificatMedical';
import Bilan from '../documents/Bilan';
import Orientation from '../documents/Orientation';
import BilanSelect from '../hook-form/BilanSelect';

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const BilanList = [
  'FNS',
  'TP',
  'INR',
  'TCK',
  'VS',
  'CRP',
  'Ionogramme',
  'Mg',
  'Calcémie',
  'Phosphorémie',
  'PTH',
  'TSH, T3, T4',
  'HDL, LDL',
  'Cholestérol T, TG',
  'Urée',
  'Créatinine',
  'TGO, TGO',
  'GT',
  'PAL',
  'Electrophorèse des proteines',
  'FAN',
  'LDH',
  'CPK',
];
function DocSection({ id, patient }) {
  const [modalType, setModalType] = useState('');
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [age, setAge] = useState(0);

  const [drugList, setDrugList] = useState([]);
  useEffect(() => setAge(Math.floor((new Date() - patient.dateOfBirth.toDate().getTime()) / 3.15576e10)), []);
  // Orientation
  const [orientationDetails, setOrientationDetails] = useState('');

  // Certificat medical
  const [certifMedicalDetails, setCertifMedicalDetails] = useState('');

  // Arret de travail
  const [arretTravailType, setArretTravailType] = useState('');
  const [arretTravailFrom, setArretTravailFrom] = useState('');
  const [arretTravailPeriod, setArretTravailPeriod] = useState('');
  const [arretTravailTo, setArretTravailTo] = useState('');
  const [arretTravailSortie, setArretTravailSortie] = useState(false);
  // bilan
  const [bilan, setBilan] = useState([{ svp: '', isOther: false }]);
  const [number, setNumber] = useState(0);
  const addBilanField = () => setBilan([...bilan, { svp: '', isOther: false }]);

  const removeBilanField = (index) => {
    const rows = [...bilan];
    rows.splice(index, 1);
    setBilan(rows);
  };
  const handleBilanChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...bilan];
    list[index][name] = value;
    setBilan(list);
    console.log(bilan);
  };
  useEffect(() => {
    const getPatients = async () => {
      const data = await getDocs(collection(db, 'drugs'));
      console.log(data.docs);
      setDrugList(data.docs.map((doc) => doc.data().drugDesc));
    };
    getPatients();
  }, []);

  useEffect(() => {
    const getOrdonances = async () => {
      const data = await getDocs(collection(db, 'ordonances'));
      setNumber(data.docs.length + 1);
    };
    getOrdonances();
  }, []);

  // ordonance
  const [ordonance, setOrdonance] = useState([{ drugName: '', rate: '', duration: '' }]);
  const addOrdonanceField = () => setOrdonance([...ordonance, { drugName: '', rate: '', duration: '' }]);
  const removeOrdonanceField = (index) => {
    const rows = [...ordonance];
    rows.splice(index, 1);
    setOrdonance(rows);
  };
  const handleOrdonanceChange = (index, e) => {
    const { name, value } = e.target;
    // console.log(e);
    const list = [...ordonance];
    list[index][name] = value;
    setOrdonance(list);
    console.log(e);
  };
  const handleDrugNameChange = (index, e, value) => {
    // console.log(e);
    const { nVal } = e.target;
    console.log(e);
    const list = [...ordonance];
    const name = 'drugName';
    list[index][name] = value;
    setOrdonance(list);
  };

  const handleSVPChange = (index, e, value) => {
    // console.log(e);
    const { nVal } = e.target;
    console.log(e);
    const list = [...bilan];
    const name = 'svp';
    list[index][name] = value;
    setBilan(list);
  };

  const handleTypeChange = (index, e) => {
    const { checked, name } = e.target;
    console.log(e);
    const list = [...bilan];
    list[index][name] = checked;
    setBilan(list);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const sampleModal = (e, v) => {
    console.log('event: ', e, 'value: ', v);
    console.log(ordonance);
  };
  let render;
  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = (type) => {
    setModalOpen(true);
    setModalType(type);
  };

  const handleAddTreatment = async () => {
    try {
      // console.log(ordonance);

      await addDoc(collection(db, 'ordonances'), {
        number,
        firstName: patient.firstName,
        lastName: patient.lastName,
        date: serverTimestamp(),
        age,
        gender: patient.gender,
        address: patient.address,
        treatments: ordonance,
      });

      setFeedback('Ordonance added!');
      setIsError(false);
      setOpen(true);
    } catch (err) {
      console.log(err);
      setFeedback('a Problem accured!');
      setIsError(true);
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'ordonance':
        return (
          <>
            <Typography id="modal-modal-title" variant="h4" style={{ textAlign: 'center' }} component="h2">
              Ordonance
            </Typography>
            <Stack spacing={3} style={{ marginTop: '1rem' }}>
              {ordonance.map((data, index) => {
                const { drugName, duration, rate } = data;
                return (
                  <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '.4rem' }}>
                    <FormControl fullWidth>
                      <Autocomplete
                        disablePortal
                        value={drugName}
                        onChange={(e, value) => handleDrugNameChange(index, e, value)}
                        options={drugList}
                        // sx={{ width: 300 }}
                        defaultValue={''}
                        renderInput={(params) => <TextField name="drugName" {...params} label="Médicament" />}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        name="duration"
                        label="Duration"
                        value={duration}
                        onChange={(e) => handleOrdonanceChange(index, e)}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        name="rate"
                        label="Rate"
                        value={rate}
                        onChange={(e) => handleOrdonanceChange(index, e)}
                      />
                    </FormControl>

                    {ordonance.length !== 1 && (
                      <IconButton aria-label="delete" size="large" onClick={removeOrdonanceField}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                );
              })}
              <Box>
                <IconButton aria-label="add" size="large" onClick={addOrdonanceField}>
                  <AddCircleIcon />
                </IconButton>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button size="large" color="warning" variant="contained" onClick={handleAddTreatment}>
                  Save
                </Button>
                <PDFDownloadLink
                  document={
                    <Ordonance
                      firstName={patient.firstName}
                      lastName={patient.lastName}
                      age={age}
                      gender={patient.gender}
                      address={patient.address}
                      ordonance={ordonance}
                      number={number}
                    />
                  }
                  fileName="ordonance"
                >
                  {({ loading, error }) =>
                    loading ? (
                      <Button size="large" variant="contained">
                        chargement...
                      </Button>
                    ) : (
                      <Button size="large" variant="contained">
                        Telecharger
                      </Button>
                    )
                  }
                </PDFDownloadLink>
              </Stack>
            </Stack>
          </>
        );
      case 'arretTravail':
        return (
          <>
            <Typography id="modal-modal-title" variant="h4" style={{ textAlign: 'center' }} component="h2">
              Arret de travail
            </Typography>
            <Stack spacing={3} style={{ marginTop: '1rem' }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={arretTravailType} label="type" onChange={(e) => setArretTravailType(e.target.value)}>
                  <MenuItem value={'arret-travail'}>Arret de travail</MenuItem>
                  <MenuItem value={'prolongation'}>Prolongation</MenuItem>
                  <MenuItem value={'reprise'}>Reprise</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  name="arret-travail-period"
                  label="Période"
                  value={arretTravailPeriod}
                  onChange={(e) => setArretTravailPeriod(e.target.value)}
                />
              </FormControl>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '1rem' }}>
                <FormControl fullWidth>
                  <TextField
                    name="arret-travail-from"
                    label="Du"
                    value={arretTravailFrom}
                    onChange={(e) => setArretTravailFrom(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    name="arret-travail-from"
                    label="Au"
                    value={arretTravailTo}
                    onChange={(e) => setArretTravailTo(e.target.value)}
                  />
                </FormControl>
              </Stack>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={arretTravailSortie}
                      onChange={(e) => setArretTravailSortie(e.target.checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Sortie Authorisé"
                />
              </FormGroup>
              <PDFDownloadLink
                document={
                  <ArretTravail
                    firstName={patient.firstName}
                    lastName={patient.lastName}
                    dateOfBirth={patient.dateOfBirth}
                    type={arretTravailType}
                    from={arretTravailFrom}
                    to={arretTravailTo}
                    period={arretTravailPeriod}
                    sortie={arretTravailSortie}
                  />
                }
                fileName="arret-travail"
              >
                {({ loading, error }) =>
                  loading ? (
                    <Button size="large" variant="contained">
                      chargement...
                    </Button>
                  ) : (
                    <Button size="large" variant="contained">
                      Telecharger
                    </Button>
                  )
                }
              </PDFDownloadLink>
            </Stack>
          </>
        );
      case 'bilan':
        return (
          <>
            <Typography id="modal-modal-title" variant="h4" style={{ textAlign: 'center' }} component="h2">
              Bilan
            </Typography>
            <Stack spacing={3} style={{ marginTop: '1rem' }}>
              {bilan.map((data, index) => {
                const { svp, isOther } = data;
                return (
                  <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '.4rem' }}>
                    <FormControl fullWidth>
                      {/* <TextField
                        name="svp"
                        label="Bilan SVP"
                        aria-label="maximum height"
                        onChange={(e) => handleBilanChange(index, e)}
                      /> */}
                      {/* <FormControl fullWidth> */}
                      {isOther ? (
                        <TextField
                          name="svp"
                          label="Bilan SVP"
                          value={svp}
                          onChange={(e) => handleBilanChange(index, e)}
                        />
                      ) : (
                        <Autocomplete
                          disablePortal
                          value={svp}
                          onChange={(e, value) => handleSVPChange(index, e, value)}
                          options={BilanList}
                          // sx={{ width: 300 }}
                          defaultValue={''}
                          renderInput={(params) => <TextField name="svp" {...params} label="Bilan" />}
                        />
                      )}
                    </FormControl>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isOther}
                            onChange={(e) => handleTypeChange(index, e)}
                            name="isOther"
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        }
                        label="Autre"
                      />
                    </FormGroup>
                    {/* </FormControl> */}
                    {/* <Select
                        defaultValue="FNS"
                        name="svp"
                        value={svp}
                        label="Bilan SVP"
                        onChange={(e) => handleBilanChange(index, e)}
                      >
                        {BilanList.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select> */}

                    {bilan.length !== 1 && (
                      <IconButton aria-label="delete" size="large" onClick={removeBilanField}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                );
              })}
              <Box>
                <IconButton aria-label="add" size="large" onClick={addBilanField}>
                  <AddCircleIcon />
                </IconButton>
              </Box>

              <PDFDownloadLink
                document={<Bilan firstName={patient.firstName} lastName={patient.lastName} age={age} bilan={bilan} />}
                fileName="bilan"
              >
                {({ loading, error }) =>
                  loading ? (
                    <Button size="large" variant="contained">
                      chargement...
                    </Button>
                  ) : (
                    <Button size="large" variant="contained">
                      Telecharger
                    </Button>
                  )
                }
              </PDFDownloadLink>
            </Stack>
          </>
        );
      case 'orientation':
        return (
          <>
            <Typography id="modal-modal-title" variant="h4" style={{ textAlign: 'center' }} component="h2">
              Orientation
            </Typography>
            <Stack spacing={3} style={{ marginTop: '1rem' }}>
              <FormControl>
                <TextField
                  name="orientation-details"
                  multiline
                  rows={4}
                  label="Details d'orientation"
                  aria-label="maximum height"
                  value={orientationDetails}
                  onChange={(e) => setOrientationDetails(e.target.value)}
                />
              </FormControl>
              <PDFDownloadLink
                document={
                  <Orientation
                    firstName={patient.firstName}
                    lastName={patient.lastName}
                    age={age}
                    details={orientationDetails}
                  />
                }
                fileName="orientation"
              >
                {({ loading, error }) =>
                  loading ? (
                    <Button size="large" variant="contained">
                      chargement...
                    </Button>
                  ) : (
                    <Button size="large" variant="contained">
                      Telecharger
                    </Button>
                  )
                }
              </PDFDownloadLink>
            </Stack>
          </>
        );
      case 'certificatMedical':
        return (
          <>
            <Typography id="modal-modal-title" variant="h4" style={{ textAlign: 'center' }} component="h2">
              Cértificat Médical
            </Typography>
            <Stack spacing={3} style={{ marginTop: '1rem' }}>
              <FormControl>
                <TextField
                  name="certif-details"
                  multiline
                  rows={4}
                  label="Details de cértificat"
                  aria-label="maximum height"
                  value={certifMedicalDetails}
                  onChange={(e) => setCertifMedicalDetails(e.target.value)}
                />
              </FormControl>
              <PDFDownloadLink
                document={
                  <CertificatMedical
                    firstName={patient.firstName}
                    lastName={patient.lastName}
                    dateOfBirth={patient.dateOfBirth}
                    details={certifMedicalDetails}
                  />
                }
                fileName="certif-medical"
              >
                {({ loading, error }) =>
                  loading ? (
                    <Button size="large" variant="contained">
                      chargement...
                    </Button>
                  ) : (
                    <Button size="large" variant="contained">
                      Telecharger
                    </Button>
                  )
                }
              </PDFDownloadLink>
            </Stack>
          </>
        );
      default:
        return (
          <>
            <Typography id="modal-modal-title" variant="h4" style={{ textAlign: 'center' }} component="h2">
              Ordonance
            </Typography>
            <Stack spacing={3} style={{ marginTop: '1rem' }}>
              <FormControl>
                <TextField
                  name="certif-details"
                  multiline
                  rows={4}
                  label="Details de cértificat"
                  aria-label="maximum height"
                  value={certifMedicalDetails}
                  onChange={(e) => setCertifMedicalDetails(e.target.value)}
                />
              </FormControl>
              <PDFDownloadLink
                document={
                  <CertificatMedical
                    firstName={patient.firstName}
                    lastName={patient.lastName}
                    dateOfBirth={patient.dateOfBirth}
                    details={certifMedicalDetails}
                  />
                }
                fileName="certif-medical"
              >
                {({ loading, error }) =>
                  loading ? (
                    <Button size="large" variant="contained">
                      chargement...
                    </Button>
                  ) : (
                    <Button size="large" variant="contained">
                      Telecharger
                    </Button>
                  )
                }
              </PDFDownloadLink>
            </Stack>
          </>
        );
    }
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            borderRadius: 2,
            // border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          {renderModalContent()}
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
        </Box>
      </Modal>
      <Stack
        direction={'row'}
        spacing={3}
        justifyContent="center"
        sx={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}
      >
        <Tooltip title="Ordonnance">
          <IconButton color="primary" size="small" onClick={() => handleModalOpen('ordonance')}>
            <ArticleOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bilan">
          <IconButton color="primary" size="small" onClick={() => handleModalOpen('bilan')}>
            <DescriptionOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Orientation">
          <IconButton color="primary" size="small" onClick={() => handleModalOpen('orientation')}>
            <BadgeOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Certificat d'arret travail">
          <IconButton color="primary" size="small" onClick={() => handleModalOpen('arretTravail')}>
            <WorkOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Certificat medical">
          <IconButton color="primary" size="small" onClick={() => handleModalOpen('certificatMedical')}>
            <MedicalInformationOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        {/* <PDFDownloadLink document={<Ordonance />} fileName="something">
          {({ loading, error }) => (loading ? <button>Loading...</button> : <button>download</button>)}
        </PDFDownloadLink> */}
      </Stack>
    </>
  );
}

export default DocSection;
