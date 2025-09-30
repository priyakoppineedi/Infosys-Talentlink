import { useState } from "react";
import api from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("register/", formData);
    alert("Registered successfully! Please login.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
