import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Pagination from "@mui/material/Pagination";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "@mui/icons-material/Share";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DescriptionIcon from "@mui/icons-material/Description";
import CircularProgress from '@mui/material/CircularProgress';
import { storage } from "../../firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import "@fontsource/poppins";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import "./Home.css";



const CardContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "16px",
  marginLeft: "100px",
  marginRight: "100px",
  marginTop: "35px",
  textAlign: "center",
  marginBottom: "100px",
  alignItems: "center",
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #BCC6CC",
  boxShadow: 24,
  p: 4,
};

const PageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundPosition: "center",
  paddingBottom: "30px",
  minHeight: "100vh",
  position: "relative",
});

const PaginationContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
  width: "100%",
  position: "absolute",
  bottom: "0",
  marginBottom: "30px",
});

const ITEMS_PER_PAGE = 9;

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [vacations, setVacations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteVacationIds, setFavoriteVacationIds] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [followersCount, setFollowersCount] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vacationToDelete, setVacationToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [clickedChipId, setClickedChipId] = useState(null); // State to track the clicked Chip

  

  const handleShare = (vacation) => {
  const startDate = new Date(vacation.start_date);
  const endDate = new Date(vacation.end_date);
  const formattedStartDate = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;
  const formattedEndDate = `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;
  const shareText = `Check out this vacation to ${vacation.destination} from ${formattedStartDate} to ${formattedEndDate} for ${vacation.price}$!`;
  const shareLink = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
  window.open(shareLink);
};

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  

  const navigate = useNavigate();

  const handleCheckOut = (id) => {
    setClickedChipId(id);
    navigate(`/checkout/${id}`);
  };

  useEffect(() => {
    axios
      .get(`https://servervacations-m9l9.onrender.com/api/userData`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const userData = response.data;
        setUserData(userData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const tokenParts = token.split(".");
        const decodedPayload = JSON.parse(atob(tokenParts[1]));

        if (decodedPayload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          const userRole = decodedPayload.role;
          setUserRole(userRole);
          axios
            .get("https://servervacations-m9l9.onrender.com/api/vacations")
            .then((response) => {
              setVacations(response.data);
            });

          axios
            .get(
              "https://servervacations-m9l9.onrender.com/api/vacationFollowersCount"
            )
            .then((response) => {
              const followersCountData = response.data;
              setFollowersCount(followersCountData);
            });

          axios
            .get(
              "https://servervacations-m9l9.onrender.com/api/favoriteVacations",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((response) => {
              const favoriteVacationIds = response.data;
              setFavoriteVacationIds(favoriteVacationIds);
            });
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleDelete = (vacation) => {
    setVacationToDelete(vacation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vacationToDelete) {
      axios
        .delete(
          `https://servervacations-m9l9.onrender.com/api/vacations/${vacationToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          setVacations((prevVacations) =>
            prevVacations.filter(
              (vacation) => vacation.id !== vacationToDelete.id
            )
          );
          setVacationToDelete(null);
          toast.success("Vacation deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting vacation:", error);
        })
        .finally(() => {
          setDeleteDialogOpen(false);
        });
    }
  };

  const toggleFavorite = (id) => {
    axios
      .post(
        "https://servervacations-m9l9.onrender.com/api/toggleFavorite",
        {
          userId: userId,
          vacationId: id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        setVacations((prevVacations) => {
          return prevVacations.map((vacation) => {
            if (vacation.id === id) {
              return {
                ...vacation,
                favorite: !vacation.favorite,
              };
            }
            return vacation;
          });
        });

        setFavoriteVacationIds((prevIds) => {
          if (prevIds.includes(id)) {
            return prevIds.filter((favId) => favId !== id);
          } else {
            return [...prevIds, id];
          }
        });

        setFollowersCount((prevCount) => {
          const newCount = { ...prevCount };
          if (favoriteVacationIds.includes(id)) {
            newCount[id] = (newCount[id] || 0) - 1;
          } else {
            newCount[id] = (newCount[id] || 0) + 1;
          }
          return newCount;
        });
      })
      .catch((error) => {
        console.error("Error toggling favorite:", error);
      });
  };

  const filteredVacations = [...vacations]
    .filter((vacation) => {
      const startDate = new Date(vacation.start_date);
      const endDate = new Date(vacation.end_date);
      const currentDate = new Date();

      const isFollowing =
        showFollowing && favoriteVacationIds.includes(vacation.id);
      const isFuture = showFuture && startDate >= currentDate;
      const isCurrent =
        showCurrent && startDate <= currentDate && endDate >= currentDate;

      return (
        (!showFollowing && !showFuture && !showCurrent) ||
        isFollowing ||
        isFuture ||
        isCurrent
      );
    })
    .sort((a, b) => {
      const startDateA = new Date(a.start_date);
      const startDateB = new Date(b.start_date);
      return startDateA - startDateB;
    });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleVacations = filteredVacations.slice(startIndex, endIndex);
  const pageCount = Math.ceil(filteredVacations.length / ITEMS_PER_PAGE);

  const CardWrapper = styled("div")({
    flexBasis: "calc(33.33% - 32px)",
    width: "300px",
  });

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleLogout = () => {
    axios
      .post("https://servervacations-m9l9.onrender.com/api/logout", null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  useEffect(() => {
    if (visibleVacations.length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [visibleVacations, currentPage]);

  const loadImageURL = async (imageName) => {
    try {
      const imageRef = ref(storage, `vacations-images/${imageName}`);
      const imageURL = await getDownloadURL(imageRef);
      return imageURL;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return null;
    }
  };

  const prevVisibleVacationsRef = useRef();
  useEffect(() => {
    prevVisibleVacationsRef.current = visibleVacations;
  }, [visibleVacations]);
  const prevVisibleVacations = prevVisibleVacationsRef.current || [];
  const handleModalOpen = (vacation) => {
    setSelectedVacation(vacation);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedVacation(null);
    setModalOpen(false);
  };

  useEffect(() => {
    if (
      JSON.stringify(prevVisibleVacations) !== JSON.stringify(visibleVacations)
    ) {
      const fetchImageUrls = async () => {
        const urls = {};
        const promises = visibleVacations.map(async (vacation) => {
          const imageUrl = await loadImageURL(vacation.image_name);
          urls[vacation.id] = imageUrl;
        });
        await Promise.all(promises);
        setImageUrls(urls);
        setAllImagesLoaded(true); 
      };
  
      fetchImageUrls();
    }
  }, [visibleVacations]);

  const Navbar = () => {
    const navigate = useNavigate();
  
    const handleAddVacation = () => {
      navigate("/add");
    };
  
    const handleReports = () => {
      navigate("/report");
    };
  
    return (
      <AppBar position="fixed" style={{ top: 0, backgroundColor: 'rgba(0, 100, 400, 0.4)' }}>
      <Toolbar>
        <div style={{ flexGrow: 1 }}>
          {userData && (
            <Typography
              variant="body1"
              style={{
                fontSize: "17px",
                color: "ButtonShadow",
                fontFamily: "Poppins",
              }}
            >
              {"Hello"} {userData.first_name} {userData.last_name}
            </Typography>
          )}
        </div>
        {userRole === 2 && (
          <>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleAddVacation}
              style={{ fontFamily: "Poppins" }}
            >
              Add Vacation
            </Button>
            <Button
              color="inherit"
              startIcon={<DescriptionIcon />}
              onClick={handleReports}
              style={{ fontFamily: "Poppins" }}
            >
              Report
            </Button>
          </>
        )}
          <Button
  color="inherit"
  startIcon={<HomeIcon />} // Add the Home icon here
  onClick={() => navigate("/home")}
  style={{ fontFamily: "Poppins" }}
>
  Home
</Button>
      
        <List>
          <ListItem>
            <ListItemText />
          </ListItem>
        </List>
      </Toolbar>
    </AppBar>
    );
  };
  
  const MobileNavbar = () => {
    const navigate = useNavigate();
  
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const handleToggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  
    const handleAddVacation = () => {
      navigate("/add");
      setIsMenuOpen(false);
    };
  
    const handleReports = () => {
      navigate("/report");
      setIsMenuOpen(false);
    };
  
    return (
      <div>
        <AppBar position="fixed" style={{ top: 0, backgroundColor: 'rgba(0, 100, 400, 0.4)'}}>
          <Toolbar>
            <Typography
              variant="body1"
              style={{
                fontSize: "20px",
                color: "ButtonShadow",
                fontFamily: "Poppins",
                flexGrow: 1 
              }}
            >
              {"Hello"} {userData.first_name} {userData.last_name}
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleToggleMenu}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {isMenuOpen && (
          <List>
            <ListItem  onClick={handleAddVacation} style={{ fontFamily: "Poppins" }}>
              <ListItemText primary="Add Vacation" />
            </ListItem>
            <ListItem  onClick={handleReports} style={{ fontFamily: "Poppins" }}>
              <ListItemText primary="Reports" />
            </ListItem>
          </List>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <Box display="flex" justifyContent="center" mt= "50px" marginBottom="10px">
        <FormControlLabel
          control={
            <Checkbox
              checked={showFollowing}
              onChange={() => setShowFollowing(!showFollowing)}
              style={{ color: "white" }}
            />
          }
          label={
            <Typography style={{ fontFamily: "Poppins",color: "white" }}>
              Show Following
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showFuture}
              onChange={() => setShowFuture(!showFuture)}
              style={{ color: "white" }}
            />
          }
          label={
            <Typography style={{ fontFamily: "Poppins",color: "white" }}>
              Show Future
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showCurrent}
              onChange={() => setShowCurrent(!showCurrent)}
              style={{ color: "white" }}
            />
          }
          label={
            <Typography style={{ fontFamily: "Poppins",color: "white" }}>
              Show Current
            </Typography>
          }
        />
      </Box>
      {allImagesLoaded ? (
  <>
      <CardContainer>
        {visibleVacations.map((vacation, index) => {
          const startDate = new Date(vacation.start_date);
          const endDate = new Date(vacation.end_date);
          const formattedStartDate = `${
            startDate.getUTCDate() < 10 ? "0" : ""
          }${startDate.getUTCDate()}.${
            startDate.getUTCMonth() + 1 < 10 ? "0" : ""
          }${startDate.getUTCMonth() + 1}.${startDate.getUTCFullYear()}`;
          const formattedEndDate = `${
            endDate.getUTCDate() < 10 ? "0" : ""
          }${endDate.getUTCDate()}.${
            endDate.getUTCMonth() + 1 < 10 ? "0" : ""
          }${endDate.getUTCMonth() + 1}.${endDate.getUTCFullYear()}`;

          return (
            <CardWrapper key={vacation.id}>
              <Card>
                <CardHeader
                  action={
                    <IconButton
                      aria-label="moreInfo"
                      onClick={() => handleModalOpen(vacation)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                  titleTypographyProps={{ style: { fontFamily: "Poppins", color:"#545454"} }}
                  title={vacation.destination}
                  subheader={`${formattedStartDate} - ${formattedEndDate}`}
                />
                <CardMedia
                  component="img"
                  height="194"
                  src={imageUrls[vacation.id] || ""}
                  alt={vacation.destination}
                />
                <CardActions disableSpacing>
                  {userRole === 1 ? (
                    <>
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => toggleFavorite(vacation.id)}
                    >
                      <span style={{ marginRight: "4px" }}>
                        {followersCount[vacation.id] || 0}
                      </span>
                      <FavoriteIcon
                        style={{
                          color: favoriteVacationIds.includes(vacation.id)
                            ? "#E41B17"
                            : "inherit",
                        }}
                      />
                    </IconButton>
                    <IconButton
                    aria-label="share"
                    color="primary"
                    onClick={() => handleShare(vacation)}
                  >
                    <ShareIcon />
                  </IconButton>
                  </>
                  ) : (
                    <>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDelete(vacation)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => navigate(`/edit/${vacation.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
                   
                  <Stack marginLeft={"390px"}  position={"absolute"}>
                      <Chip
                        className="chip"
                        label={vacation.price + ` $`}
                        variant="outlined"
                        onClick={() => handleCheckOut(vacation.id)} 
                      />
                    </Stack>
                </CardActions>

                <Dialog
                  open={deleteDialogOpen}
                  onClose={() => setDeleteDialogOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Delete Vacation
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this vacation?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setDeleteDialogOpen(false)}
                      color="primary"
                    >
                      No
                    </Button>
                    <Button onClick={confirmDelete} color="primary" autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </CardWrapper>
          );
        })}
      </CardContainer>

      <PaginationContainer>
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
      />
    </PaginationContainer>
  </>
) : (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="300px"
    marginTop={"100px"}
  >
    <CircularProgress size={80} />
  </Box>
)}

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedVacation && (
            <div>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                textAlign="center"
                style={{ fontFamily: "Poppins" }}
              >
                {selectedVacation.destination}
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                textAlign="center"
                style={{ fontFamily: "Poppins" }}
              >
                {selectedVacation.description}
              </Typography>
            </div>
          )}
        </Box>
      </Modal>

      <Box
        right={32}
        mt={2}
        position={"absolute"}
        bottom={0}
        marginBottom={"30px"}
      >
        <Button
          variant="contained"
          color="warning"
          onClick={handleLogout}
          style={{ fontFamily: "Poppins" }}
        >
          Logout
        </Button>
      </Box>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </PageContainer>
  );
}
