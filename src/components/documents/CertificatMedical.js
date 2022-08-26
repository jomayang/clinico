import React, { useEffect, useState } from 'react';
import { Page, Text, Image, Document, StyleSheet } from '@react-pdf/renderer';
import Template from './certifmedical.png';

function CertificatMedical({ firstName, lastName, dateOfBirth, details }) {
  const [date, setDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    setDate(`${dd}/${mm}/${yyyy}`);
  }, []);
  return (
    <Document>
      <Page size="A4">
        <Image style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} src={Template} />
        <Text style={{ position: 'absolute', top: 82, left: 473, fontSize: 13, fontWeight: 'bold' }}>{date}</Text>

        <Text style={{ position: 'absolute', top: 306, left: 112, fontSize: 13, fontWeight: 'bold' }}>{lastName}</Text>
        <Text style={{ position: 'absolute', top: 337, left: 133, fontSize: 13, fontWeight: 'bold' }}>{firstName}</Text>

        <Text style={{ position: 'absolute', top: 370, left: 142, fontSize: 13, fontWeight: 'bold' }}>
          {dateOfBirth.toDate().getDay()}
        </Text>
        <Text style={{ position: 'absolute', top: 370, left: 176, fontSize: 13, fontWeight: 'bold' }}>
          {dateOfBirth.toDate().getMonth()}
        </Text>
        <Text style={{ position: 'absolute', top: 370, left: 210, fontSize: 13, fontWeight: 'bold' }}>
          {dateOfBirth.toDate().getFullYear()}
        </Text>
        <Text
          style={{
            position: 'absolute',
            top: 462,
            left: 72,
            right: 72,
            lineHeight: 1.5,
            fontSize: 14,
            textOverflow: 'wrap',
            fontWeight: 'bold',
          }}
        >
          {details}
        </Text>
      </Page>
    </Document>
  );
}

export default CertificatMedical;
