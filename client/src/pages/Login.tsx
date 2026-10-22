import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import volunteersImg from '../components/image/volunteers.jpg';
import {
  GiftIcon,
  HandHeartIcon,
  HeartIcon,
  UsersIcon,
  SproutIcon,
  ShieldCheckIcon,
  LockIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon
} from '../components/Icons/Icons';
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

/* One icon per feature (same order as t.features) */
const FEATURE_ICONS = [HeartIcon, HandHeartIcon, SproutIcon, ShieldCheckIcon];

/* Small local icon for the phone / email field */
const UserIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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
  icon: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  language: Language;
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
  onChange,
  language
}) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  const toggleLabel =
    language === 'hi'
      ? visible ? 'पासवर्ड छिपाएँ' : 'पासवर्ड दिखाएँ'
      : visible ? 'Hide password' : 'Show password';

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
            aria-label={toggleLabel}
          >
            {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>

      {/* Absolutely positioned in CSS, so an error never moves the layout */}
      {error && (
        <span className="lg-field__error" title={error}>
          {error}
        </span>
      )}
    </div>
  );
};

/* ---------- Page ---------- */

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sahara-language');
    return saved === 'hi' ? 'hi' : 'en';
  });
  const [form, setForm] = useState<LoginForm>({ phone: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');

  const t = loginTranslations[language];

  const toggleLanguage = () => {
    const nextLanguage: Language = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLanguage);
    localStorage.setItem('sahara-language', nextLanguage);
  };

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
      <Navbar language={language} toggleLanguage={toggleLanguage} />

      <main className="login__main">
        {/* Left: welcome + photo + features */}
        <section className="lg-intro">
          <h2 className="lg-intro__title">{t.welcome}</h2>
          <p className="lg-intro__text">{t.welcomeText}</p>

          <div className="lg-photo">
            <span className="lg-photo__frame" aria-hidden="true" />
            <img
              className="lg-photo__img"
              src={volunteersImg}
              alt="Volunteers packing donated food together"
            />
            <span className="lg-photo__shade" aria-hidden="true" />
            <span className="lg-photo__badge" aria-hidden="true">
              <HandHeartIcon size={24} />
            </span>
            <span className="lg-photo__tags" aria-hidden="true">
              <GiftIcon size={16} />
              <HeartIcon size={16} />
              <UsersIcon size={16} />
            </span>
            <p className="lg-photo__caption">“{t.quote}”</p>
          </div>

          <ul className="lg-intro__features">
            {FEATURE_ICONS.map((Icon, index) => (
              <li key={index}>
                <span className="lg-intro__icon">
                  <Icon size={18} />
                </span>
                <span>{t.features[index]}</span>
              </li>
            ))}
          </ul>
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
              icon={<UserIcon />}
              label={t.labels.phone}
              name="phone"
              type="text"
              inputMode="email"
              value={form.phone}
              placeholder={t.placeholders.phone}
              autoComplete="username"
              error={errorText('phone')}
              onChange={handleChange}
              language={language}
            />

            <Field
              icon={<LockIcon size={18} />}
              label={t.labels.password}
              name="password"
              type="password"
              value={form.password}
              placeholder={t.placeholders.password}
              autoComplete="current-password"
              error={errorText('password')}
              onChange={handleChange}
              language={language}
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
                  {t.loginBtn} <ArrowRightIcon size={18} />
                </>
              )}
            </button>
          </form>

          <div className="lg-card__foot">
            <p className="lg-card__secure">
              <LockIcon size={14} /> {t.secureNote}
            </p>
            <p className="lg-card__register">
              {/* TODO: point this to your real forgot-password route */}
              {t.forgotaccount} <Link to="/forgot-password">{t.Password1}</Link>
            </p>
            <p className="lg-card__register">
              {t.noAccount} <Link to="/register">{t.register}</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
