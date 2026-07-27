import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// /waitlist route — redirects to homepage and auto-opens the waitlist modal
export default function Waitlist() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { state: { openWaitlist: true }, replace: true });
  }, []);
  return null;
}
