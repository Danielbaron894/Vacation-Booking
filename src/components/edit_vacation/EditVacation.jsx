import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
import { storage } from "../../firebase-config"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditVacation() {
  const { id } = useParams();
  const [vacation, setVacation] = useState({});
  const [newDescription, setNewDescription] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    if (newImageName) {
      const imageRef = ref(storage, `vacations-images/${newImageName}`);
      getDownloadURL(imageRef)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.error("Error fetching image URL:", error);
        });
    }
  }, [newImageName]);

  useEffect(() => {
    axios
      .get(`https://servervacations-m9l9.onrender.com/api/vacations/${id}`)
      .then((response) => {
        setVacation(response.data);
        setNewDescription(response.data.description);
        setNewDestination(response.data.destination);
        setNewStartDate(response.data.start_date.substring(0, 10));
        setNewEndDate(response.data.end_date.substring(0, 10));
        setNewImageName(response.data.image_name);
        setNewPrice(response.data.price);
      })
      .catch((error) => {
        console.error("Error fetching vacation data:", error);
      });
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    const imageRef = ref(storage, `vacations-images/${file.name}`);

    uploadBytes(imageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setNewImageName(file.name);
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleSaveChanges = () => {
    const updatedVacation = {
      ...vacation,
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
      !newPrice
    ) {
      toast.error("All fields except the image field are required.");
      return;
    }

    if (parseFloat(newPrice) > 10000) {
      toast.error("Price cannot be greater than 10,000.");
      return;
    }

    const startDate = new Date(newStartDate);
    const endDate = new Date(newEndDate);

    if (startDate > endDate) {
      toast.error("End date cannot be earlier than the start date.");
      return;
    }

    axios
      .put(`https://servervacations-m9l9.onrender.com/api/vacations/${id}`, updatedVacation)
      .then(() => {
        setVacation(updatedVacation);
        toast.success("Changes have been saved successfully!", {
          onClose: () => {
            navigate("/home");
          },
        });
      })
      .catch((error) => {
        console.error("Error updating vacation data:", error);
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
        paddingBottom: "40px"
      }}
    >
      <Card sx={{ width: 500, opacity: 0.9, fontFamily:"poppins" }}>
        <CardContent>
          <h1 style={{ textAlign: "center" }}>
            Edit Vacation
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
              <InputLabel sx={{ fontSize: "12px", marginLeft:"14px" }}>Description</InputLabel>
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
            sx={{ mb: 2, width: "100%" }}
          />
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            value={newEndDate}
            onChange={(e) => setNewEndDate(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <InputLabel htmlFor="image-upload" sx={{ fontSize: "12px" }}>
            Image (Optional)
          </InputLabel>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            sx={{ mb: 2 }}
            onChange={handleImageUpload}
          />
           {imageUrl && (
            <CardMedia
              component="img"
              height="194"
              src={imageUrl}
              alt={imageUrl}
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="Price"
            variant="outlined"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
          />
          <Box display="flex" justifyContent="center">
          <Button
            sx={{ mb: 1.5, width: "180px", fontFamily: "Poppins" }}
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
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
      </Card>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Box>
  );
}

export default EditVacation;
