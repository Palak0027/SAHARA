import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../components/image/sahara-logo.jpeg';
import Navbar from '../components/Navbar';
import { translations, type ErrorKey, type Language } from './translations';
import { useAuth, type RegisterData } from '../context/AuthContext';
import '../styles/Register.css';

/* ---------- Types ---------- */

type Intent = 'donor' | 'receiver' | 'volunteer';
type ReceiverType = 'individual' | 'family' | 'community' | 'organization';

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  address: string;
  password: string;
  confirmPassword: string;
  receiverType: ReceiverType;
  orgName: string;
  regNumber: string;
  description: string;
  isOnBehalf: boolean;
  beneficiaryName: string;
  beneficiaryAge: string;
  relationship: string;
  beneficiaryLocation: string;
}

type FieldName = keyof FormData;
type FormErrors = Partial<Record<FieldName, ErrorKey>>;

const INITIAL_FORM: FormData = {
  name: '',
  phone: '',
  email: '',
  city: '',
  pincode: '',
  address: '',
  password: '',
  confirmPassword: '',
  receiverType: 'individual',
  orgName: '',
  regNumber: '',
  description: '',
  isOnBehalf: false,
  beneficiaryName: '',
  beneficiaryAge: '',
  relationship: '',
  beneficiaryLocation: ''
};

const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINCODE_REGEX = /^\d{6}$/;

/* Decorative, language-neutral icons (food, clothes, books, blankets) */
const FEATURE_ICONS = ['💚', '🤝', '🌿', '✓'];
const CATEGORY_CHIPS = ['🍞', '👕', '📚', '🧣'];

/* ---------- Validation ---------- */

const validateField = (
  name: FieldName,
  value: string,
  form: FormData,
  intent: Intent
): ErrorKey | undefined => {
  const text = value.trim();
  const isReceiver = intent === 'receiver';

  switch (name) {
    case 'name':
      if (!text) return 'nameRequired';
      if (text.length < 2) return 'nameShort';
      break;
    case 'phone':
      if (!value) return 'phoneRequired';
      if (!PHONE_REGEX.test(value)) return 'phoneInvalid';
      break;
    case 'email':
      if (value && !EMAIL_REGEX.test(value)) return 'emailInvalid';
      break;
    case 'city':
      if (!text) return 'cityRequired';
      break;
    case 'pincode':
      if (value && !PINCODE_REGEX.test(value)) return 'pincodeInvalid';
      break;
    case 'address':
      if (!text) return 'addressRequired';
      break;
    case 'password':
      if (!value) return 'passwordRequired';
      if (value.length < 6) return 'passwordShort';
      break;
    case 'confirmPassword':
      if (!value) return 'confirmRequired';
      if (value !== form.password) return 'passwordMismatch';
      break;
    case 'orgName':
      if (isReceiver && form.receiverType === 'organization' && !text) return 'orgNameRequired';
      break;
    case 'beneficiaryName':
      if (isReceiver && form.isOnBehalf && !text) return 'beneficiaryRequired';
      break;
    case 'relationship':
      if (isReceiver && form.isOnBehalf && !text) return 'relationshipRequired';
      break;
  }
  return undefined;
};

const getFieldsToValidate = (form: FormData, intent: Intent): FieldName[] => {
  const fields: FieldName[] = [
    'name', 'phone', 'email', 'city', 'pincode', 'address', 'password', 'confirmPassword'
  ];

  if (intent === 'receiver') {
    if (form.receiverType === 'organization') {
      fields.push('orgName');
    } else if (form.isOnBehalf) {
      fields.push('beneficiaryName', 'relationship');
    }
  }
  return fields;
};

/* ---------- Payload ---------- */

