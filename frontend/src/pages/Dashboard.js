import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { isLoggedIn } from "../utils/auth";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile...");
      const res = await api.get("profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile fetched:", res.data);
      setProfile(res.data);
      setError(null);
    } catch (err) {
  console.error("Error fetching profile", err.response || err.message || err);
  setError("Failed to load profile");
}

  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchProfile();
    }
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to FreelancerHub</h1>
      <p>
        This is a platform for freelancers to manage their profile, set
        availability, and showcase their skills.
      </p>

      {!isLoggedIn() ? (
        <div>
          <p>Please log in or register to get started:</p>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          
            <button
            onClick={() => {
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
              navigate("/login");
            }}
            style={{ marginLeft: "1rem" }}
          >
            Logout
          </button>

          <h2>Your Profile</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {profile ? (
            <>
              <pre>{JSON.stringify(profile, null, 2)}</pre>
              <button onClick={() => navigate("/profile")}>Edit Profile</button>
            </>
          ) : (
            !error && <p>Loading profile...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
