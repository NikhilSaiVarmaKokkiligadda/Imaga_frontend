import { AppBar, Box, Button, CircularProgress, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadMedia } from "../redux/mediaSlicer";
const MediaUpload = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.media);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
     /// append current userid 

      formData.append("file", file);
      dispatch(uploadMedia(formData));
      setFile(null);
    }
  };

  return (   <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
    {/* App Bar */}
    <AppBar position="static" sx={{ bgcolor: "#fff", color: "#000" }}>
      <Toolbar>
           <Box sx={{ display: "flex",minHeight: "10vh", justifyContent: "center", mb: 2 }}>
                  <img src="/logo.png" alt="Logo" width="150" height="150" />
                </Box>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
          Upload Media
        </Typography>
       
       
      </Toolbar>
    </AppBar>
    <Box sx={{ textAlign: "center", my: 3 }}>
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file || loading} sx={{ ml: 2 }}>
        {loading ? <CircularProgress size={24} /> : "Upload"}
      </Button>
    </Box>
    </Box>
  );
};

export default MediaUpload;
