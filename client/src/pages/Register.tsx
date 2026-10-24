import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logoImg from '../components/image/volunteers.jpg';
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
import { translations, type ErrorKey, type Language } from './translations';
import { useAuth, type RegisterData } from '../context/AuthContext';
import { VoiceFormAssistant } from '../components/common/VoiceFormAssistant';
import { type ParsedDonationOrNeed } from '../services/voiceNlpParser';
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

/* One icon per feature (same order as t.features) */
const FEATURE_ICONS = [HeartIcon, HandHeartIcon, SproutIcon, ShieldCheckIcon];

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
            {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>

      {/* Absolutely positioned in CSS, so showing an error never moves the layout */}
      {error && (
        <span className="field__error" title={error}>
          {error}
        </span>
      )}
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

  const handleApplyVoice = (parsed: ParsedDonationOrNeed) => {
    setForm((prev) => ({
      ...prev,
      name: parsed.name || prev.name,
      phone: parsed.phone || prev.phone,
      email: parsed.email || prev.email,
      city: parsed.city || prev.city,
      pincode: parsed.pincode || prev.pincode,
      address: parsed.address || prev.address,
    }));

    if (parsed.intent) {
      setIntent(parsed.intent as Intent);
    }
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
        {/* Left: welcome + photo + features */}
        <section className="intro">
          <h2 className="intro__title">{t.welcome}</h2>
          <p className="intro__text">{t.welcomeText}</p>

          <div className="photo">
            <span className="photo__frame" aria-hidden="true" />
            <img
              className="photo__img"
              src={logoImg}
              alt="Volunteers packing donated food together"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="photo__shade" aria-hidden="true" />
            <span className="photo__badge" aria-hidden="true">
              <HandHeartIcon size={24} />
            </span>
            <span className="photo__tags" aria-hidden="true">
              <GiftIcon size={16} />
              <HeartIcon size={16} />
              <UsersIcon size={16} />
            </span>
            <p className="photo__caption">“{t.quote}”</p>
          </div>

          <ul className="intro__features">
            {FEATURE_ICONS.map((Icon, index) => (
              <li key={index}>
                <span className="intro__icon">
                  <Icon size={18} />
                </span>
                <span>{t.features[index]}</span>
              </li>
            ))}
          </ul>

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
              <GiftIcon size={18} /> {t.donorTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isReceiver}
              className={`tabs__btn${isReceiver ? ' is-active' : ''}`}
              onClick={() => handleIntentChange('receiver')}
            >
              <HandHeartIcon size={18} /> {t.receiverTab}
            </button>
          </div>

          <div className="card__body">
            <form className="form" onSubmit={handleSubmit} noValidate>
              {/* AI Voice Assistant */}
              <div style={{ padding: '0 4px 10px' }}>
                <VoiceFormAssistant
                  context="register"
                  language={language}
                  onApply={handleApplyVoice}
                />
              </div>

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
                {loading ? (
                  t.creating
                ) : (
                  <>
                    {t.createAccount} <ArrowRightIcon size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="card__foot">
            <p className="card__secure">
              <LockIcon size={14} /> {t.secureNote}
            </p>
            <p className="card__login">
              {t.alreadyAccount} <Link to="/login">{t.login}</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
