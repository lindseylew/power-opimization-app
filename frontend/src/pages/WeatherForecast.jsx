import { useState } from "react";
import api from "../api";

import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";


const WeatherForecast = () => {
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const fetchWeatherForecast = async () => {
    if (!city) {
      setError("City name is required");
      setForecast([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/api/weather/forecast/${city}/`);
      setForecast(
        Array.isArray(response.data) ? response.data : response.data.items || []
      );
    } catch (err) {
      setError("Failed to fetch weather data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Weather Forecast
      </Typography>
      <TextField
        label="City"
        variant="outlined"
        fullWidth
        value={city}
        onChange={handleCityChange}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={fetchWeatherForecast}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Get Forecast"}
      </Button>

      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: "20px" }}>
          {error}
        </Typography>
      )}

      {Array.isArray(forecast) && forecast.length > 0 && (
        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          {forecast.map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{data.date_time}</Typography>
                  <Typography variant="body2">
                    Temp: {data.temperature}
                  </Typography>
                  <Typography variant="body2">
                    Humidity: {data.humidity}
                  </Typography>
                  <Typography variant="body2">
                    Weather: {data.weather}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WeatherForecast;
