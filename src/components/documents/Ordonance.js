import React, { useEffect, useState } from 'react';
import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';
import Template from './ordonance.png';

function Ordonance({ firstName, lastName, gender, address, age, ordonance, number }) {
  const [date, setDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    setDate(`${dd}/${mm}/${yyyy}`);
  }, []);

  function padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }

  return (
    <Document>
      <Page size="A4">
        <Image style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} src={Template} />
        <Text style={{ position: 'absolute', top: 161, left: 468, fontSize: 13, fontWeight: 'bold' }}>{date}</Text>
        <Text style={{ position: 'absolute', top: 154, left: 138, fontSize: 14, fontWeight: 'bold' }}>
          {padWithZero(number, 8)}
        </Text>

        <Text style={{ position: 'absolute', top: 191, left: 160, fontSize: 13, fontWeight: 'bold' }}>
          {lastName} {firstName}
        </Text>
        <Text style={{ position: 'absolute', top: 191, left: 510, fontSize: 13, fontWeight: 'bold' }}>{age} Ans</Text>

        <Text
          style={{
            position: 'absolute',
            top: 217,
            left: 90,
            fontSize: 13,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        >
          {gender}
        </Text>
        <Text style={{ position: 'absolute', top: 217, left: 214, fontSize: 13, fontWeight: 'bold' }}>{address}</Text>
        <View
          style={{
            position: 'absolute',
            top: 322,
            left: 72,
            right: 72,
          }}
        >
          {ordonance.map((item, i) => (
            <View style={{ top: i * 50 }} key={i}>
              <View>
                <Text style={{ position: 'absolute', left: 0, fontSize: 16 }}>{item.drugName}</Text>
                <Text style={{ position: 'absolute', right: 0, fontSize: 16 }}>{item.duration}</Text>
              </View>
              <Text style={{ position: 'absolute', top: 20, left: 50, fontSize: 16 }}>{item.rate}</Text>
            </View>
          ))}

          {/* {[1, 2, 3, 4, 5].map((item, i) => (
            <Text style={{ display: 'block', width: '100%', fontSize: 14, lineHeight: 2 }} key={i}>
              {' '}
              - Item number {item}{' '}
            </Text>
          ))} */}
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

export default Ordonance;
