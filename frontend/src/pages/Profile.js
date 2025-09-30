import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    skills: "",
    hourly_rate: "",
    availability: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          full_name: res.data.full_name || "",
          bio: res.data.bio || "",
          skills: res.data.skills || "",
          hourly_rate: res.data.hourly_rate || "",
          availability: res.data.availability || "",
          location: res.data.location || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Use PATCH or PUT depending on your API design
      const cleanedProfile = {
        ...profile,
        hourly_rate: profile.hourly_rate === "" ? null : profile.hourly_rate,
      };

      await api.patch(
        "profile/",
        cleanedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      

      alert("Profile updated successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to save profile.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Name:<br />
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            placeholder="Full Name"
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Bio:<br />
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Short bio"
            rows={4}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Skills (comma separated):<br />
          <input
            type="text"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node, Python"
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Hourly Rate ($):<br />
          <input
            type="number"
            name="hourly_rate"
            value={profile.hourly_rate}
            onChange={handleChange}
            placeholder="e.g. 40.00"
            step="0.01"
            min="0"
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Availability:<br />
          <input
            type="text"
            name="availability"
            value={profile.availability}
            onChange={handleChange}
            placeholder="e.g. Full-time, Part-time"
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Location:<br />
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            placeholder="e.g. Remote, NYC"
          />
        </label>
      </div>

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </button>

      <button
        style={{ marginLeft: "1rem" }}
        onClick={() => navigate("/")}
        disabled={saving}
      >
        Cancel / Back to Dashboard
      </button>
    </div>
  );
}

export default Profile;
