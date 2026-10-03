import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(identifier, password);

      if (user.activeRole === "receiver") {
        navigate("/receiver-dashboard");
      } else {
        navigate("/donator-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ed] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-green-700">
            SAHARA
          </Link>

          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue helping your community
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
                Email or Phone
              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-700 hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}