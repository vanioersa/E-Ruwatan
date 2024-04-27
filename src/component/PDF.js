import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Import font
import PoppinsRegular from '../fonts/Poppins-Regular.ttf';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  logoContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 10 // added margin for text alignment
  },
  hr: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  date: {
    marginBottom: 10,
    textAlign: 'right'
  },
  table: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  tableHeader: {
    backgroundColor: '#b6895b',
    color: 'white',
    fontWeight: 'bold',
    padding: 5
  },
  cell: {
    padding: 5
  },
  smkText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10 // added margin for logo alignment
  }
});

// Register font
Font.register({ family: 'Poppins', src: PoppinsRegular });

// Create Document Component
const PDFpiket = () => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              <Image src={require('../asset/logobinus.png')} style={styles.logo} />
              <Text style={styles.smkText}>SMK Bina Nusantara</Text>
            </View>
            <Text style={styles.hr} />
            <Text style={styles.date}>Tanggal: {currentDate}</Text>
            <View style={styles.table}>
              <Text style={[styles.tableHeader, styles.cell]}>No.</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Nama</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Sakit</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Izin</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Alfa</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>1.</Text>
              <Text style={styles.cell}>Nama 1</Text>
              <Text style={styles.cell}>Ya</Text>
              <Text style={styles.cell}>-</Text>
              <Text style={styles.cell}>-</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>2.</Text>
              <Text style={styles.cell}>Nama 2</Text>
              <Text style={styles.cell}>-</Text>
              <Text style={styles.cell}>Ya</Text>
              <Text style={styles.cell}>-</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>3.</Text>
              <Text style={styles.cell}>Nama 3</Text>
              <Text style={styles.cell}>-</Text>
              <Text style={styles.cell}>-</Text>
              <Text style={styles.cell}>Ya</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFpiket;
