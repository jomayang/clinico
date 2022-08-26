import React from 'react';
import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';
import Template from './ordonance.png';

function Ordonance() {
  return (
    <Document>
      <Page size="A4">
        <Image style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} src={Template} />
        <Text style={{ position: 'absolute', top: 161, left: 452, fontSize: 13, fontWeight: 'bold' }}>02/11/2022</Text>

        <Text style={{ position: 'absolute', top: 190, left: 160, fontSize: 13, fontWeight: 'bold' }}>Ghazi Mehdi</Text>
        <Text style={{ position: 'absolute', top: 190, left: 500, fontSize: 13, fontWeight: 'bold' }}>18 Ans</Text>

        <Text style={{ position: 'absolute', top: 217, left: 100, fontSize: 13, fontWeight: 'bold' }}>Male</Text>
        <Text style={{ position: 'absolute', top: 217, left: 260, fontSize: 13, fontWeight: 'bold' }}>
          Cite freres ferrad n70
        </Text>
        <View
          style={{
            position: 'absolute',
            top: 322,
            left: 72,
            right: 72,
          }}
        >
          {[1, 2, 3, 4].map((item, i) => (
            <View style={{ top: i * 50 }} key={i}>
              <View>
                <Text style={{ position: 'absolute', left: 0, fontSize: 16 }}>Item number</Text>
                <Text style={{ position: 'absolute', right: 0, fontSize: 16 }}>5 jours</Text>
              </View>
              <Text style={{ position: 'absolute', top: 20, left: 50, fontSize: 16 }}>5/j</Text>
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
