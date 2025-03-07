import {
  Box,
  Button,
  FormControlLabel,
  Rating,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

export default function AddDream(props) {
  const [formData, setFormData] = useState({
    description: "",
    recurring: false,
    clarity: 5,
    sleepQuality: 3,
  });

  const userId = props.userId;
  const { userData } = useAuth();
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleRecurring = () => {
    setFormData({ ...formData, recurring: !formData.recurring });
  };

  const handleClarityChange = (_, newValue) => {
    setFormData({ ...formData, clarity: newValue });
  };

  const handleSleepQualityChange = (_, newValue) => {
    setFormData({ ...formData, sleepQuality: newValue || 0 });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userData) {
      if (formData.description === "") {
        setError("The dream field should not be empty");
        return;
      } else {
        setError("");
      }

      await addDoc(collection(db, "dreams"), {
        userId: userId,
        description: formData.description,
        recurring: formData.recurring,
        clarity: formData.clarity,
        sleepQuality: formData.sleepQuality,
        date: Timestamp.now(),
      });
      setFormData({
        description: "",
        recurring: false,
        clarity: 5,
        sleepQuality: 3,
      });
    } else {
      setError("Please login to enter a dream");
    }
  };
  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
          gap: 2,
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Typography variant="h1">What did you dream about?</Typography>
        <TextField
          placeholder="Enter your dream"
          variant="outlined"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={7}
          sx={{ width: "50ch" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <FormControlLabel
              label="Recurring dream?"
              labelPlacement="start"
              sx={{ml: 0, mr: 3}}
              control={
                <Switch
                  checked={formData.recurring}
                  onChange={handleToggleRecurring}
                  color="primary"
                />
              }
            />
          </Box>

          <Box sx={{ display: "flex" }}>
            <Typography gutterBottom>Dream Clarity Level</Typography>
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
              value={formData.sleepQuality || 0}
              onChange={handleSleepQualityChange}
              size="large"
              sx={{ ml: 3 }}
            />
          </Box>
        </Box>

        {error && <Typography color="red">{error}</Typography>}

        <Button type="submit" variant="contained" color="primary">
          Add Dream to Journal
        </Button>
      </Box>
    </>
  );
}
