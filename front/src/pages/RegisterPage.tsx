// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    registrationNumber: "",
    userType: "user", // default утга
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Амжилттай бүртгэгдлээ!");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="firstName"
          placeholder="First Name"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          name="registrationNumber"
          placeholder="Registration No"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        {/* ✅ Хэрэглэгчийн төрөл */}
        <select
          name="userType"
          className="w-full mb-3 p-2 border rounded"
          value={form.userType}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already registered?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
