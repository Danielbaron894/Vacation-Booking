import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { FormControl } from "@mui/base";
import { CardMedia, InputLabel } from "@mui/material";
import Input from "@mui/material/Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase-config";

function AddVacation() {
  const [newDescription, setNewDescription] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    const imageRef = ref(storage, `vacations-images/${file.name}`);

    uploadBytes(imageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url); 
          setNewImageName(file.name); 
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleAddVacation = () => {
    const newVacation = {
      description: newDescription,
      destination: newDestination,
      start_date: newStartDate,
      end_date: newEndDate,
      image_name: newImageName,
      price: newPrice,
    };

    if (
      !newDescription ||
      !newDestination ||
      !newStartDate ||
      !newEndDate ||
      !newPrice ||
      !newImageName
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (parseFloat(newPrice) > 10000) {
      toast.error("Price cannot be greater than 10,000.");
      return;
    }

    const startDate = new Date(newStartDate);
    const endDate = new Date(newEndDate);
    const currentDate = new Date();

    if (startDate < currentDate) {
      toast.error("Start date cannot be earlier than the current date.");
      return;
    }

    if (endDate < currentDate) {
      toast.error("End date cannot be earlier than the current date.");
      return;
    }

    if (startDate && endDate < currentDate) {
      toast.error("Start date and End date cannot be earlier than the current date.");
      return;
    }

    if (startDate > endDate) {
      toast.error("End date cannot be earlier than the start date.");
      return;
    }

    axios
      .post("https://servervacations-m9l9.onrender.com/api/vacations", newVacation)
      .then((response) => {
        if (response.status === 201) {
          setNewDescription("");
          setNewDestination("");
          setNewStartDate("");
          setNewEndDate("");
          setNewImageName("");
          setNewPrice("");

          toast.success("Vacation added successfully!", {
            onClose: () => {
              navigate("/home");
            },
          });
        } else {
          toast.error("Failed to add vacation. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error adding vacation:", error);
        toast.error("Failed to add vacation. Please try again later.");
      });
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
      <Card sx={{ width: 500, opacity: 0.9, fontFamily:"poppins" }}>
        <CardContent>
          <h1 style={{ textAlign: "center", }}>
            Add Vacation
          </h1>
          <TextField
            label="Destination"
            variant="outlined"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <Box sx={{ mb: 2 }}>
            <FormControl sx={{ mb: 2 }}>
              <TextareaAutosize
                aria-label="Description"
                placeholder="Description"
                style={{ width: "462.5px", height: "46px" }}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </FormControl>
          </Box>
          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            value={newStartDate}
            onChange={(e) => setNewStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            value={newEndDate}
            onChange={(e) => setNewEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2, width: "100%" }}
          />
          <Box
            sx={{ mb: 2 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {selectedImage ? (
              <CardMedia
                component="img"
                height="194"
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Image"
              />
            ) : (
              newImageName && (
                <CardMedia
                  component="img"
                  height="194"
                  src={`http://vacationsappproject.appspot.com/vacations_images/${newImageName}`}
                  alt={newImageName}
                />
              )
            )}
          </Box>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="Price"
            type="number"
            variant="outlined"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <Box display="flex" justifyContent="center">
            <Button
              sx={{ mb: 1.5, width: "180px", fontFamily: "Poppins" }}
              variant="contained"
              onClick={handleAddVacation}
            >
              Add Vacation
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

export default AddVacation;
