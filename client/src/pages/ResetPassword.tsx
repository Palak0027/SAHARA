import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { http } from '../services/api/http';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError('This reset link is missing its token. Request a new password reset email.');
      return;
    }
    if (password.length < 6) {
      setError('Your password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await http.post<{ success: boolean; message: string }>(
        '/api/auth/reset-password', { token, password }
      );
      setSuccess(response.message || 'Password reset successfully.');
      window.setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset your password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8F5] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#DDE6DF] bg-white p-6 shadow-lg sm:p-8">
        <Link to="/login" className="text-sm font-semibold text-[#2F5547]">← Back to login</Link>
        <div className="mt-7 mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2EC] text-2xl">🛡️</div>
          <h1 className="text-2xl font-bold text-[#26332F]">Create a new password</h1>
          <p className="mt-2 text-sm leading-6 text-[#71817A]">Choose a new password for your SAHARA account.</p>
        </div>
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{success}</p>}
        {!success && <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#26332F]">New password</label>
            <input id="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-xl border border-[#DDE6DF] px-4 py-3 text-[#26332F] outline-none transition focus:border-[#2F5547] focus:ring-2 focus:ring-[#2F5547]/15" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#26332F]">Confirm new password</label>
            <input id="confirmPassword" type="password" autoComplete="new-password" minLength={6} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className="w-full rounded-xl border border-[#DDE6DF] px-4 py-3 text-[#26332F] outline-none transition focus:border-[#2F5547] focus:ring-2 focus:ring-[#2F5547]/15" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#2F5547] px-4 py-3 font-semibold text-white transition hover:bg-[#244438] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Updating password…' : 'Reset password →'}</button>
        </form>}
        {success && <p className="mt-5 text-center text-sm text-[#71817A]">Redirecting you to login…</p>}
      </section>
    </main>
  );
}
