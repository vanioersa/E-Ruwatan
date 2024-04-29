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
import PoppinsRegular from "../fonts/Poppins-Regular.ttf";

// Register Poppins font
Font.register({ family: "Poppins", src: PoppinsRegular });

// Create and register styles
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
    fontSize: 11,
    textAlign: "right",
    marginBottom: 10,
  },
  table: {
    flexDirection: "column",
    marginTop: 10,
  },
  tableHeader: {
    backgroundColor: "#1e40af",
    color: "white",
    fontWeight: "extrabold",
    padding: 6,
    flexDirection: "row",
  },
  cell: {
    padding: 6,
    flex: 1,
    fontSize: 12,
    fontWeight: "extrabold",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  cell2: {
    // For headers, mirroring `cell` styles
    padding: 6,
    flex: 1,
    fontSize: 12,
    fontWeight: "extrabold",
    textAlign: "center",
  },
  lastCell: {
    borderRightWidth: 0, // Ensure no right border for the last cell
  },
  smkText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  tableData: {
    flex: 1,
    color: "#4b5563",
    fontSize: 11,
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  evenRow: {
    backgroundColor: "#f9fafb",
  },
});

const PDFpiket = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSiswa();
        setData(
          response.map((student) => ({ ...student, nama: student.nama_siswa }))
        );
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
      <Document title={`E-Ruwatan ${currentDate}`}>
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
              <View style={styles.tableHeader}>
                <Text style={[styles.cell2, { maxWidth: "40px" }, { flex: 1 }]}>
                  No.
                </Text>
                <Text style={styles.cell2}>Nama</Text>
                <Text style={[styles.cell2, { maxWidth: "50px" }, { flex: 1 }]}>
                  Masuk
                </Text>
                <Text style={[styles.cell2, { maxWidth: "50px" }, { flex: 1 }]}>
                  Sakit
                </Text>
                <Text style={[styles.cell2, { maxWidth: "50px" }, { flex: 1 }]}>
                  Izin
                </Text>
                <Text style={[styles.cell2, { maxWidth: "50px" }, { flex: 1 }]}>
                  Alfa
                </Text>
              </View>

              {data.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}
                >
                  <Text
                    style={[
                      styles.cell,
                      styles.tableData,
                      { maxWidth: "40px" },
                    ]}
                  >
                    {index + 1}.
                  </Text>
                  <Text style={styles.cell}>{item.nama}</Text>
                  <Text style={[styles.cell, { maxWidth: "50px" }, { textAlign: "center" }]}>
                    {item.masuk ? "X" : "-"}
                  </Text>
                  <Text style={[styles.cell, { maxWidth: "50px" }, { textAlign: "center" }]}>
                    {item.sakit ? "X" : "-"}
                  </Text>
                  <Text style={[styles.cell, { maxWidth: "50px" }, { textAlign: "center" }]}>
                    {item.izin ? "X" : "-"}
                  </Text>
                  <Text
                    style={[styles.cell, styles.lastCell, { maxWidth: "50px" }, { textAlign: "center" }]}
                  >
                    {item.alfa ? "X" : "-"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFpiket;
