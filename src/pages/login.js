import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box, Button, CircularProgress, Container, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [emailError, setEmailError] = useState(""); // Email validation error
  const [passwordError, setPasswordError] = useState(""); // Backend password error

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Regex for email validation
 // Password must contain special characters, numbers, and uppercase letters
 const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required.");
      return;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setPasswordError("Password is required.");
      return;
    }
    else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }else if (!validatePassword(password)) {
      setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
}


    dispatch(loginUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setOpenDialog(true);
      } else {
        console.error("Login failed:", res.payload);
        if (res.payload?.errors) {
          if (res.payload.errors.email) setEmailError(res.payload.errors.email);
          if (res.payload.errors.password) setPasswordError(res.payload.errors.password);
        }
      }
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTimeout(() => navigate("/dashboard"), 300); // Delay navigation slightly
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 4, boxShadow: 4, borderRadius: 3, textAlign: "center", bgcolor: "#fff" }}>
        {/* ✅ Centered Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src="/logo.png" alt="Logo" width="250" height="250" />
        </Box>

        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {error && <Typography color="error">{error.message}</Typography>}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <TextField 
            fullWidth 
            label="Email" 
            variant="outlined" 
            margin="normal" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            error={!!emailError}
            helperText={emailError}
          />

          {/* Password Field with Eye Icon */}
          <TextField 
            fullWidth 
            label="Password" 
            type={showPassword ? "text" : "password"} 
            variant="outlined" 
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, py: 1.5, fontSize: "1rem" }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        <Typography sx={{ mt: 2 }}>
          Don't have an account? <a href="/register">Register</a>
        </Typography>
      </Box>

      {openDialog && (
  <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Login Successful</DialogTitle>
    <DialogContent>
      <Typography>Welcome back, {email}!</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => navigate("/dashboard")} color="primary">OK</Button>
    </DialogActions>
  </Dialog>
)}    </Container>
  );
};

export default Login;
