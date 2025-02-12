import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/authSlice";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Email validation function
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password validation function
  const validatePassword = (password) => password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      isValid = false;
    }

    if (!isValid) return;

    dispatch(registerUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
      } else {
        console.error("Registration failed:", res.payload);
        if (res.payload?.errors) {
          if (res.payload.errors.email) setEmailError(res.payload.errors.email);
          if (res.payload.errors.password) setPasswordError(res.payload.errors.password);
        }
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 6, p: 4, boxShadow: 4, borderRadius: 3, textAlign: "center", bgcolor: "#fff" }}>
        {/* Centered Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src="/logo.png" alt="Logo" width="250" height="250" />
        </Box>

        <Typography variant="h5" gutterBottom>
          Create Account
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

          {/* Register Button */}
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, py: 1.5, fontSize: "1rem" }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>

        <Typography sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
