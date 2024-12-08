import { Box, Button, Grid, InputAdornment, TextField, Snackbar } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import api from "../api";

const OptimizationForm = ({ onSubmit }) => {
  const [demand, setDemand] = useState("");
  const [assets, setAssets] = useState([
    { name: "", max_capacity: "", cost_per_mwh: "" },
  ]);

  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleAddAsset = () => {
    setAssets([...assets, { name: "", max_capacity: "", cost_per_mwh: "" }]);
  };

  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...assets];
    updatedAssets[index][field] = value;
    setAssets(updatedAssets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { demand, assets };
    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await api.post("/api/optimize/save/", data);
      onSubmit(response.data);
      setDemand("");
      setAssets([{ name: "", max_capacity: "", cost_per_mwh: "" }]);

      setStatusMessage("Data sumbitted successfully.")
      setHasError(false);
    } catch (error) {
      console.error("Error submitting optimization data: ", error);

      setStatusMessage("There was an error submitting optimization data: ", error);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Demand"
          value={demand}
          onChange={(e) => setDemand(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">MW</InputAdornment>
            ),
          }}
        />
        {assets.map((asset, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Asset Name"
                  value={asset.name}
                  onChange={(e) =>
                    handleAssetChange(index, "name", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Max Capacity"
                  value={asset.max_capacity}
                  onChange={(e) =>
                    handleAssetChange(index, "max_capacity", e.target.value)
                  }
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">MW</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Cost per MWh"
                  value={asset.cost_per_mwh}
                  onChange={(e) =>
                    handleAssetChange(index, "cost_per_mwh", e.target.value)
                  }
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          onClick={handleAddAsset}
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
        >
          Add Asset
        </Button>
        <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
      <Snackbar
        open={Boolean(statusMessage)}
        message={statusMessage}
        autoHideDuration={6000}
        onClose={() => setStatusMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center"}}
        sx={{
          backgroundColor: hasError ? "red" : "green",
        }}
        />
    </Box>
  );
};

OptimizationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default OptimizationForm;