const buildPayload = (form: FormData, intent: Intent): RegisterData => {
  const payload: RegisterData = {
    intent,
    name: form.name,
    phone: form.phone,
    email: form.email,
    password: form.password,
    location: {
      address: form.address,
      city: form.city,
      pincode: form.pincode
    }
  };

  if (intent !== 'receiver') return payload;

  payload.receiverType = form.receiverType;

  if (form.receiverType === 'organization') {
    payload.organization = {
      orgName: form.orgName,
      regNumber: form.regNumber,
      description: form.description
    };
  } else if (form.isOnBehalf) {
    payload.onBehalfOf = {
      isOnBehalf: true,
      beneficiaryName: form.beneficiaryName,
      beneficiaryAge: form.beneficiaryAge ? Number(form.beneficiaryAge) : undefined,
      relationship: form.relationship,
      beneficiaryLocation: form.beneficiaryLocation
    };
  } else {
    payload.onBehalfOf = { isOnBehalf: false };
  }

  return payload;
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
  wide?: boolean;
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
  wide,
  onChange
}) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`field${wide ? ' field--wide' : ''}${error ? ' field--error' : ''}`}>
      <label htmlFor={name}>{label}</label>

      <div className="field__control">
        <input
          id={name}
          name={name}
          type={isPassword && visible ? 'text' : type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          onChange={onChange}
        />

        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setVisible(prev => !prev)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

    <span className="field__error">
  {error || '\u00A0'}
</span>
    </div>
  );
};

