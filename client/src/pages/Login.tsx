import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../components/image/image.png';
import { loginTranslations, type Language, type LoginErrorKey } from './translations';
import { loginUser } from '../services/api/auth';
import '../styles/Login.css';

/* ---------- Config ---------- */

// Change these paths to match the routes declared in App.tsx
const ROLE_ROUTES: Record<string, string> = {
  donor: '/donor-dashboard',
  receiver: '/receiver-dashboard',
  volunteer: '/',
  admin: '/'
};

const PHONE_REGEX = /^[6-9]\d{9}$/;

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
    if (!PHONE_REGEX.test(value)) return 'phoneInvalid';
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
          onChange={onChange}
        />

        {isPassword && (
          <button
            type="button"
            className="lg-field__toggle"
            onClick={() => setVisible(prev => !prev)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? '🙈' : '👁'}
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

  const [language, setLanguage] = useState<Language>('en');
  const [form, setForm] = useState<LoginForm>({ phone: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const t = loginTranslations[language];

  const errorText = (name: FieldName) => {
    const key = errors[name];
    return key ? t.errors[key] : undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    // Phone accepts digits only
    const value = name === 'phone' ? e.target.value.replace(/\D/g, '') : e.target.value;

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
      setLoading(true);
      setServerError('');

      const { token, user } = await loginUser(form);

      localStorage.setItem('sahara_token', token);
      localStorage.setItem('sahara_user', JSON.stringify(user));

      navigate(ROLE_ROUTES[user.role] ?? '/', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <header className="login__top">
        <div className="lg-brand">
          <img src={logoImg} alt="SAHARA logo" className="lg-brand__logo" />
          <div>
            <h1 className="lg-brand__name">{t.brand}</h1>
            <p className="lg-brand__tagline">{t.tagline}</p>
          </div>
        </div>

        <div className="lg-lang">
          <span className="lg-lang__label">{t.languageLabel}</span>
          {(['en', 'hi'] as Language[]).map(code => (
            <button
              key={code}
              type="button"
              className={`lg-lang__btn${language === code ? ' is-active' : ''}`}
              onClick={() => setLanguage(code)}
            >
              {code === 'en' ? 'EN' : 'हिंदी'}
            </button>
          ))}
        </div>
      </header>

      <main className="login__main">
        <section className="lg-intro">
          <h2 className="lg-intro__title">{t.welcome}</h2>
          <p className="lg-intro__text">{t.welcomeText}</p>

          <ul className="lg-intro__features">
            {['♡', '♧', '🌿', '✓'].map((icon, index) => (
              <li key={icon}>
                <span className="lg-intro__icon">{icon}</span>
                {t.features[index]}
              </li>
            ))}
          </ul>

          <div className="lg-intro__hero">
            <img src={logoImg} alt="Helping the community" />
          </div>

          <p className="lg-intro__quote">“{t.quote}”</p>
        </section>

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
              type="tel"
              inputMode="numeric"
              value={form.phone}
              placeholder={t.placeholders.phone}
              maxLength={10}
              autoComplete="tel"
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
              {t.forgotaccount} <Link to="/register">{t.Password1} →</Link>
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