// src/pages/ProfileEdit.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { isLoggedIn } from "../utils/auth";

function ProfileEdit() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    availability: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put("profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/"); // Go back to dashboard
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Profile</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </label>
        <br /><br />

        <label>
          Bio:
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            rows={4}
          />
        </label>
        <br /><br />

        <label>
          Skills (comma separated):
          <input
            type="text"
            name="skills"
            value={formData.skills || ""}
            onChange={handleChange}
          />
        </label>
        <br /><br />

        <label>
          Availability:
          <input
            type="text"
            name="availability"
            value={formData.availability || ""}
            onChange={handleChange}
          />
        </label>
        <br /><br />

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
}

export default ProfileEdit;
