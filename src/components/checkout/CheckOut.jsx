import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem } from "@mui/material";
import emailjs from "emailjs-com"; 
import { makeStyles } from "@mui/styles";

function CheckOut() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerification, setEmailVerification] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");

  const { id } = useParams();
  const [vacation, setVacation] = useState({});
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageName, setImageName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const useStyles = makeStyles({
    card: {
        width: 500,
        opacity: 0.9,
    }

  });
   
  const classes = useStyles();

  useEffect(() => {
    axios.get(`https://servervacations-m9l9.onrender.com/api/vacations/${id}`)
      .then((response) => {
        setVacation(response.data);
        setDescription(response.data.description);
        setDestination(response.data.destination);
        setStartDate(response.data.start_date.substring(0, 10));
        setEndDate(response.data.end_date.substring(0, 10));
        setImageName(response.data.image_name);
        setPrice(response.data.price);

        
      })
      .catch((error) => {
        console.error("Error fetching vacation data:", error);
      });
  }, [id]);



  const handleCheckout = () => {
    // Validation for input fields
    if (!firstName) {
      toast.error("Please enter your First Name.");
      return;
    }

    if (!lastName) {
      toast.error("Please enter your Last Name.");
      return;
    }

    if (!email) {
      toast.error("Please enter your Email.");
      return;
    }

    if (!emailVerification) {
      toast.error("Please verify your Email.");
      return;
    }

    if (email !== emailVerification) {
      toast.error("Emails do not match.");
      return;
    }

    if (!passengerCount || passengerCount <= 0) {
      toast.error("Please enter a valid Passenger Count.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a Payment Method.");
      return;
    }

    if (!cardNumber) {
      toast.error("Please enter your Card Number.");
      return;
    }

    if (!expirationDate) {
      toast.error("Please enter the Expiration Date.");
      return;
    }

    if (!cvc) {
      toast.error("Please enter the CVC.");
      return;
    }

    const emailParams = {
        from_email: "danielbaron894@gmail.com", // Your Gmail address
        to_email: email,
        subject: "Vacation Order Details",
        message: `Thank you for your order! Here are your order details:
          
          Destination: ${vacation.destination}
          Start Date: ${startDate}
          End Date: ${endDate}
          Price: $${price}
          Card number: ${cardNumber}
          Payment Method: ${paymentMethod}
          Expiration Date: ${expirationDate}
          CVC: ${cvc}
          Card Number: ${cardNumber}
          First Name: ${firstName}
          Last Name: ${lastName}
          Number of Passengers: ${passengerCount}`,
      };
  
      // Send the email using emailjs
      emailjs
        .send(
          "service_j8cu655",
          "template_996ht5c",
          emailParams,
          "8IVMU925tRuKVfBZC" // Replace with your actual user ID
        )
        .then((response) => {
          console.log("Email sent:", response);
          showSuccessToast();
          clearInputFields();
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
    };
  
        const showSuccessToast = () => {
    toast.success("Payment has been made successfully. Order details have been sent to your email.", {
        onClose: () => {
          navigate("/home");
        },
      });
    };

  
    const clearInputFields = () => {
      setPaymentMethod("");
      setEmail("");
      setEmailVerification("");
      setFirstName("");
      setLastName("");
      setPassengerCount(1);
      setExpirationDate("");
      setCvc("");
      setCardNumber("");
    };

   

  

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Card className={classes.card}>
        <CardContent>
          <h1 style={{ textAlign: "center", fontFamily: "Poppins" }}>
            Check Out
          </h1>
          <h2 style={{ fontFamily: "Poppins" }}>Vacation Details</h2>
          <p style={{ fontFamily: "Poppins" }}>Destination: {destination}</p>
          <p style={{ fontFamily: "Poppins" }}>Start Date: {startDate}</p>
          <p style={{ fontFamily: "Poppins" }}>End Date: {endDate}</p>
          <p style={{ fontFamily: "Poppins" }}>Price: ${price}</p>

          <TextField
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="Passenger Count"
            type="number"
            variant="outlined"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            type="email"
            label="Verify Email"
            variant="outlined"
            value={emailVerification}
            onChange={(e) => setEmailVerification(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
  select
  label="Payment Method"
  variant="outlined"
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
  sx={{ mb: 2, width: "100%" }}
>
  <MenuItem value="VISA">VISA</MenuItem>
  <MenuItem value="AMERICAN EXPRESS">AMERICAN EXPRESS</MenuItem>
  <MenuItem value="MASTER CARD">MASTER CARD</MenuItem>
</TextField>
          <TextField
            label="Card Number"
            variant="outlined"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="Expiration Date"
            variant="outlined"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="CVC"
            variant="outlined"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <Box display="flex" justifyContent="center">
            <Button
              sx={{ mb: 1.5, width: "180px", fontFamily: "Poppins" }}
              variant="contained"
              onClick={handleCheckout}
            >
              Pay Now
            </Button>
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
              sx={{ width: "180px", fontFamily: "Poppins" }}
              variant="contained"
              color="warning"
              onClick={() => {
                navigate("/home");
              }}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </Card>
    </Box>
  );
}

export default CheckOut;
