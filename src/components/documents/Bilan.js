import React, { useEffect, useState } from 'react';
import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';
import Template from './bilan.png';

function Bilan({ firstName, lastName, age, bilan }) {
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
        <Text style={{ position: 'absolute', top: 161, left: 472, fontSize: 13, fontWeight: 'bold' }}>{date}</Text>

        <Text style={{ position: 'absolute', top: 189, left: 166, fontSize: 13, fontWeight: 'bold' }}>
          {lastName} {firstName}
        </Text>
        <Text style={{ position: 'absolute', top: 189, left: 514, fontSize: 13, fontWeight: 'bold' }}>{age} Ans</Text>

        <View
          style={{
            position: 'absolute',
            top: 322,
            left: 72,
            right: 72,
          }}
        >
          {bilan.map((item, i) => (
            <Text style={{ display: 'block', width: '100%', fontSize: 14, lineHeight: 2 }} key={i}>
              {' '}
              - {item}
            </Text>
          ))}
          {/* <Text style={{ display: 'block', width: '100%', fontSize: 14, lineHeight: 2 }}>
            {' '}
            - React-pdf follows the React primitives specification{' '}
          </Text>
          <Text style={{ display: 'block', width: '100%', fontSize: 14, lineHeight: 2 }}>
            {' '}
            - React-pdf follows the React primitives specification{' '}
          </Text>
          <Text style={{ display: 'block', width: '100%', fontSize: 14, lineHeight: 2 }}>
            {' '}
            - React-pdf follows the React primitives specification{' '}
          </Text>
          <Text style={{ display: 'block', width: '100%', fontSize: 14, lineHeight: 2 }}>
            {' '}
            - React-pdf follows the React primitives specification{' '}
          </Text> */}
        </View>
      </Page>
    </Document>
  );
}

export default Bilan;
