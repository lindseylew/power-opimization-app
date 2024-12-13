import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const OptimizationResults = ({ results }) => {
  if (!results || !results.result || !results.assets) return null;

  return (
    <Card sx={{ marginTop: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Optimization Results
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Demand: {results.demand} MW
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Total Cost: ${results.total_cost.toFixed(2)}
        </Typography>

        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Allocated Capacity (MW)</TableCell>
              <TableCell>Cost per MWh</TableCell>
              <TableCell>Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(results.result).map((assetName) => {
              const allocation = results.result[assetName];
              const cost = allocation * results.assets[assetName].cost_per_mwh;
              return (
                <TableRow key={assetName}>
                  <TableCell>{assetName}</TableCell>
                  <TableCell>{allocation}</TableCell>
                  <TableCell>
                    ${results.assets[assetName].cost_per_mwh}
                  </TableCell>
                  <TableCell>${cost.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

OptimizationResults.propTypes = {
  results: PropTypes.shape({
    demand: PropTypes.number.isRequired,
    total_cost: PropTypes.number.isRequired,
    result: PropTypes.objectOf(PropTypes.number).isRequired,
    assets: PropTypes.objectOf(
      PropTypes.shape({
        cost_per_mwh: PropTypes.number.isRequired,
      })
    )
  })
};

export default OptimizationResults;
