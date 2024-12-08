import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Container
} from "@mui/material";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/energy-asset/create/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response
        ? error.response.data
        : "An error occurred. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm'>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ 
        padding: 2,
        textAlign: 'center',
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f5f5f5"
    }}
    >
      <Typography variant="h4" gutterBottom>
        {name}
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          type="password"
        />

        {loading && (
          <Box display="flex" justifyContent="center" sx={{ marginY: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={loading}
        >
          {name}
        </Button>
        {method === "login" && (
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                Don&apos;t have an account?{" "}
                <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                Register Here
                </Link>
            </Typography>
        )}
      </form>
    </Box>
    </Container>
  );
}

Form.propTypes = {
  route: PropTypes.string.isRequired,
  method: PropTypes.oneOf(["login", "register"]).isRequired,
};

export default Form;
