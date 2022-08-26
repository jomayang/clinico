import {
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
import { doc, collection, addDoc, updateDoc, serverTimestamp } from '@firebase/firestore';
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

  useEffect(() => setAge(Math.floor((new Date() - patient.dateOfBirth.toDate().getTime()) / 3.15576e10)), []);
  // Orientation
  const [orientationDetails, setOrientationDetails] = useState('');

  // Certificat medical
  const [certifMedicalDetails, setCertifMedicalDetails] = useState('');

  // Arret de travail
  const [arretTravailType, setArretTravailType] = useState('');
  const [arretTravailFrom, setArretTravailFrom] = useState('');
  const [arretTravailTo, setArretTravailTo] = useState('');
  const [arretTravailSortie, setArretTravailSortie] = useState(false);

  // bilan
  const [bilan, setBilan] = useState([{ svp: '' }]);

  const addBilanField = () => setBilan([...bilan, { svp: '' }]);

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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  let render;
  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = (type) => {
    setModalOpen(true);
    setModalType(type);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'ordonance':
        return (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Ordonance
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
            <PDFDownloadLink document={<Ordonance />} fileName="ordonance">
              {({ loading, error }) => (loading ? <button>loading...</button> : <button>download</button>)}
            </PDFDownloadLink>
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
                const { svp } = data;
                return (
                  <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ marginTop: '.4rem' }}>
                    <FormControl fullWidth>
                      {/* <TextField
                        name="svp"
                        label="Bilan SVP"
                        aria-label="maximum height"
                        onChange={(e) => handleBilanChange(index, e)}
                      /> */}
                      <Select
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
                      </Select>
                    </FormControl>

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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Ordonance
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
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
        </Box>
      </Modal>
      <Stack direction={'row'} spacing={2}>
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
