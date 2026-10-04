import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectByRole = (role?: UserRole) => {
    if (role === "receiver") {
      navigate("/receiver-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "volunteer") {
      navigate("/volunteer-dashboard");
    } else {
      navigate("/donator-dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(identifier, password);

      const role = user.activeRole || user.role;

      redirectByRole(role);
    } catch (err: any) {
      setError(
        err?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-3xl font-bold text-[#2F5547]"
          >
            SAHARA
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-[#26332F]">
            Welcome Back
          </h1>

          <p className="mt-2 text-[#71817A]">
            Login to continue helping your community
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#DDE6DF] bg-white p-6 shadow-lg sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Identifier */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-[#26332F]"
              >
                Email or Phone
              </label>

              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-[#D9E1DB] px-4 py-3 text-[#26332F] outline-none transition placeholder:text-[#9AA8A1] focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#26332F]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[#D9E1DB] px-4 py-3 text-[#26332F] outline-none transition placeholder:text-[#9AA8A1] focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#4F7C68] py-3 font-semibold text-white transition hover:bg-[#3E6856] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-[#71817A]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#4F7C68] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Small footer text */}
        <p className="mt-6 text-center text-xs text-[#9AA8A1]">
          Give What You Can, Get What You Need
        </p>
      </div>
    </div>
  );
}