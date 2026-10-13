import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../components/image/sahara-logo.jpeg';
import Navbar from '../components/Navbar';
import { loginTranslations, type Language, type LoginErrorKey } from './translations';
import { useAuth, type UserRole } from '../context/AuthContext';
import '../styles/Login.css';

/* ---------- Config ---------- */

const ROLE_ROUTES: Record<UserRole, string> = {
  donor: '/donator-dashboard',
  receiver: '/receiver-dashboard',
  volunteer: '/volunteer-dashboard',
  admin: '/admin-dashboard'
};

const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Decorative, language-neutral icons (food, clothes, books, blankets) */
const FEATURE_ICONS = ['💚', '🤝', '🌿', '✓'];
const CATEGORY_CHIPS = ['🍞', '👕', '📚', '🧣'];

/* ---------- Types ---------- */

interface LoginForm {
  phone: string;
  password: string;
}

type FieldName = keyof LoginForm;
type FormErrors = Partial<Record<FieldName, LoginErrorKey>>;

/* ---------- Validation ---------- */

const validateField = (name: FieldName, value: string): LoginErrorKey | undefined => {
  if (name === 'phone') {
    if (!value) return 'phoneRequired';

    const trimmed = value.trim();
    const isPhone = PHONE_REGEX.test(trimmed);
    const isEmail = EMAIL_REGEX.test(trimmed);

    if (!isPhone && !isEmail) return 'phoneInvalid';
  }

  if (name === 'password' && !value) return 'passwordRequired';
  return undefined;
};

/* ---------- Reusable field ---------- */

interface FieldProps {
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  icon: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FC<FieldProps> = ({
  label,
  name,
  value,
  error,
  type = 'text',
  placeholder,
  maxLength,
  autoComplete,
  inputMode,
  icon,
  onChange
}) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`lg-field${error ? ' lg-field--error' : ''}`}>
      <label htmlFor={name}>{label}</label>

      <div className="lg-field__control">
        <span className="lg-field__icon" aria-hidden="true">
          {icon}
        </span>

        <input
          id={name}
          name={name}
          type={isPassword && visible ? 'text' : type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={error ? true : undefined}
          onChange={onChange}
        />

        {isPassword && (
          <button
            type="button"
            className="lg-field__toggle"
            onClick={() => setVisible(prev => !prev)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      {error && <span className="lg-field__error">{error}</span>}
    </div>
  );
};

/* ---------- Page ---------- */

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [language, setLanguage] = useState<Language>('en');
  const [form, setForm] = useState<LoginForm>({ phone: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');

  const t = loginTranslations[language];

  const errorText = (name: FieldName) => {
    const key = errors[name];
    return key ? t.errors[key] : undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;

    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const nextErrors: FormErrors = {};
    (Object.keys(form) as FieldName[]).forEach(field => {
      const error = validateField(field, form[field]);
      if (error) nextErrors[field] = error;
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setServerError('');

      const user = await login(form.phone, form.password);
      const role = user.activeRole || user.role || 'donor';
      navigate(ROLE_ROUTES[role], { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login">
      <Navbar
        language={language}
        toggleLanguage={() => setLanguage(current => (current === 'en' ? 'hi' : 'en'))}
      />

      <main className="login__main">
        {/* Left: welcome + logo card */}
        <section className="lg-intro">
          <h2 className="lg-intro__title">{t.welcome}</h2>
          <p className="lg-intro__text">{t.welcomeText}</p>

          <div className="lg-intro__hero">
            <div className="lg-logo">
              <span className="lg-logo__ring" aria-hidden="true" />
              <div className="lg-logo__disc">
                <img src={logoImg} alt="SAHARA – Give what you can, get what you need" />
              </div>

              {CATEGORY_CHIPS.map((emoji, index) => (
                <span key={emoji} className={`lg-chip lg-chip--${index + 1}`} aria-hidden="true">
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <ul className="lg-intro__features">
            {FEATURE_ICONS.map((icon, index) => (
              <li key={icon}>
                <span className="lg-intro__icon" aria-hidden="true">{icon}</span>
                <span>{t.features[index]}</span>
              </li>
            ))}
          </ul>

          <p className="lg-intro__quote">“{t.quote}”</p>
        </section>

        {/* Right: login form */}
        <section className="lg-card">
          <div className="lg-card__head">
            <div>
              <h2 className="lg-card__title">{t.title}</h2>
              <p className="lg-card__subtitle">{t.subtitle}</p>
            </div>
            <span className="lg-card__badge">{t.badge}</span>
          </div>

          <form className="lg-form" onSubmit={handleSubmit} noValidate>
            <Field
              icon="📱"
              label={t.labels.phone}
              name="phone"
              type="text"
              inputMode="email"
              value={form.phone}
              placeholder={t.placeholders.phone}
              autoComplete="username"
              error={errorText('phone')}
              onChange={handleChange}
            />

            <Field
              icon="🔑"
              label={t.labels.password}
              name="password"
              type="password"
              value={form.password}
              placeholder={t.placeholders.password}
              autoComplete="current-password"
              error={errorText('password')}
              onChange={handleChange}
            />

            {serverError && (
              <p className="lg-form__error" role="alert">
                {serverError}
              </p>
            )}

            <button type="submit" className="lg-submit" disabled={loading}>
              {loading ? (
                t.loggingIn
              ) : (
                <>
                  {t.loginBtn} <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="lg-card__foot">
            <p className="lg-card__secure">🔒 {t.secureNote}</p>
            <p className="lg-card__register">
              {/* TODO: point this to your real forgot-password route */}
              {t.forgotaccount} <Link to="/forgot-password">{t.Password1} →</Link>
            </p>
            <p className="lg-card__register">
              {t.noAccount} <Link to="/register">{t.register} →</Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="login__footer">
        © 2026 SAHARA &nbsp;•&nbsp; Give &nbsp;•&nbsp; Help &nbsp;•&nbsp; Build Communities
        &nbsp;•&nbsp; Together
      </footer>
    </div>
  );
};

export default Login;