import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar, Box, Button, Card, CardActions, CircularProgress,
  Container, Fab, Grid, IconButton, Modal,
  Paper,
  Toolbar, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { deleteMedia, fetchMedia, uploadMedia } from "../redux/mediaSlicer";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mediaList: media, loading } = useSelector((state) => state.media);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch]);

  // Group media by date
  const groupByDate = () => {
    return media?.reduce((acc, item) => {
      const date = new Date(item.createdAt).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };
  
  const groupedMedia = groupByDate();
  
  // Sort the dates in descending order (latest first)
  const dates = Object.keys(groupedMedia).sort((a, b) => new Date(b) - new Date(a)) || [];
  

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleDelete = (id) => dispatch(deleteMedia(id));

  const handleDownload = (url, name = "media") => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isImage = (url) => url?.match(/\.(jpeg|jpg|png|gif)$/i);
  const isVideo = (url) => url?.match(/\.(mp4|webm|ogg)$/i);

  /** Upload Modal States & Functions **/
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  
  const handleFileChange = (event) => {
    const newFiles = [...event.target.files].filter((file) => file.size <= 100 * 1024 * 1024);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  
  // Handle file removal
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleUpload = async () => {
    if (files.length === 0) return;
    if (files.length > 10) {
      alert("You can only upload up to 10 files at a time.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await dispatch(uploadMedia(formData)).unwrap();
      dispatch(fetchMedia());
      setFiles([]);
      setOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred while uploading files.");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: "#fff", color: "#000", minHeight: "48px", padding: "4px 16px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img src="/logo.png" alt="Logo" width="150px" height="150px" />
          <IconButton color="error" onClick={handleLogout}>
            <LogoutRoundedIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Media Grid with Date-wise Pagination */}
      <Container sx={{ mt: 4 }}>
        {loading ? (
          <Typography align="center">Loading...</Typography>
        ) : dates.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Typography>No media found. Start uploading!</Typography>
          </Box>
        ) : (
          <>
            {dates.map((date) => (
              <Accordion key={date} defaultExpanded sx={{ my: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{date}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {groupedMedia[date].map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card sx={{ height: 250, display: "flex", flexDirection: "column" }}>
                          <Box
                            sx={{
                              height: 200,
                              width: "100%",
                              backgroundColor: "#ddd",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}
                          >
                            {isImage(item.url) ? (
                              <img src={item.url} alt="Media" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : isVideo(item.url) ? (
                              <video src={item.url} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <Typography>Unsupported file format</Typography>
                            )}
                          </Box>
                          <CardActions sx={{ justifyContent: "space-between", paddingX: 1 }}>
                            <Typography variant="body2">{item.type}</Typography>
                            <Box>
                              <IconButton color="error" onClick={() => handleDelete(item._id)}><DeleteIcon /></IconButton>
                              <IconButton color="primary" onClick={() => handleDownload(item.url)}><DownloadIcon /></IconButton>
                            </Box>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

         
          </>
        )}
      </Container>

      {/* Floating Upload Button */}
      <Fab color="primary" sx={{ position: "fixed", bottom: 16, right: 16 }} onClick={() => setOpen(true)}>
        <AddIcon />
      </Fab>

      {/* Upload Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "white", p: 4, width: 400, boxShadow: 24, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Upload Media</Typography>
          <Paper
  sx={{ p: 2, border: "2px dashed #1976d2", textAlign: "center", cursor: "pointer" }}
  
  onClick={() => document.getElementById("fileInput").click()}
>
  <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} hidden id="fileInput" />
  <CloudUploadIcon sx={{ fontSize: 48, color: "#1976d2" }} />
  <Typography>Select or Drag & Drop Files</Typography>
</Paper>

{/* Display Selected Files */}
{files.length > 0 && (
  <Box
    sx={{
      mt: 2,
      maxHeight: 200, // Set a fixed height
      overflowY: "auto", // Enable vertical scrolling
      border: "1px solid #ccc",
      borderRadius: 1,
      p: 1,
      bgcolor: "#f9f9f9",
    }}
  >
    <Typography variant="body1">Selected Files:</Typography>
    {files.map((file, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80%" }}>
          {file.name}
        </Typography>
        <IconButton color="error" onClick={() => handleRemoveFile(index)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    ))}
  </Box>
)}


<Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleUpload} disabled={files.length === 0 || loading}>
  {loading ? <CircularProgress size={24} /> : "Upload"}
</Button>

        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
