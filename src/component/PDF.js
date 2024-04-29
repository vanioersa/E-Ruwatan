import React, { useState, useEffect } from "react";
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
import { getAllSiswa } from "../page/murid/siswa/api_siswa";

// Import font
import PoppinsRegular from "../fonts/Poppins-Regular.ttf";

// Register font
Font.register({ family: "Poppins", src: PoppinsRegular });

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
    textAlign: "center",
  },
});

const PDFpiket = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await getAllSiswa();
        setData(students);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

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
              <Text
                style={[styles.tableHeader, styles.cell, { textAlign: "left" }]}
              >
                No.
              </Text>
              <Text style={[styles.tableHeader, styles.cell]}>Nama</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Sakit</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Izin</Text>
              <Text style={[styles.tableHeader, styles.cell]}>Alfa</Text>
            </View>

            {data.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text
                  style={[styles.cell, styles.tableData, { textAlign: "left" }]}
                >
                  {index + 1}.
                </Text>
                <Text style={[styles.cell, styles.tableData]}>{item.nama}</Text>
                <Text style={[styles.cell, styles.tableData]}>
                  {item.sakit ? "✓" : "-"}
                </Text>
                <Text style={[styles.cell, styles.tableData]}>
                  {item.izin ? "✓" : "-"}
                </Text>
                <Text style={[styles.cell, styles.tableData]}>
                  {item.alfa ? "✓" : "-"}
                </Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFpiket;
