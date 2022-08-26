import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { MenuItem, Select } from '@mui/material';

// ----------------------------------------------------------------------
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
BilanSelect.propTypes = {
  name: PropTypes.string,
};

export default function BilanSelect({ name, ...other }) {
  const { control } = useFormContext();

  return <></>;
}
