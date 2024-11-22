"use client";
import DForm from "./dform";
export default function App() {
  let paramValue = '';

  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    paramValue = searchParams.get('formId') || '';
  }

  return (
    <DForm id={paramValue} />
  );
}
