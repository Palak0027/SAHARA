import React, { useState } from 'react';
import donationBoxImg from '../components/image/image.png';
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  maxLength?: number;
  autoComplete?: string;
  error?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  maxLength,
  autoComplete,
  error,
  onChange
}) => {
  return (
    <div className="field-group">
      <label htmlFor={name}>{label}</label>

      <div className={`input-wrap ${error ? 'has-error' : ''}`}>
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onChange={onChange}
        />
      </div>

      {error && (
        <span className="field-error">
          {error}
        </span>
      )}
    </div>
  );
};
const Register: React.FC = () => {
  const [intent, setIntent] = useState<'donor' | 'receiver'>('donor');

  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    pincode: '',
    address: '',

    password: '',
    confirmPassword: '',

    receiverType:
      'individual' as
        | 'individual'
        | 'family'
        | 'community'
        | 'organization',

    orgName: '',
    regNumber: '',
    description: '',

    isOnBehalf: false,

    beneficiaryName: '',
    beneficiaryAge: '',
    relationship: '',
    beneficiaryLocation: ''
  });

  
  const translations = {
    en: {
      brand: 'SAHARA',
      tagline: 'Give what you can, help someone nearby.',

      welcome: 'Join the SAHARA community',

      welcomeText:
        'Create an account and become part of a community where small acts of kindness create big smiles.',

      support: 'Support Communities',
      help: 'Help People',
      tomorrow: 'Build a Better Tomorrow',
      secure: 'Safe & Secure',

      donorTab: 'I Want to Donate',
      receiverTab: 'I Need Help / Resources',

      title: 'Create Your Account',

      subtitle:
        'Create your SAHARA profile and start making an impact.',

      badge: 'SIGN UP',

      nameLabel: 'Full Name*',
      namePlaceholder: 'Enter your full name',

      phoneLabel: 'Phone Number*',
      phonePlaceholder: 'Enter 10-digit phone number',

      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email address',

      cityLabel: 'City*',
      cityPlaceholder: 'Enter city',

      pincodeLabel: 'Pincode',
      pincodePlaceholder: '6-digit pincode',

      addressLabel: 'Full Address / Area*',
      addressPlaceholder: 'House no, Street, Area',

      passLabel: 'Password*',
      passPlaceholder: 'Minimum 6 characters',

      confirmPassLabel: 'Confirm Password*',
      confirmPassPlaceholder: 'Re-enter your password',

      receiverTypeLabel: 'Select Receiver Type*',

      individual: 'Individual - For myself',
      family: 'Family - For my family',
      community: 'Community - Shelter / Group',
      organization: 'Organization - NGO / Trust',

      orgNameLabel: 'Organization Name*',
      regNumLabel: 'Registration / Darpan ID',
      descLabel: 'About Organization',

      onBehalfCheck:
        'Are you applying on behalf of someone else?',

      beneficiaryNameLabel: 'Beneficiary Name*',
      beneficiaryAgeLabel: 'Beneficiary Age',
      relationshipLabel: 'Relationship with them*',
      beneficiaryLocationLabel:
        'Beneficiary Area / City',

      createAccount: 'Create Account',

      alreadyAccount: 'Already have an account?',
      login: 'Login',

      secureNote:
        'Your information is kept safe and secure.',

      successTitle: 'Registration Successful!',

      successMessage:
        'Welcome to SAHARA. Your account has been created successfully.'
    },

    hi: {
      brand: 'सहारा (SAHARA)',

      tagline:
        'जो दे सकते हैं दें, आस-पास किसी की मदद करें।',

      welcome: 'SAHARA परिवार से जुड़ें',

      welcomeText:
        'खाता बनाएँ और ऐसे समुदाय का हिस्सा बनें जहाँ छोटी-सी मदद किसी के चेहरे पर बड़ी मुस्कान ला सकती है।',

      support: 'समुदाय की मदद',
      help: 'लोगों की मदद',
      tomorrow: 'बेहतर कल बनाएँ',
      secure: 'सुरक्षित प्लेटफॉर्म',

      donorTab: 'मुझे दान करना है',
      receiverTab: 'मुझे मदद / संसाधन चाहिए',

      title: 'अपना खाता बनाएँ',

      subtitle:
        'अपना SAHARA प्रोफाइल बनाएँ और मदद की शुरुआत करें।',

      badge: 'साइन UP',

      nameLabel: 'पूरा नाम*',
      namePlaceholder: 'अपना पूरा नाम दर्ज करें',

      phoneLabel: 'मोबाइल नंबर*',
      phonePlaceholder: '10-अंकों का मोबाइल नंबर',

      emailLabel: 'ईमेल आईडी',
      emailPlaceholder: 'अपना ईमेल दर्ज करें',

      cityLabel: 'शहर*',
      cityPlaceholder: 'शहर का नाम',

      pincodeLabel: 'पिनकोड',
      pincodePlaceholder: '6-अंकों का पिनकोड',

      addressLabel: 'पूरा पता / क्षेत्र*',
      addressPlaceholder: 'मकान नंबर, गली, क्षेत्र',

      passLabel: 'पासवर्ड*',
      passPlaceholder: 'कम से कम 6 अक्षर',

      confirmPassLabel: 'पासवर्ड की पुष्टि करें*',
      confirmPassPlaceholder:
        'पासवर्ड दोबारा दर्ज करें',

      receiverTypeLabel:
        'प्राप्तकर्ता का प्रकार चुनें*',

      individual: 'Individual - अपने लिए',
      family: 'Family - परिवार के लिए',
      community:
        'Community - बस्ती / शेल्टर / ग्रुप',
      organization:
        'Organization - NGO / Trust',

      orgNameLabel: 'संस्था का नाम*',
      regNumLabel: 'रजिस्ट्रेशन / दर्पण आईडी',
      descLabel: 'संस्था के बारे में',

      onBehalfCheck:
        'क्या आप किसी और के लिए आवेदन कर रहे हैं?',

      beneficiaryNameLabel:
        'लाभार्थी का नाम*',

      beneficiaryAgeLabel:
        'लाभार्थी की आयु',

      relationshipLabel:
        'लाभार्थी से आपका रिश्ता*',

      beneficiaryLocationLabel:
        'लाभार्थी का क्षेत्र / शहर',

      createAccount: 'खाता बनाएँ',

      alreadyAccount: 'पहले से खाता है?',
      login: 'लॉगिन करें',

      secureNote:
        'आपकी जानकारी सुरक्षित रखी जाती है।',

      successTitle: 'पंजीकरण सफल रहा!',

      successMessage:
        'SAHARA में आपका स्वागत है। आपका खाता सफलतापूर्वक बन गया है।'
    }
  };

  const t = translations[language];
 

  const validateField = (
    name: string,
    value: string
  ): string => {
    let error = '';

    const isHindi = language === 'hi';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = isHindi
            ? 'पूरा नाम आवश्यक है।'
            : 'Full name is required.';
        } else if (value.trim().length < 2) {
          error = isHindi
            ? 'नाम कम से कम 2 अक्षर का होना चाहिए।'
            : 'Name must be at least 2 characters.';
        }
        break;

      case 'phone':
        if (!value) {
          error = isHindi
            ? 'मोबाइल नंबर आवश्यक है।'
            : 'Phone number is required.';
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = isHindi
            ? '10 अंकों का वैध मोबाइल नंबर दर्ज करें।'
            : 'Enter a valid 10-digit phone number.';
        }
        break;

      case 'email':
        if (
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          error = isHindi
            ? 'वैध ईमेल आईडी दर्ज करें।'
            : 'Enter a valid email address.';
        }
        break;

      case 'city':
        if (!value.trim()) {
          error = isHindi
            ? 'शहर का नाम आवश्यक है।'
            : 'City is required.';
        }
        break;

      case 'pincode':
        if (
          value &&
          !/^\d{6}$/.test(value)
        ) {
          error = isHindi
            ? 'पिनकोड 6 अंकों का होना चाहिए।'
            : 'Pincode must be 6 digits.';
        }
        break;

      case 'address':
        if (!value.trim()) {
          error = isHindi
            ? 'पूरा पता आवश्यक है।'
            : 'Full address is required.';
        }
        break;

      case 'password':
        if (!value) {
          error = isHindi
            ? 'पासवर्ड आवश्यक है।'
            : 'Password is required.';
        } else if (value.length < 6) {
          error = isHindi
            ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
            : 'Password must be at least 6 characters.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = isHindi
            ? 'पासवर्ड की पुष्टि करें।'
            : 'Please confirm your password.';
        } else if (
          value !== formData.password
        ) {
          error = isHindi
            ? 'पासवर्ड मेल नहीं खा रहे हैं।'
            : 'Passwords do not match.';
        }
        break;

      case 'orgName':
        if (
          intent === 'receiver' &&
          formData.receiverType ===
            'organization' &&
          !value.trim()
        ) {
          error = isHindi
            ? 'संस्था का नाम आवश्यक है।'
            : 'Organization name is required.';
        }
        break;

      case 'beneficiaryName':
        if (
          intent === 'receiver' &&
          formData.isOnBehalf &&
          !value.trim()
        ) {
          error = isHindi
            ? 'लाभार्थी का नाम आवश्यक है।'
            : 'Beneficiary name is required.';
        }
        break;

      case 'relationship':
        if (
          intent === 'receiver' &&
          formData.isOnBehalf &&
          !value.trim()
        ) {
          error = isHindi
            ? 'रिश्ता बताना आवश्यक है।'
            : 'Relationship is required.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const target = e.target;

    const {
      name,
      value
    } = target;

    const isCheckbox =
      target instanceof HTMLInputElement &&
      target.type === 'checkbox';

    const finalValue = isCheckbox
      ? target.checked
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    const error = validateField(
      name,
      String(finalValue)
    );

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

   
  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    const requiredFields = [
      'name',
      'phone',
      'city',
      'address',
      'password',
      'confirmPassword'
    ];

    requiredFields.forEach(field => {
      const error = validateField(
        field,
        String(
          formData[
            field as keyof typeof formData
          ]
        )
      );

      if (error) {
        newErrors[field] = error;
      }
    });

    if (formData.email) {
      const error = validateField(
        'email',
        formData.email
      );

      if (error) {
        newErrors.email = error;
      }
    }

    if (formData.pincode) {
      const error = validateField(
        'pincode',
        formData.pincode
      );

      if (error) {
        newErrors.pincode = error;
      }
    }

    if (
      intent === 'receiver' &&
      formData.receiverType ===
        'organization'
    ) {
      const error = validateField(
        'orgName',
        formData.orgName
      );

      if (error) {
        newErrors.orgName = error;
      }
    }

    if (
      intent === 'receiver' &&
      formData.isOnBehalf
    ) {
      const beneficiaryError =
        validateField(
          'beneficiaryName',
          formData.beneficiaryName
        );

      const relationshipError =
        validateField(
          'relationship',
          formData.relationship
        );

      if (beneficiaryError) {
        newErrors.beneficiaryName =
          beneficiaryError;
      }

      if (relationshipError) {
        newErrors.relationship =
          relationshipError;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 

    const payload: any = {
      intent,

      name: formData.name,

      phone: formData.phone,

      email: formData.email,

      password: formData.password,

      location: {
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      }
    };

    if (intent === 'receiver') {
      payload.receiverType =
        formData.receiverType;

      if (
        formData.receiverType ===
        'organization'
      ) {
        payload.organization = {
          orgName: formData.orgName,

          regNumber:
            formData.regNumber,

          description:
            formData.description
        };
      } else {
        payload.onBehalfOf = {
          isOnBehalf:
            formData.isOnBehalf
        };

        if (formData.isOnBehalf) {
          payload.onBehalfOf = {
            isOnBehalf: true,

            beneficiaryName:
              formData.beneficiaryName,

            beneficiaryAge:
              formData.beneficiaryAge
                ? Number(
                    formData.beneficiaryAge
                  )
                : undefined,

            relationship:
              formData.relationship,

            beneficiaryLocation:
              formData.beneficiaryLocation
          };
        }
      }
    }

    console.log(
      'Registration Payload:',
      JSON.stringify(
        payload,
        null,
        2
      )
    );

    setSubmitted(true);
  };

  

  return (
    <div className="sahara-register-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .sahara-register-page {
          min-height: 100vh;

          padding: 28px 34px 20px;

          color: #17383d;

          background:
            radial-gradient(
              circle at 8% 18%,
              rgba(74, 157, 112, .08),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 82%,
              rgba(47, 125, 91, .08),
              transparent 28%
            ),
            #f5faf7;

          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;

          overflow-x: hidden;

          position: relative;
        }

        .sahara-register-page::before,
        .sahara-register-page::after {
          content: "";

          position: absolute;

          width: 230px;
          height: 230px;

          border-radius: 50%;

          background:
            rgba(94, 151, 111, .07);

          pointer-events: none;
        }

        .sahara-register-page::before {
          left: -130px;
          bottom: -100px;
        }

        .sahara-register-page::after {
          right: -150px;
          top: -120px;
        }

        /* =========================
           TOP BAR
        ========================= */

        .topbar {
          max-width: 1380px;

          margin: 0 auto;

          display: flex;

          align-items: center;

          justify-content: space-between;

          position: relative;

          z-index: 2;
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 12px;
        }

        .brand-logo {
          width: 58px;
          height: 58px;

          border-radius: 18px;

          object-fit: cover;

          filter:
            drop-shadow(
              0 6px 12px
              rgba(35, 103, 73, .12)
            );
        }

        .brand-name {
          margin: 0;

          color: #07545a;

          font-size: 30px;

          line-height: 1;

          font-weight: 800;

          letter-spacing: -.8px;
        }

        .brand-tagline {
          margin: 5px 0 0;

          color: #6d7d80;

          font-size: 13px;

          letter-spacing: .2px;
        }

        .top-actions {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #657579;

          font-size: 14px;
        }

        .lang-btn {
          border: 1px solid #cbdcd4;

          background:
            rgba(255,255,255,.8);

          color: #23665b;

          border-radius: 999px;

          padding: 7px 12px;

          cursor: pointer;

          font-weight: 700;

          transition: .2s ease;
        }

        .lang-btn:hover,
        .lang-btn.active {
          background: #176c62;

          color: #fff;

          border-color: #176c62;
        }

        /* =========================
           MAIN
        ========================= */

        .main-layout {
          max-width: 1380px;

          margin: 18px auto 0;

          display: grid;

          grid-template-columns:
            minmax(430px, .95fr)
            minmax(520px, 1.05fr);

          gap: 54px;

          align-items: center;

          position: relative;

          z-index: 1;
        }

        /* =========================
           LEFT
        ========================= */

        .left-panel {
          padding:
            42px 18px
            30px 34px;
        }

        .left-title {
          margin: 0;

          max-width: 620px;

          color: #123e45;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(
              44px,
              4.4vw,
              68px
            );

          line-height: .98;

          letter-spacing: -2.4px;
        }

        .left-description {
          max-width: 570px;

          margin:
            20px 0
            28px;

          color: #66777a;

          font-size: 19px;

          line-height: 1.55;
        }

        .feature-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(90px, 1fr));

          gap: 10px;

          max-width: 620px;

          margin-bottom: 32px;
        }

        .feature {
          text-align: center;

          color: #56696d;

          font-size: 13px;

          line-height: 1.35;
        }

        .feature-icon {
          width: 58px;
          height: 58px;

          margin:
            0 auto 9px;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          background: #e7f4e8;

          color: #176b5e;

          font-size: 25px;

          box-shadow:
            inset 0 0 0 1px
            rgba(41, 119, 82, .06);
        }

        .hero-image-wrap {
          width:
            min(
              520px,
              90%
            );

          aspect-ratio: 1;

          margin: 0 auto;

          position: relative;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .hero-image-wrap::before {
          content: "";

          position: absolute;

          inset: 4%;

          border: 7px solid #fff;

          border-radius: 50%;

          box-shadow:
            0 18px 45px
            rgba(31, 91, 69, .15);

          z-index: 1;
        }

        .hero-image {
          width: 88%;
          height: 88%;

          object-fit: cover;

          border-radius: 50%;

          position: relative;

          z-index: 0;
        }

        .leaf {
          position: absolute;

          color: #4e936c;

          font-size: 38px;

          z-index: 2;
        }

        .leaf.one {
          top: 2%;
          left: 4%;
          transform: rotate(-25deg);
        }

        .leaf.two {
          top: 12%;
          right: 2%;
          transform: rotate(25deg);
        }

        .leaf.three {
          bottom: 7%;
          left: 2%;
          transform: rotate(28deg);
        }

        .leaf.four {
          bottom: 2%;
          right: 4%;
          transform: rotate(-20deg);
        }

        .quote-card {
          max-width: 450px;

          margin:
            8px auto 0;

          text-align: center;

          color: #397a67;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-style: italic;

          font-size: 19px;

          line-height: 1.35;
        }

        /* =========================
           RIGHT FORM
        ========================= */

        .right-panel {
          width: 100%;

          max-width: 610px;

          justify-self: center;
        }

        .form-card {
          background:
            rgba(255,255,255,.97);

          border:
            1px solid #e1ebe6;

          border-radius: 28px;

          padding:
            32px 38px
            30px;

          box-shadow:
            0 22px 55px
            rgba(30, 77, 60, .10);
        }

        .card-heading {
          display: flex;

          align-items: flex-start;

          justify-content:
            space-between;

          gap: 20px;

          margin-bottom: 22px;
        }

        .card-title {
          margin: 0;

          color: #143c43;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 32px;

          line-height: 1.1;
        }

        .card-subtitle {
          margin: 7px 0 0;

          color: #758487;

          font-size: 14px;

          line-height: 1.45;
        }

        .signup-badge {
          flex-shrink: 0;

          background: #f3c04d;

          color: #24433d;

          border-radius: 999px;

          padding:
            8px 13px;

          font-size: 11px;

          font-weight: 800;

          letter-spacing: .7px;
        }

        /* =========================
           TABS
        ========================= */

        .intent-tabs {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          background: #f0f7f3;

          padding: 4px;

          border-radius: 13px;

          margin-bottom: 22px;
        }

        .intent-tab {
          border: 0;

          background:
            transparent;

          color: #47716a;

          padding:
            11px 10px;

          border-radius: 10px;

          cursor: pointer;

          font-size: 13px;

          font-weight: 700;

          transition: .2s ease;
        }

        .intent-tab.active {
          background: #176c62;

          color: white;

          box-shadow:
            0 6px 14px
            rgba(23,108,98,.18);
        }

        /* =========================
           FORM
        ========================= */

        .form-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            0 15px;
        }

        .full-width {
          grid-column:
            1 / -1;
        }

        .field-group {
          margin-bottom: 14px;
        }

        .field-group label {
          display: block;

          color: #203d42;

          font-size: 12px;

          font-weight: 750;

          margin-bottom: 7px;
        }

        .input-wrap {
          position: relative;
        }

        .input-wrap input,
        .form-card select,
        .form-card textarea,
        .section-box input {
          width: 100%;

          border:
            1.4px solid #d5dfdc;

          background: #fbfdfc;

          color: #274146;

          border-radius: 11px;

          outline: none;

          padding:
            12px 13px;

          font-size: 13px;

          transition: .2s ease;

          font-family: inherit;
        }

        .input-wrap input,
        .section-box input {
          min-height: 45px;
        }

        .form-card textarea {
          resize: vertical;

          min-height: 78px;
        }

        .input-wrap input::placeholder,
        .form-card textarea::placeholder {
          color: #a3afb0;
        }

        .input-wrap input:focus,
        .form-card select:focus,
        .form-card textarea:focus,
        .section-box input:focus {
          border-color: #3d9270;

          background: #fff;

          box-shadow:
            0 0 0 4px
            rgba(61,146,112,.09);
        }

        .input-wrap.has-error input {
          border-color: #d9534f;
        }

        .field-error {
          display: block;

          color: #c4433f;

          font-size: 11px;

          margin-top: 4px;
        }

        /* =========================
           PASSWORD
        ========================= */

        .password-toggle {
          position: absolute;

          right: 11px;

          top: 50%;

          transform:
            translateY(-50%);

          border: 0;

          background:
            transparent;

          color: #718082;

          cursor: pointer;

          font-size: 15px;

          padding: 4px;
        }

        /* =========================
           RECEIVER BOX
        ========================= */

        .section-box {
          grid-column:
            1 / -1;

          background: #f5faf7;

          border:
            1px solid #dce9e3;

          border-radius: 13px;

          padding: 15px;

          margin-bottom: 14px;
        }

        .checkbox-row {
          display: flex;

          align-items: flex-start;

          gap: 9px;

          color: #36565a;

          font-size: 12px;

          font-weight: 650;

          margin-bottom: 12px;
        }

        .checkbox-row input {
          accent-color: #176c62;

          margin-top: 2px;
        }

        /* =========================
           BUTTON
        ========================= */

        .submit-btn {
          width: 100%;

          border: 0;

          border-radius: 12px;

          padding:
            13px 18px;

          color: #fff;

          background:
            linear-gradient(
              135deg,
              #4f9f70,
              #358a69
            );

          font-size: 14px;

          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 9px 18px
            rgba(53,138,105,.22);

          transition: .2s ease;

          margin-top: 2px;
        }

        .submit-btn:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 12px 22px
            rgba(53,138,105,.27);
        }

        /* =========================
           FOOTER
        ========================= */

        .secure-note {
          display: flex;

          justify-content: center;

          align-items: center;

          gap: 6px;

          margin:
            15px 0 0;

          color: #879496;

          font-size: 11px;
        }

        .login-row {
          text-align: center;

          margin-top: 18px;

          color: #7a888a;

          font-size: 12px;
        }

        .login-row a {
          color: #176c62;

          font-weight: 800;

          text-decoration: none;

          margin-left: 4px;
        }

        /* =========================
           SUCCESS
        ========================= */

        .success-box {
          background: #ecf8ef;

          border:
            1px solid #b9dec3;

          color: #267044;

          border-radius: 16px;

          text-align: center;

          padding:
            34px 20px;
        }

        .success-icon {
          width: 58px;
          height: 58px;

          border-radius: 50%;

          margin:
            0 auto 14px;

          display: flex;

          align-items: center;

          justify-content: center;

          background: #4f9f70;

          color: #fff;

          font-size: 27px;
        }

        .success-box h3 {
          margin:
            0 0 8px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          color: #1c5b3b;
        }

        .success-box p {
          margin: 0;

          font-size: 13px;
        }

        .footer {
          max-width: 1380px;

          margin:
            18px auto 0;

          padding:
            10px 18px;

          text-align: center;

          color: #8a9899;

          font-size: 11px;

          position: relative;

          z-index: 2;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1050px) {

          .sahara-register-page {
            padding:
              24px 22px;
          }

          .main-layout {
            grid-template-columns: 1fr;

            gap: 30px;
          }

          .left-panel {
            padding:
              20px 10px 0;

            text-align: center;
          }

          .left-description,
          .feature-grid {
            margin-left: auto;

            margin-right: auto;
          }

          .hero-image-wrap {
            max-width: 420px;
          }

          .right-panel {
            max-width: 680px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 680px) {

          .sahara-register-page {
            padding:
              18px 12px 14px;
          }

          .topbar {
            align-items:
              flex-start;
          }

          .brand-logo {
            width: 48px;
            height: 48px;

            border-radius: 14px;
          }

          .brand-name {
            font-size: 24px;
          }

          .brand-tagline {
            font-size: 11px;
          }

          .top-actions span {
            display: none;
          }

          .main-layout {
            margin-top: 12px;

            gap: 18px;
          }

          .left-panel {
            padding-top: 14px;
          }

          .left-title {
            font-size: 43px;

            letter-spacing:
              -1.5px;
          }

          .left-description {
            font-size: 15px;

            margin-top: 14px;
          }

          .feature-grid {
            grid-template-columns:
              repeat(2, 1fr);

            gap:
              14px 6px;
          }

          .hero-image-wrap {
            max-width: 300px;
          }

          .quote-card {
            font-size: 16px;

            padding:
              0 20px;
          }

          .form-card {
            padding:
              22px 16px 20px;

            border-radius: 20px;
          }

          .card-heading {
            margin-bottom: 18px;
          }

          .card-title {
            font-size: 27px;
          }

          .signup-badge {
            font-size: 9px;

            padding:
              7px 9px;
          }

          .intent-tab {
            font-size: 11px;

            padding:
              10px 5px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .full-width,
          .section-box {
            grid-column: auto;
          }

          .field-group {
            margin-bottom: 13px;
          }
        }

      `}</style>

       
      <header className="topbar">

        <div className="brand">

          <img
            src={donationBoxImg}
            alt="SAHARA Logo"
            className="brand-logo"
          />

          <div>

            <h1 className="brand-name">
              {t.brand}
            </h1>

            <p className="brand-tagline">
              {t.tagline}
            </p>

          </div>

        </div>

        {/* LANGUAGE */}

        <div className="top-actions">

          <span>
            Language
          </span>

          <button
            type="button"
            className={
              language === 'en'
                ? 'lang-btn active'
                : 'lang-btn'
            }
            onClick={() =>
              setLanguage('en')
            }
          >
            EN
          </button>

          <button
            type="button"
            className={
              language === 'hi'
                ? 'lang-btn active'
                : 'lang-btn'
            }
            onClick={() =>
              setLanguage('hi')
            }
          >
            हिंदी
          </button>

        </div>

      </header>
 
      <main className="main-layout">

        

        <section className="left-panel">

          <h2 className="left-title">
            {t.welcome}
          </h2>

          <p className="left-description">
            {t.welcomeText}
          </p>

          {/* FEATURES */}

          <div className="feature-grid">

            <div className="feature">

              <div className="feature-icon">
                ♡
              </div>

              {t.support}

            </div>

            <div className="feature">

              <div className="feature-icon">
                ♧
              </div>

              {t.help}

            </div>

            <div className="feature">

              <div className="feature-icon">
                🌿
              </div>

              {t.tomorrow}

            </div>

            <div className="feature">

              <div className="feature-icon">
                ✓
              </div>

              {t.secure}

            </div>

          </div>

          {/* HERO IMAGE */}

          <div className="hero-image-wrap">

            <span className="leaf one">
              🍃
            </span>

            <span className="leaf two">
              🍃
            </span>

            <span className="leaf three">
              🍃
            </span>

            <span className="leaf four">
              🍃
            </span>

            <img
              src={donationBoxImg}
              alt="Helping the community"
              className="hero-image"
            />

          </div>

          <div className="quote-card">

            “Together, we can build kinder,
            stronger communities.”

            <div>
              ♡
            </div>

          </div>

        </section>

      

        <section className="right-panel">

          <div className="form-card">

            {/* CARD HEADER */}

            <div className="card-heading">

              <div>

                <h2 className="card-title">
                  {t.title}
                </h2>

                <p className="card-subtitle">
                  {t.subtitle}
                </p>

              </div>

              <span className="signup-badge">
                {t.badge}
              </span>

            </div>

            
            <div className="intent-tabs">

              <button
                type="button"
                className={
                  intent === 'donor'
                    ? 'intent-tab active'
                    : 'intent-tab'
                }
                onClick={() =>
                  setIntent('donor')
                }
              >
                {t.donorTab}
              </button>

              <button
                type="button"
                className={
                  intent === 'receiver'
                    ? 'intent-tab active'
                    : 'intent-tab'
                }
                onClick={() =>
                  setIntent('receiver')
                }
              >
                {t.receiverTab}
              </button>

            </div>

          

            {submitted ? (

              <div className="success-box">

                <div className="success-icon">
                  ✓
                </div>

                <h3>
                  {t.successTitle}
                </h3>

                <p>
                  {t.successMessage}
                </p>

              </div>

            ) : (

             

              <form
                onSubmit={handleSubmit}
                noValidate
              >

                <div className="form-grid">

                  {/* RECEIVER TYPE */}

                  {intent === 'receiver' && (

                    <div className="field-group full-width">

                      <label htmlFor="receiverType">
                        {t.receiverTypeLabel}
                      </label>

                      <select
                        id="receiverType"
                        name="receiverType"
                        value={
                          formData.receiverType
                        }
                        onChange={handleChange}
                      >

                        <option value="individual">
                          {t.individual}
                        </option>

                        <option value="family">
                          {t.family}
                        </option>

                        <option value="community">
                          {t.community}
                        </option>

                        <option value="organization">
                          {t.organization}
                        </option>

                      </select>

                    </div>

                  )}

                  {/* NAME */}

                  <InputField
                    label={t.nameLabel}
                    name="name"
                    placeholder={
                      t.namePlaceholder
                    }
                    value={formData.name}
                    autoComplete="name"
                    error={errors.name}
                    onChange={handleChange}
                  />

                  {/* PHONE */}

                  <InputField
                    label={t.phoneLabel}
                    name="phone"
                    type="tel"
                    placeholder={
                      t.phonePlaceholder
                    }
                    value={formData.phone}
                    maxLength={10}
                    autoComplete="tel"
                    error={errors.phone}
                    onChange={handleChange}
                  />

                  {/* EMAIL */}

                  <InputField
                    label={t.emailLabel}
                    name="email"
                    type="email"
                    placeholder={
                      t.emailPlaceholder
                    }
                    value={formData.email}
                    autoComplete="email"
                    error={errors.email}
                    onChange={handleChange}
                  />

                  {/* CITY */}

                  <InputField
                    label={t.cityLabel}
                    name="city"
                    placeholder={
                      t.cityPlaceholder
                    }
                    value={formData.city}
                    autoComplete="address-level2"
                    error={errors.city}
                    onChange={handleChange}
                  />

                  {/* PINCODE */}

                  <InputField
                    label={t.pincodeLabel}
                    name="pincode"
                    type="text"
                    placeholder={
                      t.pincodePlaceholder
                    }
                    value={formData.pincode}
                    maxLength={6}
                    autoComplete="postal-code"
                    error={errors.pincode}
                    onChange={handleChange}
                  />

                  {/* ADDRESS */}

                  <div className="field-group full-width">

                    <label htmlFor="address">
                      {t.addressLabel}
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      placeholder={
                        t.addressPlaceholder
                      }
                      value={
                        formData.address
                      }
                      onChange={handleChange}
                    />

                    {errors.address && (
                      <span className="field-error">
                        {errors.address}
                      </span>
                    )}

                  </div>

                   

                  {intent === 'receiver' &&
                    formData.receiverType ===
                      'organization' && (

                    <div className="section-box">

                      <div className="field-group">

                        <label htmlFor="orgName">
                          {t.orgNameLabel}
                        </label>

                        <input
                          id="orgName"
                          type="text"
                          name="orgName"
                          placeholder={
                            t.orgNameLabel
                          }
                          value={
                            formData.orgName
                          }
                          onChange={
                            handleChange
                          }
                        />

                        {errors.orgName && (
                          <span className="field-error">
                            {errors.orgName}
                          </span>
                        )}

                      </div>

                      <div className="field-group">

                        <label htmlFor="regNumber">
                          {t.regNumLabel}
                        </label>

                        <input
                          id="regNumber"
                          type="text"
                          name="regNumber"
                          value={
                            formData.regNumber
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                      <div
                        className="field-group"
                        style={{
                          marginBottom: 0
                        }}
                      >

                        <label htmlFor="description">
                          {t.descLabel}
                        </label>

                        <textarea
                          id="description"
                          name="description"
                          rows={2}
                          value={
                            formData.description
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                    </div>

                  )}

                   

                  {intent === 'receiver' &&
                    formData.receiverType !==
                      'organization' && (

                    <div className="section-box">

                      <label className="checkbox-row">

                        <input
                          type="checkbox"
                          name="isOnBehalf"
                          checked={
                            formData.isOnBehalf
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <span>
                          {t.onBehalfCheck}
                        </span>

                      </label>

                      {formData.isOnBehalf && (

                        <>

                          <div className="field-group">

                            <label htmlFor="beneficiaryName">
                              {
                                t.beneficiaryNameLabel
                              }
                            </label>

                            <input
                              id="beneficiaryName"
                              type="text"
                              name="beneficiaryName"
                              value={
                                formData.beneficiaryName
                              }
                              onChange={
                                handleChange
                              }
                            />

                            {errors.beneficiaryName && (
                              <span className="field-error">
                                {
                                  errors.beneficiaryName
                                }
                              </span>
                            )}

                          </div>

                          <div
                            className="form-grid"
                          >

                            <div className="field-group">

                              <label htmlFor="beneficiaryAge">
                                {
                                  t.beneficiaryAgeLabel
                                }
                              </label>

                              <input
                                id="beneficiaryAge"
                                type="number"
                                name="beneficiaryAge"
                                value={
                                  formData.beneficiaryAge
                                }
                                onChange={
                                  handleChange
                                }
                              />

                            </div>

                            <div className="field-group">

                              <label htmlFor="relationship">
                                {
                                  t.relationshipLabel
                                }
                              </label>

                              <input
                                id="relationship"
                                type="text"
                                name="relationship"
                                value={
                                  formData.relationship
                                }
                                onChange={
                                  handleChange
                                }
                              />

                              {errors.relationship && (
                                <span className="field-error">
                                  {
                                    errors.relationship
                                  }
                                </span>
                              )}

                            </div>

                          </div>

                          <div
                            className="field-group"
                            style={{
                              marginBottom: 0
                            }}
                          >

                            <label htmlFor="beneficiaryLocation">
                              {
                                t.beneficiaryLocationLabel
                              }
                            </label>

                            <input
                              id="beneficiaryLocation"
                              type="text"
                              name="beneficiaryLocation"
                              value={
                                formData.beneficiaryLocation
                              }
                              onChange={
                                handleChange
                              }
                            />

                          </div>

                        </>

                      )}

                    </div>

                  )}
 

                  <div className="field-group">

                    <label htmlFor="password">
                      {t.passLabel}
                    </label>

                    <div
                      className={
                        errors.password
                          ? 'input-wrap has-error'
                          : 'input-wrap'
                      }
                    >

                      <input
                        id="password"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        name="password"
                        placeholder={
                          t.passPlaceholder
                        }
                        value={
                          formData.password
                        }
                        autoComplete="new-password"
                        onChange={
                          handleChange
                        }
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowPassword(
                            prev => !prev
                          )
                        }
                        aria-label="Toggle password"
                      >
                        {showPassword
                          ? '◉'
                          : '◌'}
                      </button>

                    </div>

                    {errors.password && (
                      <span className="field-error">
                        {errors.password}
                      </span>
                    )}

                  </div>

                 
                  <div className="field-group">

                    <label htmlFor="confirmPassword">
                      {t.confirmPassLabel}
                    </label>

                    <div
                      className={
                        errors.confirmPassword
                          ? 'input-wrap has-error'
                          : 'input-wrap'
                      }
                    >

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        name="confirmPassword"
                        placeholder={
                          t.confirmPassPlaceholder
                        }
                        value={
                          formData.confirmPassword
                        }
                        autoComplete="new-password"
                        onChange={
                          handleChange
                        }
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            prev => !prev
                          )
                        }
                        aria-label="Toggle confirm password"
                      >
                        {showConfirmPassword
                          ? '◉'
                          : '◌'}
                      </button>

                    </div>

                    {errors.confirmPassword && (
                      <span className="field-error">
                        {
                          errors.confirmPassword
                        }
                      </span>
                    )}

                  </div>

                  

                  <div className="full-width">

                    <button
                      type="submit"
                      className="submit-btn"
                    >
                      {t.createAccount}

                      <span
                        style={{
                          marginLeft: 7
                        }}
                      >
                        →
                      </span>

                    </button>

                  </div>

                </div>

              </form>

            )}

          

            <div className="secure-note">

              <span>
                🔒
              </span>

              <span>
                {t.secureNote}
              </span>

            </div>

           
            <div className="login-row">

              {t.alreadyAccount}

              <a href="/login">
                {t.login} →
              </a>

            </div>

          </div>

        </section>

      </main>
      <footer className="footer">

        © 2026 SAHARA
        &nbsp; • &nbsp;
        Give
        &nbsp; • &nbsp;
        Help
        &nbsp; • &nbsp;
        Build Communities
        &nbsp; • &nbsp;
        Together

      </footer>

    </div>
  );
};

export default Register;