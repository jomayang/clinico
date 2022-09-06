import { useRef, useState, forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// component
import { doc, updateDoc } from '@firebase/firestore';
import Iconify from '../../../components/Iconify';
import { db } from '../../../firebase-config';

// ----------------------------------------------------------------------
const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RoleMoreMenu({ id }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChangeRole = async (newRole) => {
    try {
      const appointmentDoc = doc(db, 'users', id);
      await updateDoc(appointmentDoc, {
        role: newRole,
      });
      setFeedback('role changed successfully');
      setOpen(true);
    } catch (error) {
      setFeedback('a Problem accured!');
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
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => handleChangeRole('admin')}>
          <ListItemIcon>
            <Iconify icon="eva:options-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Admin" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => handleChangeRole('doctor')}>
          <ListItemIcon>
            <Iconify icon="eva:heart-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Doctor" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => handleChangeRole('receptionist')}>
          <ListItemIcon>
            <Iconify icon="eva:people-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Receptionist" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
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
    </>
  );
}
