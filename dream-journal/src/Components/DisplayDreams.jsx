import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Rating,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid2";
import { useState } from "react";


export default function DisplayDreams(props) {
  const dreams = props.dreams;
  const userId = props.userId;
  const [open, setOpen] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    recurring: false,
    clarity: 0,
    sleepQuality: 0,
  });

  const deleteDream = async (id) => {
    await deleteDoc(doc(db, "dreams", id));
  };

  const handleOpen = (dream) => {
    setSelectedDream(dream);
    setFormData({
      description: dream.description || "",
      recurring: dream.recurring || false,
      clarity: dream.clarity || 0,
      sleepQuality: dream.sleepQuality || 0,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDream(null);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    if (!selectedDream) return;
    try {
      const dreamRef = doc(db, "dreams", selectedDream.id);
      await updateDoc(dreamRef, {
        description: formData.description,
        recurring: formData.recurring,
        clarity: formData.clarity,
        sleepQuality: formData.sleepQuality,
      });
    } catch (error) {
      console.error("Error updating dream: ", error);
    }
    handleClose();
  };

  const handleToggleRecurring = () => {
    setFormData({ ...formData, recurring: !formData.recurring });
  };

  const handleClarityChange = (_, newValue) => {
    setFormData({ ...formData, clarity: newValue });
  };

  const handleSleepQualityChange = (_, newValue) => {
    setFormData({ ...formData, sleepQuality: newValue });
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        alignItems="center"
        direction="column"
        sx={{ minHeight: "100vh" }}
      >
        <Typography variant="h1">Journal</Typography>
        {dreams.map(
          (dream) =>
            userId === dream.userId && (
              <Grid
                key={dream.id}
                xs={12}
                sx={{ width: "80%", display: "flex", mt: 5 }}
              >
                <Card sx={{ minHeight: 200, width: "100%" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">
                      <strong>Dream </strong>
                    </Typography>
                    <Typography variant="body1">{dream.description}</Typography>
                    <Typography variant="body1">
                      <strong>Date: </strong>{" "}
                      {dream.date?.toDate().toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Recurring dream? </strong>
                      {dream.recurring == true ? "Yes" : "No"}
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      <Typography gutterBottom>
                        {" "}
                        <strong>Dream Clarity Level</strong>
                        {` ${dream.clarity} `}
                      </Typography>
                      <Slider
                        value={dream.clarity}
                        min={1}
                        max={10}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{ width: 200, ml: 3 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Typography variant="body1">
                        <strong>Sleep Quality</strong>
                      </Typography>
                      <Rating
                        name="sleepQuality"
                        value={dream.sleepQuality}
                        size="large"
                        sx={{ ml: 3 }}
                        readOnly
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => deleteDream(dream.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpen(dream)}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>

                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Edit Dream</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Description"
                      name="description"
                      fullWidth
                      multiline
                      margin="dense"
                      value={formData.description}
                      onChange={handleChange}
                    />

                    <FormControlLabel
                      label="Recurring Dream?"
                      control={
                        <Switch
                          checked={formData.recurring}
                          onChange={handleToggleRecurring}
                          color="primary"
                        />
                      }
                    />
                    <Box sx={{ display: "flex" }}>
                      <Typography gutterBottom>
                        Dream Clarity Level{` ${formData.clarity} `}
                      </Typography>
                      <Slider
                        value={formData.clarity}
                        onChange={handleClarityChange}
                        min={1}
                        max={10}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{ width: 200, ml: 3 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Typography variant="body1">Sleep Quality</Typography>
                      <Rating
                        name="sleepQuality"
                        value={formData.sleepQuality}
                        onChange={handleSleepQualityChange}
                        size="large"
                        sx={{ ml: 3 }}
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            )
        )}
      </Grid>
    </>
  );
}
