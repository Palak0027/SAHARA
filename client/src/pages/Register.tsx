import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    intent: "donor" as UserRole,
    city: "",
    address: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await register({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
        intent: form.intent,
        location: {
          city: form.city,
          address: form.address,
        },
      });

      if (user.activeRole === "receiver") {
        navigate("/receiver-dashboard");
      } else {
        navigate("/donator-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-green-700">
            SAHARA
          </Link>

          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            Create Your Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join your local community through SAHARA
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength={10}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-gray-400">(optional)</span>
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to
              </label>

              <select
                name="intent"
                value={form.intent}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="donor">Donate to people in need</option>
                <option value="receiver">Receive donations</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>

              <input
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>

              <input
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-700 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}