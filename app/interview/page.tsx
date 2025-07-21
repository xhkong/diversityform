import React, { Suspense } from "react";
import InterviewFeedback from "./interviewfeedback";

function InterviewFeedbackWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewFeedback />
    </Suspense>
  );
}

export default InterviewFeedbackWrapper;