import { useEffect } from "react";

export default function RichGirl() {
  useEffect(() => {
    window.location.replace("/richgirl.html");
  }, []);
  return null;
}
