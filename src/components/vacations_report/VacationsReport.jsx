import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { makeStyles } from "@mui/styles";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  title: {
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingRight: "10px",
  },
});

function VacationsReport() {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Followers Count",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1.5,
        hoverBackgroundColor: "rgb(56,160,160)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: [],
      },
    ],
  });

  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://servervacations-m9l9.onrender.com/api/followersCount")
      .then((response) => response.json())
      .then((results) => {
        const labels = results.map((vacation) => vacation.destination);
        const followersCount = results.map(
          (vacation) => vacation.followers_count
        );

        setData({
          labels,
          datasets: [
            {
              ...data.datasets[0],
              data: followersCount,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function downloadCsv() {
    const csvData = ["Destination,Followers Count"];
    data.labels.forEach((label, index) => {
      csvData.push(`${label},${data.datasets[0].data[index]}`);
    });
    const csvString = csvData.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vacations_followers.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div>
         <Button
          sx={{ width: "180px", marginLeft: "20px", marginTop: "30px",fontFamily: 'Poppins' }}
          variant="contained"
          color="success"
          onClick={downloadCsv}
        >
          Download CSV
        </Button>
      <h1 className={classes.title}>Followers Report</h1>
      <Bar
        data={data}
        options={{
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
      />
      <Box className={classes.buttonContainer}>
        <Button
          sx={{ width: "180px",fontFamily: 'Poppins' }}
          variant="contained"
          onClick={() => {
            navigate("/home");
          }}
        >
          Go Back
        </Button>
      </Box>
    </div>
  );
}

export default VacationsReport;
