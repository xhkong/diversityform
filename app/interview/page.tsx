'use client';
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
Container,
Typography,
TextField,
Button,
Box,
FormControl,
FormLabel,
RadioGroup,
FormControlLabel,
Radio,
Snackbar,
Alert,
} from "@mui/material";

import type { Schema } from "@/amplify/data/resource"
import { Amplify } from "aws-amplify"
import { generateClient } from "aws-amplify/api"
import outputs from "@/amplify_outputs.json"

Amplify.configure(outputs)

const client = generateClient<Schema>()


const initialState = {
name: "",
businessName: "",
email: "",
interviewDate: "",
interviewer: "",
experience: "",
suggestions: "",
rating: "",
};

const InterviewFeedback: React.FC = () => {
const [form, setForm] = useState(initialState);
const [donationAmt, setDonationAmt] = useState<number | undefined>(undefined);
const searchParams = useSearchParams();
const interviewId = searchParams.get("interviewid");
const [interviewInfo, setInterviewInfo] = useState<any>(null);

useEffect(() => {
  if (interviewId) {
    client.queries.getInterview({
      id: interviewId,
    }).then(setInterviewInfo);
  }
}, [interviewId]);

const handleRadioChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const rating = e.target.value;
  setForm({ ...form, rating });
  let amt: number | undefined;
  if (rating === "3") amt = 300;
  else if (rating === "4") amt = 400;
  else if (rating === "5") amt = 500;
  else amt = undefined;
  setDonationAmt(amt);
};
const [submitted, setSubmitted] = useState(false);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  setSubmitted(true);
  setForm(initialState);
  if (donationAmt === 300) {
    window.location.href = "https://donate.stripe.com/14AfZi4RGc6A6gD3iSgfu02";
  } else if (donationAmt === 400) {
    window.location.href = "https://donate.stripe.com/14A5kE97W1rWdJ506Ggfu01";
  } else if (donationAmt === 500) {
    window.location.href = "https://donate.stripe.com/4gM28s0Bq8UoawT06Ggfu00";
  } else if (donationAmt) {
    // Redirect to donation page with the amount
    window.location.href = "https://donate.stripe.com/14A5kEac0gmQawTf1Agfu03?__prefilled_amount=" + donationAmt*100;
  }
};

const handleClose = () => setSubmitted(false);

return (
  <Container maxWidth="sm" sx={{ mt: 6 }}>
    <Box
      sx={{
      background: "linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)",
      borderRadius: 3,
      p: 4,
      mb: 4,
      boxShadow: 3,
      textAlign: "center",
      }}
    >
      <Typography
      variant="h4"
      gutterBottom
      sx={{
        fontWeight: 700,
        color: "#2d3a4a",
        letterSpacing: 1,
      }}
      >
      Diversity Media Network Interview Feedback
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          color: "#4b5d6b",
          fontSize: "1.1rem",
          lineHeight: 1.7,
          mt: 2,
        }}
      >
        Diversity Media Network is an independent news organization committed to uplifting voices from all walks of life. Our mission is to bring forward compelling stories from individuals of diverse backgrounds—narratives often overlooked by mainstream media.
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          color: "#4b5d6b",
          fontSize: "1.1rem",
          lineHeight: 1.7,
          mt: 2,
        }}
      >
        We write, collect, and curate these stories with care, and collaborate with news outlets that share our vision to pitch and publish them widely. We proudly operate without funding from governments or political entities, relying entirely on the generous support of individuals who believe in the value of inclusive journalism.
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          color: "#4b5d6b",
          fontSize: "1.1rem",
          lineHeight: 1.7,
          mt: 2,
        }}
      >
        <u>
          If our work resonates with you, we hope you’ll stand with us. Your support doesn’t just sustain our mission—it also helps us evaluate the impact and quality of our journalism. Please share your feedback using the form below so we can continue to improve and empower.
        </u>
      </Typography>
    </Box>
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
      fullWidth
      label="Your Name"
      name="name"
      value={form.name || interviewInfo?.interviewee_name || ""}
      onChange={handleChange}
      margin="normal"
      required
      />
      <TextField
      fullWidth
      label="Business Name"
      name="businessName"
      value={form.businessName || interviewInfo?.interviewee_organization || ""}
      onChange={handleChange}
      margin="normal"
      required
      />
      <TextField
      fullWidth
      label="Journalist's Name"
      name="interviewer"
      value={form.interviewer || interviewInfo?.interviewee_organization || ""}
      onChange={handleChange}
      margin="normal"
      required
      />
      <TextField
      fullWidth
      label="Describe your experience of your interaction with our journalist"
      name="experience"
      value={form.experience}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={4}
      required
      />
      <FormControl component="fieldset" sx={{ mt: 2 }}>
      <FormLabel component="legend">How would you rate your overall experience?</FormLabel>
      <RadioGroup
        row
        name="rating"
        value={form.rating}
        onChange={handleRadioChange}
      >
        <FormControlLabel value="1" control={<Radio />} label="1" />
        <FormControlLabel value="2" control={<Radio />} label="2" />
        <FormControlLabel value="3" control={<Radio />} label="3 (Suggested donation: $300)" />
        <FormControlLabel value="4" control={<Radio />} label="4 (Suggested donation: $400)" />
        <FormControlLabel value="5" control={<Radio />} label="5 (Excellent, suggested donation: $500)" />
      </RadioGroup>
      </FormControl>
      <TextField
      fullWidth
      label="Donation Amount (optional)"
      name="donationAmt"
      type="number"
      value={donationAmt ?? ""}
      onChange={e => setDonationAmt(e.target.value ? Number(e.target.value) : undefined)}
      margin="normal"
      inputProps={{ min: 0 }}
      />
      <TextField
      fullWidth
      label="Any suggestions for improvement?"
      name="suggestions"
      value={form.suggestions}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={3}
      />
      <Button
      type="submit"
      variant="contained"
      color="primary"
      sx={{ mt: 3 }}
      fullWidth
      >
      Submit Feedback
      </Button>
    </Box>
    <Snackbar open={submitted} autoHideDuration={4000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        Thank you for your feedback!
      </Alert>
    </Snackbar>
  </Container>
);
};

export default InterviewFeedback;