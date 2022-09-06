import React, { useEffect, useState } from 'react';
import { Page, Text, Image, Document, StyleSheet } from '@react-pdf/renderer';
import check from './check.png';
import Template from './arrettravail.png';

function ArretTravail({ firstName, lastName, dateOfBirth, type, from, to, sortie, period }) {
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
        {/* <Text style={{ position: 'absolute', top: 82, left: 473, fontSize: 13, fontWeight: 'bold' }}>{date}</Text> */}
        <Text style={{ position: 'absolute', top: 193, left: 472, fontSize: 13, fontWeight: 'bold' }}>{date}</Text>
        <Text style={{ position: 'absolute', top: 310, left: 110, fontSize: 13, fontWeight: 'bold' }}>{lastName}</Text>
        <Text style={{ position: 'absolute', top: 341, left: 131, fontSize: 13, fontWeight: 'bold' }}>{firstName}</Text>

        <Text style={{ position: 'absolute', top: 374, left: 142, fontSize: 13, fontWeight: 'bold' }}>
          {dateOfBirth.toDate().getDay()}
        </Text>
        <Text style={{ position: 'absolute', top: 374, left: 176, fontSize: 13, fontWeight: 'bold' }}>
          {dateOfBirth.toDate().getMonth()}
        </Text>
        <Text style={{ position: 'absolute', top: 374, left: 210, fontSize: 13, fontWeight: 'bold' }}>
          {dateOfBirth.toDate().getFullYear()}
        </Text>
        {type === 'arret-travail' && (
          <>
            <Text style={{ position: 'absolute', top: 468, left: 267, fontSize: 13, fontWeight: 'bold' }}>
              {period}
            </Text>
            <Text style={{ position: 'absolute', top: 489, left: 218, fontSize: 13, fontWeight: 'bold' }}>{from}</Text>
            <Text style={{ position: 'absolute', top: 489, left: 366, fontSize: 13, fontWeight: 'bold' }}>{to}</Text>
            <Text style={{ position: 'absolute', top: 526, left: 234, fontSize: 13, fontWeight: 'bold' }}>
              {sortie ? 'Authorisés' : 'Non Authorisés'}
            </Text>
            <Image src={check} style={{ position: 'absolute', top: 474, left: 86, width: 16, height: 16 }} />
          </>
        )}

        {type === 'prolongation' && (
          <>
            <Text style={{ position: 'absolute', top: 578, left: 389, fontSize: 13, fontWeight: 'bold' }}>
              {period}
            </Text>
            <Text style={{ position: 'absolute', top: 599, left: 221, fontSize: 13, fontWeight: 'bold' }}>{from}</Text>
            <Text style={{ position: 'absolute', top: 599, left: 368, fontSize: 13, fontWeight: 'bold' }}>{to}</Text>
            <Text style={{ position: 'absolute', top: 636, left: 234, fontSize: 13, fontWeight: 'bold' }}>
              {sortie ? 'Authorisés' : 'Non Authorisés'}
            </Text>
            <Image src={check} style={{ position: 'absolute', top: 580, left: 86, width: 16, height: 16 }} />
          </>
        )}
        {type === 'reprise' && (
          <Image src={check} style={{ position: 'absolute', top: 680, left: 86, width: 16, height: 16 }} />
        )}
      </Page>
    </Document>
  );
}

export default ArretTravail;
