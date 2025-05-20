import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/UserMeetings");
    } else {
      console.error("No token found");
      navigate("/HomePage");
    }
  }, [navigate]);

  return <p>מתחבר לחשבון...</p>;
};

export default OAuthCallback;
