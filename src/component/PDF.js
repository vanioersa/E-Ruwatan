import React, { useState, useEffect } from "react";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import { getAllPiket } from "../page/guru/piketguru/api_piket";
import axios from "axios";

// Register Poppins font
Font.register({ family: "Poppins", src: "../fonts/Poppins-Regular.ttf" });

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
    backgroundColor: "#21273D",
    color: "white",
    fontWeight: "extrabold",
    padding: 6,
    flexDirection: "row",
  },
  cellSiswa: {
    padding: 6,
    flex: 1,
    fontSize: 13,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  cellKelas: {
    padding: 6,
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  cell: {
    padding: 6,
    flex: 1,
    fontSize: 10,
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filteredDate = searchParams.get("date");
  const [filteredPiketData, setFilteredPiketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);

  useEffect(() => {
    const fetchPiketData = async () => {
      try {
        const response = await getAllPiket();
        const filteredData = response.filter((item) => item.tanggal === filteredDate);
        setFilteredPiketData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchPiketData();
  }, [filteredDate]);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await axios.get("http://localhost:4001/siswa/all");
        setSiswa(response.data);
      } catch (error) {
        console.error("Failed to fetch Siswa: ", error);
      }
    };
    fetchSiswa();
  }, []);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get("http://localhost:4001/kelas/all");
        setKelas(response.data);
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "masuk":
        return "Masuk";
      case "izin":
        return "Izin";
      case "sakit":
        return "Sakit";
      case "alpha":
        return "Alpha";
      default:
        return "";
    }
  };

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document title={`E-Ruwatan - ${filteredDate}`}>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              <Image src={require("../asset/logobinus.png")} style={styles.logo} />
              <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 5 }}>E-Ruwatan</Text>
            </View>

            <Text style={styles.hr} />
            <Text style={styles.date}>Tanggal: {filteredDate}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell2, { maxWidth: "40px" }, { flex: 1 }]}>
                  No.
                </Text>
                <Text style={styles.cell2}>Nama Siswa</Text>
                <Text style={styles.cell2}>Kelas</Text>
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

              {filteredPiketData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}
                >
                  <Text style={[ styles.cell, styles.tableData, { maxWidth: "40px" }, ]}>
                    {index + 1}.
                  </Text>
                  <Text style={styles.cellSiswa}>{siswa.find((s) => s.id === item.siswaId)?.nama_siswa}</Text>
                  <Text style={styles.cellKelas}>{kelas.find((k) => k.id === item.kelasId)?.kelas +
                            " " +
                            kelas.find((k) => k.id === item.kelasId)
                              ?.nama_kelas}</Text>
                              
                  <Text style={[styles.cell, { maxWidth: "50px" }, { textAlign: "center" }]}>
                  {getStatusColor(item.status) === "Masuk" ? " X " : " - "}
                  </Text>
                  <Text style={[styles.cell, { maxWidth: "50px" }, { textAlign: "center" }]}>
                    {getStatusColor(item.status) === "Sakit" ? " X " : " - "}
                  </Text>
                  <Text style={[styles.cell, { maxWidth: "50px" }, { textAlign: "center" }]}>
                    {getStatusColor(item.status) === "Izin" ? " X " : " - "}
                  </Text>
                  <Text
                    style={[styles.cell, styles.lastCell, { maxWidth: "50px" }, { textAlign: "center" }]}
                  >
                    {getStatusColor(item.status) === "Alpha" ? " X " : " - "}
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
