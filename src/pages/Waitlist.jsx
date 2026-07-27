import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Waitlist() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/?waitlist=1", { replace: true });
  }, []);
  return null;
}
