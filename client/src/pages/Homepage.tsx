
import React, { useEffect, useState } from 'react';
import donationBoxImg from '../components/image/image2.png';

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    const featureTimer = setInterval(() => {
      setActiveFeature((current) => (current + 1) % 3);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(featureTimer);
    };
  }, []);

  const content = {
    en: {
      home: 'Home',
      about: 'About',
      howWorks: 'How it works',
      explore: 'Explore',
      login: 'Login',
      signup: 'Sign Up',

      badge: 'Small help can make a big difference.',
      titleFirst: 'Share what you can.',
      titleSecond: 'Help someone nearby.',
      description:
        'SAHARA connects people who want to donate useful things with people who need them. Share food, clothes, books and everyday essentials with your community.',

      donate: 'Start Donating',
      find: 'Find Donations',

      joined: 'People are already helping in their communities',

      features: [
        {
          icon: '🎁',
          title: 'Give What You Can',
          text: 'Share food, clothes, books or other useful items that you no longer need.',
        },
        {
          icon: '📍',
          title: 'Help People Nearby',
          text: 'Find donation opportunities around your area and connect with your community.',
        },
        {
          icon: '🤝',
          title: 'Make a Difference',
          text: 'A simple act of sharing can bring real support to someone who needs it.',
        },
      ],

      impact: 'Our Community',
      donations: 'Donations Shared',
      people: 'People Helped',
      communities: 'Communities',
      deliveries: 'Successful Deliveries',

      bottom:
        'Every useful thing deserves a second chance. Share it with someone who needs it.',
    },

    hi: {
      home: 'होम',
      about: 'हमारे बारे में',
      howWorks: 'कैसे काम करता है',
      explore: 'दान खोजें',
      login: 'लॉगिन',
      signup: 'साइन अप',

      badge: 'छोटी सी मदद किसी की बड़ी जरूरत बन सकती है।',
      titleFirst: 'जो आपके पास है, उसे साझा करें।',
      titleSecond: 'किसी जरूरतमंद की मदद करें।',
      description:
        'SAHARA उन लोगों को जोड़ता है जो उपयोगी सामान दान करना चाहते हैं, उन लोगों से जिन्हें उसकी जरूरत है। खाना, कपड़े, किताबें और रोजमर्रा की चीजें अपने समुदाय के साथ साझा करें।',

      donate: 'दान करना शुरू करें',
      find: 'दान खोजें',

      joined: 'लोग अपने समुदाय में मदद करने के लिए जुड़ रहे हैं',

      features: [
        {
          icon: '🎁',
          title: 'जो दे सकते हैं, दें',
          text: 'खाना, कपड़े, किताबें या कोई अन्य उपयोगी सामान जरूरतमंद लोगों के साथ साझा करें।',
        },
        {
          icon: '📍',
          title: 'पास के लोगों की मदद करें',
          text: 'अपने आसपास जरूरतमंद लोगों और उपलब्ध donations को खोजें और समुदाय से जुड़ें।',
        },
        {
          icon: '🤝',
          title: 'बदलाव की शुरुआत करें',
          text: 'आपकी छोटी सी मदद किसी जरूरतमंद व्यक्ति के लिए बहुत मायने रख सकती है।',
        },
      ],

      impact: 'हमारा समुदाय',
      donations: 'कुल Donations',
      people: 'लोगों की मदद',
      communities: 'Communities',
      deliveries: 'सफल Deliveries',

      bottom:
        'हर उपयोगी चीज को दूसरा मौका मिलना चाहिए। उसे किसी जरूरतमंद के साथ साझा करें।',
    },
  };

  const t = content[language];

  return (
    <div className="sahara-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .sahara-page {
          min-height: 100vh;
          background: #f7faf8;
          color: #20322f;
          font-family: "Segoe UI", Arial, sans-serif;
          overflow-x: hidden;
        }

        /* Navigation */

        .sahara-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 14px 0;
          transition: 0.25s ease;
        }

        .sahara-nav.scrolled {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 18px rgba(25, 55, 45, 0.08);
        }

        .nav-container {
          max-width: 1160px;
          margin: auto;
          padding: 0 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sahara-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #193b35;
          font-size: 22px;
          font-weight: 800;
          text-decoration: none;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e7f5ea;
          border: 1px solid #cce8d1;
          border-radius: 12px;
          font-size: 21px;
        }

        .brand-name span {
          color: #16827f;
        }

        .desktop-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .desktop-links a {
          color: #566762;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 9px 14px;
          border-radius: 8px;
          transition: 0.2s;
        }

        .desktop-links a:hover,
        .desktop-links a.active {
          background: #edf7f0;
          color: #147b78;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .language-switch {
          display: flex;
          align-items: center;
          padding: 3px;
          border: 1px solid #d8e5e0;
          border-radius: 20px;
          background: white;
        }

        .language-switch button {
          border: 0;
          background: transparent;
          color: #71807c;
          padding: 6px 9px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .language-switch button.active {
          background: #e6f4ed;
          color: #17746e;
        }

        .login-link {
          color: #147b78;
          border: 1px solid #147b78;
          border-radius: 8px;
          padding: 9px 17px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.2s;
        }

        .login-link:hover {
          color: white;
          background: #147b78;
        }

        .signup-link {
          color: white;
          background: #168c65;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.2s;
        }

        .signup-link:hover {
          background: #117555;
          transform: translateY(-1px);
        }

        .menu-button {
          display: none;
          border: 0;
          background: transparent;
          font-size: 23px;
          cursor: pointer;
        }

        /* Hero */

        .hero-section {
          max-width: 1160px;
          margin: auto;
          padding: 65px 22px 55px;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          align-items: center;
          gap: 60px;
        }

        .hero-content {
          max-width: 620px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #edf7ef;
          color: #287449;
          border: 1px solid #d8ecdc;
          padding: 8px 13px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          background: #3b9c62;
          border-radius: 50%;
        }

        .hero-title {
          margin: 20px 0 17px;
          font-size: clamp(42px, 5vw, 66px);
          line-height: 1.08;
          letter-spacing: -2.5px;
          font-weight: 800;
          color: #1e342f;
        }

        .hero-title .highlight {
          color: #16827f;
        }

        .hero-description {
          max-width: 570px;
          margin: 0 0 27px;
          color: #64736f;
          font-size: 16px;
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .primary-action,
        .secondary-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 21px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.25s;
        }

        .primary-action {
          background: #168c65;
          color: white;
          box-shadow: 0 8px 18px rgba(22, 140, 101, 0.17);
        }

        .primary-action:hover {
          background: #117555;
          color: white;
          transform: translateY(-2px);
        }

        .secondary-action {
          background: white;
          color: #147b78;
          border: 1px solid #cfe1dc;
        }

        .secondary-action:hover {
          background: #f1f8f5;
          color: #147b78;
          transform: translateY(-2px);
        }

        .community-note {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 23px;
          color: #7a8985;
          font-size: 12px;
        }

        .people-icons {
          display: flex;
        }

        .person {
          width: 28px;
          height: 28px;
          margin-left: -6px;
          border: 2px solid #f7faf8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dceee5;
          font-size: 12px;
        }

        .person:first-child {
          margin-left: 0;
        }

        /* Hero image */

        .hero-image-area {
          position: relative;
          min-height: 440px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-background {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: #e4f2e8;
        }

        .image-container {
          position: relative;
          z-index: 2;
          width: min(390px, 88%);
          aspect-ratio: 1;
          padding: 9px;
          background: white;
          border-radius: 32px;
          box-shadow: 0 20px 45px rgba(30, 65, 53, 0.13);
          transform: rotate(2deg);
          transition: 0.35s;
        }

        .image-container:hover {
          transform: rotate(0deg) translateY(-5px);
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 25px;
        }

        .image-card {
          position: absolute;
          z-index: 3;
          background: white;
          border: 1px solid #e0ebe6;
          border-radius: 12px;
          padding: 12px 15px;
          box-shadow: 0 10px 28px rgba(25, 55, 45, 0.12);
        }

        .image-card.top {
          left: 4px;
          top: 48px;
        }

        .image-card.bottom {
          right: 0;
          bottom: 45px;
        }

        .card-small {
          color: #7a8985;
          font-size: 10px;
          margin-bottom: 3px;
        }

        .card-main {
          color: #243b35;
          font-size: 13px;
          font-weight: 800;
        }

        /* Features */

        .features-section {
          max-width: 1160px;
          margin: auto;
          padding: 20px 22px 60px;
        }

        .section-heading {
          margin-bottom: 20px;
        }

        .section-heading small {
          color: #16827f;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .section-heading h2 {
          margin: 5px 0 0;
          font-size: 27px;
          color: #203a34;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .feature-card {
          padding: 22px;
          border: 1px solid #e0ebe6;
          background: white;
          border-radius: 15px;
          transition: 0.25s;
          cursor: pointer;
        }

        .feature-card:hover,
        .feature-card.active {
          border-color: #b9d9cb;
          transform: translateY(-4px);
          box-shadow: 0 13px 30px rgba(30, 70, 55, 0.08);
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #edf7f0;
          border-radius: 10px;
          font-size: 20px;
          margin-bottom: 14px;
        }

        .feature-card h3 {
          margin: 0 0 7px;
          font-size: 16px;
          color: #243c36;
        }

        .feature-card p {
          margin: 0;
          color: #71807c;
          font-size: 13px;
          line-height: 1.6;
        }

        /* Statistics */

        .stats-section {
          max-width: 1160px;
          margin: auto;
          padding: 0 22px 45px;
        }

        .stats-container {
          background: #183f38;
          border-radius: 17px;
          padding: 24px 15px;
        }

        .stats-title {
          text-align: center;
          color: #b8d8ce;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 19px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .stat-item {
          text-align: center;
          padding: 0 15px;
          border-right: 1px solid rgba(255,255,255,0.12);
        }

        .stat-item:last-child {
          border-right: 0;
        }

        .stat-number {
          color: white;
          font-size: 22px;
          font-weight: 800;
        }

        .stat-label {
          margin-top: 3px;
          color: #aac8c0;
          font-size: 11px;
        }

        .bottom-message {
          max-width: 700px;
          margin: auto;
          padding: 0 22px 45px;
          text-align: center;
          color: #71807c;
          font-size: 13px;
          line-height: 1.6;
        }

        /* Mobile menu */

        .mobile-menu {
          display: none;
        }

        @media (max-width: 900px) {
          .desktop-links {
            display: none;
          }

          .menu-button {
            display: block;
          }

          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 45px;
          }

          .hero-content {
            margin: auto;
          }

          .hero-actions,
          .community-note {
            justify-content: center;
          }

          .hero-image-area {
            min-height: 400px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .mobile-menu {
            display: block;
            max-width: 1160px;
            margin: 4px auto 0;
            padding: 0 22px;
          }

          .mobile-menu-inner {
            background: white;
            border: 1px solid #e0ebe6;
            border-radius: 12px;
            padding: 8px;
            box-shadow: 0 10px 25px rgba(25,55,45,.08);
          }

          .mobile-menu-inner a {
            display: block;
            padding: 11px 12px;
            color: #566762;
            text-decoration: none;
            border-radius: 8px;
            font-size: 14px;
          }

          .mobile-menu-inner a:hover {
            background: #edf7f0;
            color: #147b78;
          }
        }

        @media (max-width: 600px) {
          .nav-container {
            padding: 0 15px;
          }

          .sahara-brand {
            font-size: 19px;
          }

          .brand-mark {
            width: 36px;
            height: 36px;
          }

          .login-link {
            display: none;
          }

          .signup-link {
            padding: 9px 13px;
            font-size: 12px;
          }

          .language-switch button {
            padding: 5px 7px;
          }

          .hero-section {
            padding: 38px 17px 35px;
            gap: 20px;
          }

          .hero-title {
            font-size: 42px;
            letter-spacing: -1.8px;
          }

          .hero-description {
            font-size: 14px;
          }

          .hero-actions {
            width: 100%;
          }

          .primary-action,
          .secondary-action {
            flex: 1;
            min-width: 140px;
            padding: 0 12px;
            font-size: 13px;
          }

          .hero-image-area {
            min-height: 340px;
          }

          .image-background {
            width: 285px;
            height: 285px;
          }

          .image-container {
            width: 310px;
          }

          .image-card.top {
            left: -2px;
            top: 22px;
          }

          .image-card.bottom {
            right: -2px;
            bottom: 22px;
          }

          .features-section,
          .stats-section {
            padding-left: 17px;
            padding-right: 17px;
          }

          .section-heading h2 {
            font-size: 23px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 18px 0;
          }

          .stat-item {
            border-right: 0;
          }

          .stat-number {
            font-size: 18px;
          }

          .stat-label {
            font-size: 9px;
          }
        }
      `}</style>

      {/* Navigation */}
      <header className={`sahara-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">

          <a href="#" className="sahara-brand">
            <div className="brand-mark">🌿</div>
            <div className="brand-name">
              SAHARA<span>.</span>
            </div>
          </a>

          <nav className="desktop-links">
            <a href="#" className="active">{t.home}</a>
            <a href="#features">{t.about}</a>
            <a href="#features">{t.howWorks}</a>
            <a href="/explore">{t.explore}</a>
          </nav>

          <div className="nav-actions">

            {/* Language Switch */}
            <div className="language-switch">
              <button
                type="button"
                className={language === 'en' ? 'active' : ''}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>

              <button
                type="button"
                className={language === 'hi' ? 'active' : ''}
                onClick={() => setLanguage('hi')}
              >
                हिं
              </button>
            </div>

            <a href="/login" className="login-link">
              {t.login}
            </a>

            <a href="/register" className="signup-link">
              {t.signup}
            </a>

            <button
              type="button"
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? '×' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              <a href="#" onClick={() => setMenuOpen(false)}>
                {t.home}
              </a>

              <a href="#features" onClick={() => setMenuOpen(false)}>
                {t.about}
              </a>

              <a href="#features" onClick={() => setMenuOpen(false)}>
                {t.howWorks}
              </a>

              <a href="/explore" onClick={() => setMenuOpen(false)}>
                {t.explore}
              </a>
            </div>
          </div>
        )}
      </header>

      <main>

        {/* Hero */}
        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-badge">
              <span className="badge-dot"></span>
              {t.badge}
            </div>

            <h1 className="hero-title">
              {t.titleFirst}
              <br />
              <span className="highlight">
                {t.titleSecond}
              </span>
            </h1>

            <p className="hero-description">
              {t.description}
            </p>

            <div className="hero-actions">
              <a href="/register" className="primary-action">
                {t.donate} →
              </a>

              <a href="/explore" className="secondary-action">
                {t.find} ↗
              </a>
            </div>

            <div className="community-note">
              <div className="people-icons">
                <div className="person"></div>
                <div className="person"></div>
                <div className="person"></div>
                <div className="person"></div>
              </div>

              <span>{t.joined}</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image-area">

            <div className="image-background"></div>

            <div className="image-card top">
              <div className="card-small">
                {language === 'en' ? 'Community' : 'समुदाय'}
              </div>
              <div className="card-main">
                🌱 {language === 'en' ? 'Growing together' : 'साथ मिलकर आगे बढ़ें'}
              </div>
            </div>

            <div className="image-container">
              <img
                src={donationBoxImg}
                alt="SAHARA donation"
              />
            </div>

            <div className="image-card bottom">
              <div className="card-small">
                {language === 'en' ? 'Every contribution matters' : 'हर मदद जरूरी है'}
              </div>
              <div className="card-main">
                💛 {language === 'en' ? 'Share & Care' : 'साझा करें और मदद करें'}
              </div>
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="features-section" id="features">

          <div className="section-heading">
            <small>
              {language === 'en' ? 'Why SAHARA' : 'SAHARA क्यों?'}
            </small>

            <h2>
              {language === 'en'
                ? 'Simple ways to help your community'
                : 'अपने समुदाय की मदद करने के आसान तरीके'}
            </h2>
          </div>

          <div className="features-grid">
            {t.features.map((feature, index) => (
              <div
                key={feature.title}
                className={`feature-card ${
                  activeFeature === index ? 'active' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </div>
            ))}
          </div>

        </section>

        {/* Community Stats */}
        <section className="stats-section">

          <div className="stats-container">

            <div className="stats-title">
              {t.impact}
            </div>

            <div className="stats-grid">

              <div className="stat-item">
                <div className="stat-number">1,240+</div>
                <div className="stat-label">{t.donations}</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">892+</div>
                <div className="stat-label">{t.people}</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">120+</div>
                <div className="stat-label">{t.communities}</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">{t.deliveries}</div>
              </div>

            </div>
          </div>

        </section>

        <div className="bottom-message">
          {t.bottom}
        </div>

      </main>
    </div>
  );
};

export default Home;
