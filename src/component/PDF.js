import React from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Import font
import PoppinsRegular from "../fonts/Poppins-Regular.ttf";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  logoContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 60,
  },
  hr: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  date: {
    marginBottom: 10,
    fontSize: 11,
    textAlign: "right",
  },
  table: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#b6895b",
    color: "white",
    fontWeight: "bold",
    padding: 5,
    flex: 1,
  },
  cell: {
    padding: 5,
    flex: 1,
  },
  smkText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    flexWrap: "wrap",
  },
  tableData: {
    padding: 5,
    flex: 1,
    wordWrap: "break-word",
    textAlign: 'center'
  },
});

// Register font
Font.register({ family: "Poppins", src: PoppinsRegular });

// Create Document Component
const PDFpiket = () => {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              <Image
                src={require("../asset/logobinus.png")}
                style={styles.logo}
              />
              <Text style={styles.smkText}>E-Ruwatan</Text>
            </View>
            <Text style={styles.hr} />
            <Text style={styles.date}>Tanggal: {currentDate}</Text>
            <View style={styles.table}>
              <Text style={[styles.tableHeader, styles.cell, { textAlign: "left" }]}>No.</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Nama</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Sakit</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Izin</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Alfa</Text>
            </View>

            <View>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.tableData, { textAlign: "left" }]}>1.</Text>
                <Text style={[styles.cell, styles.tableData]}>Nama 1</Text>
                <Text style={[styles.cell, styles.tableData]}>Ya</Text>
                <Text style={[styles.cell, styles.tableData]}>-</Text>
                <Text style={[styles.cell, styles.tableData]}>-</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.tableData, { textAlign: "left" }]}>2.</Text>
                <Text style={[styles.cell, styles.tableData]}>Nama 2</Text>
                <Text style={[styles.cell, styles.tableData]}>-</Text>
                <Text style={[styles.cell, styles.tableData]}>Ya</Text>
                <Text style={[styles.cell, styles.tableData]}>-</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.tableData, { textAlign: "left" }]}>3.</Text>
                <Text style={[styles.cell, styles.tableData]}>Nama 3</Text>
                <Text style={[styles.cell, styles.tableData]}>-</Text>
                <Text style={[styles.cell, styles.tableData]}>-</Text>
                <Text style={[styles.cell, styles.tableData]}>Ya</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFpiket;