/* ---------- Page ---------- */

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [intent, setIntent] = useState<Intent>('donor');
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');

  const t = translations[language];
  const isReceiver = intent === 'receiver';
  const isOrganization = isReceiver && form.receiverType === 'organization';
  const showOnBehalf = isReceiver && form.receiverType !== 'organization';

  const errorText = (name: FieldName) => {
    const key = errors[name];
    return key ? t.errors[key] : undefined;
  };

  const handleIntentChange = (next: Intent) => {
    setIntent(next);
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const field = name as FieldName;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    const nextForm = { ...form, [field]: fieldValue } as FormData;
    setForm(nextForm);

    setErrors(prev => {
      const next: FormErrors = {
        ...prev,
        [field]: validateField(field, String(fieldValue), nextForm, intent)
      };

      // Keep the confirm-password error in sync when password changes
      if (field === 'password' && nextForm.confirmPassword) {
        next.confirmPassword = validateField(
          'confirmPassword', nextForm.confirmPassword, nextForm, intent
        );
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const nextErrors: FormErrors = {};
    getFieldsToValidate(form, intent).forEach(field => {
      const error = validateField(field, String(form[field]), form, intent);
      if (error) nextErrors[field] = error;
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setServerError('');
      await register(buildPayload(form, intent));
      navigate('/login', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="register">
      <Navbar
        language={language}
        toggleLanguage={() => setLanguage(current => (current === 'en' ? 'hi' : 'en'))}
      />

      <main className="register__main">
        {/* Left: welcome + logo card */}
        <section className="intro">
          <h2 className="intro__title">{t.welcome}</h2>
          <p className="intro__text">{t.welcomeText}</p>

          <div className="intro__hero">
            <div className="logo-card">
              <span className="logo-card__ring" aria-hidden="true" />
              <div className="logo-card__disc">
                <img src={logoImg} alt="SAHARA – Give what you can, get what you need" />
              </div>

              {CATEGORY_CHIPS.map((emoji, index) => (
                <span key={emoji} className={`chip chip--${index + 1}`} aria-hidden="true">
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <ul className="intro__features">
            {FEATURE_ICONS.map((icon, index) => (
              <li key={icon}>
                <span className="intro__icon" aria-hidden="true">{icon}</span>
                <span>{t.features[index]}</span>
              </li>
            ))}
          </ul>

          <p className="intro__quote">“{t.quote}”</p>
        </section>

        {/* Right: form */}
        <section className={`card${isReceiver ? ' card--receiver' : ''}`}>
          <div className="card__head">
            <h2 className="card__title">{t.title}</h2>
            <p className="card__subtitle">{t.subtitle}</p>
          </div>

          <div className="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={intent === 'donor'}
              className={`tabs__btn${intent === 'donor' ? ' is-active' : ''}`}
              onClick={() => handleIntentChange('donor')}
            >
              <span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg"  height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="M640-440 474-602q-31-30-52.5-66.5T400-748q0-55 38.5-93.5T532-880q32 0 60 13.5t48 36.5q20-23 48-36.5t60-13.5q55 0 93.5 38.5T880-748q0 43-21 79.5T807-602L640-440Zm0-112 109-107q19-19 35-40.5t16-48.5q0-22-15-37t-37-15q-14 0-26.5 5.5T700-778l-60 72-60-72q-9-11-21.5-16.5T532-800q-22 0-37 15t-15 37q0 27 16 48.5t35 40.5l109 107ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Zm520-546Z"/></svg> </span> {t.donorTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isReceiver}
              className={`tabs__btn${isReceiver ? ' is-active' : ''}`}
              onClick={() => handleIntentChange('receiver')}
            >
              <span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M475-160q4 0 8-2t6-4l328-328q12-12 17.5-27t5.5-30q0-16-5.5-30.5T817-607L647-777q-11-12-25.5-17.5T591-800q-15 0-30 5.5T534-777l-11 11 74 75q15 14 22 32t7 38q0 42-28.5 70.5T527-522q-20 0-38.5-7T456-550l-75-74-175 175q-3 3-4.5 6.5T200-435q0 8 6 14.5t14 6.5q4 0 8-2t6-4l136-136 56 56-135 136q-3 3-4.5 6.5T285-350q0 8 6 14t14 6q4 0 8-2t6-4l136-135 56 56-135 136q-3 2-4.5 6t-1.5 8q0 8 6 14t14 6q4 0 7.5-1.5t6.5-4.5l136-135 56 56-136 136q-3 3-4.5 6.5T454-180q0 8 6.5 14t14.5 6Zm-1 80q-37 0-65.5-24.5T375-166q-34-5-57-28t-28-57q-34-5-56.5-28.5T206-336q-38-5-62-33t-24-66q0-20 7.5-38.5T149-506l232-231 131 131q2 3 6 4.5t8 1.5q9 0 15-5.5t6-14.5q0-4-1.5-8t-4.5-6L398-777q-11-12-25.5-17.5T342-800q-15 0-30 5.5T285-777L144-635q-9 9-15 21t-8 24q-2 12 0 24.5t8 23.5l-58 58q-17-23-25-50.5T40-590q2-28 14-54.5T87-692l141-141q24-23 53.5-35t60.5-12q31 0 60.5 12t52.5 35l11 11 11-11q24-23 53.5-35t60.5-12q31 0 60.5 12t52.5 35l169 169q23 23 35 53t12 61q0 31-12 60.5T873-437L545-110q-14 14-32.5 22T474-80Zm-99-560Z"/></svg></span> {t.receiverTab}
            </button>
          </div>

          <div className="card__body">
            <form className="form" onSubmit={handleSubmit} noValidate>
              {isReceiver && (
                <div className="field field--wide">
                  <label htmlFor="receiverType">{t.labels.receiverType}</label>

                  
                  <div className="field__control">
                    <select
                      id="receiverType"
                      name="receiverType"
                      value={form.receiverType}
                      onChange={handleChange}
                    >
                      {(Object.keys(t.receiverTypes) as ReceiverType[]).map(type => (
                        <option key={type} value={type}>
                          {t.receiverTypes[type]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <Field
                label={t.labels.name}
                name="name"
                value={form.name}
                placeholder={t.placeholders.name}
                autoComplete="name"
                error={errorText('name')}
                onChange={handleChange}
              />
              <Field
                label={t.labels.phone}
                name="phone"
                type="tel"
                value={form.phone}
                placeholder={t.placeholders.phone}
                maxLength={10}
                autoComplete="tel"
                error={errorText('phone')}
                onChange={handleChange}
              />
              <Field
                label={t.labels.email}
                name="email"
                type="email"
                value={form.email}
                placeholder={t.placeholders.email}
                autoComplete="email"
                error={errorText('email')}
                onChange={handleChange}
              />
              <Field
                label={t.labels.pincode}
                name="pincode"
                value={form.pincode}
                placeholder={t.placeholders.pincode}
                maxLength={6}
                autoComplete="postal-code"
                error={errorText('pincode')}
                onChange={handleChange}
              />
              <Field
                label={t.labels.city}
                name="city"
                value={form.city}
                placeholder={t.placeholders.city}
                autoComplete="address-level2"
                error={errorText('city')}
                onChange={handleChange}
              />
              <Field
                label={t.labels.address}
                name="address"
                value={form.address}
                placeholder={t.placeholders.address}
                autoComplete="street-address"
                error={errorText('address')}
                onChange={handleChange}
              />

              {isOrganization && (
                <div className="box">
                  <Field
                    label={t.labels.orgName}
                    name="orgName"
                    value={form.orgName}
                    error={errorText('orgName')}
                    onChange={handleChange}
                  />
                  <Field
                    label={t.labels.regNumber}
                    name="regNumber"
                    value={form.regNumber}
                    onChange={handleChange}
                  />
                  <Field
                    wide
                    label={t.labels.description}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              )}

              {showOnBehalf && (
                <div className="box">
                  <label className="box__check">
                    <input
                      type="checkbox"
                      name="isOnBehalf"
                      checked={form.isOnBehalf}
                      onChange={handleChange}
                    />
                    <span>{t.onBehalfCheck}</span>
                  </label>

                  {form.isOnBehalf && (
                    <>
                      <Field
                        label={t.labels.beneficiaryName}
                        name="beneficiaryName"
                        value={form.beneficiaryName}
                        error={errorText('beneficiaryName')}
                        onChange={handleChange}
                      />
                      <Field
                        label={t.labels.beneficiaryAge}
                        name="beneficiaryAge"
                        type="number"
                        value={form.beneficiaryAge}
                        onChange={handleChange}
                      />
                      <Field
                        label={t.labels.relationship}
                        name="relationship"
                        value={form.relationship}
                        error={errorText('relationship')}
                        onChange={handleChange}
                      />
                      <Field
                        label={t.labels.beneficiaryLocation}
                        name="beneficiaryLocation"
                        value={form.beneficiaryLocation}
                        onChange={handleChange}
                      />
                    </>
                  )}
                </div>
              )}

              <Field
                label={t.labels.password}
                name="password"
                type="password"
                value={form.password}
                placeholder={t.placeholders.password}
                autoComplete="new-password"
                error={errorText('password')}
                onChange={handleChange}
              />
              <Field
                label={t.labels.confirmPassword}
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                placeholder={t.placeholders.confirmPassword}
                autoComplete="new-password"
                error={errorText('confirmPassword')}
                onChange={handleChange}
              />

              {serverError && (
                <p className="form__error" role="alert">
                  {serverError}
                </p>
              )}

              <button type="submit" className="submit" disabled={loading}>
                {loading ? t.creating : <>{t.createAccount} <span aria-hidden="true">→</span></>}
              </button>
            </form>
          </div>

          <div className="card__foot">
            <p className="card__secure"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=" #5F6F76;"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Zm-80 160h160q17 0 28.5-11.5T600-360v-120q0-17-11.5-28.5T560-520v-40q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560v40q-17 0-28.5 11.5T360-480v120q0 17 11.5 28.5T400-320Zm40-200v-40q0-17 11.5-28.5T480-600q17 0 28.5 11.5T520-560v40h-80Z"/></svg> {t.secureNote}</p>
            <p className="card__login">
              {t.alreadyAccount} <Link to="/login">{t.login} →</Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="register__footer">
        © 2026 SAHARA &nbsp;•&nbsp; Give &nbsp;•&nbsp; Help &nbsp;•&nbsp; Build Communities
        &nbsp;•&nbsp; Together
      </footer>
    </div>
  );
};

export default Register;