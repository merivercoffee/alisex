import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import '../styles/Footer.css';

function Footer({ language }) {
  const translations = {
    en: {
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      follow: 'Follow Us',
      copyright: '© 2024 GlobalShop. All rights reserved.',
    },
    es: {
      about: 'Acerca de',
      contact: 'Contacto',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      follow: 'Síguenos',
      copyright: '© 2024 GlobalShop. Todos los derechos reservados.',
    },
    fr: {
      about: 'À propos',
      contact: 'Contact',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions de service',
      follow: 'Suivez-nous',
      copyright: '© 2024 GlobalShop. Tous droits réservés.',
    },
    zh: {
      about: '关于我们',
      contact: '联系我们',
      privacy: '隐私政策',
      terms: '服务条款',
      follow: '关注我们',
      copyright: '© 2024 GlobalShop 版权所有。',
    },
    ja: {
      about: '私たちについて',
      contact: 'お問い合わせ',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      follow: 'フォローする',
      copyright: '© 2024 GlobalShop. 著作権所有。',
    },
  };

  const t = translations[language] || translations.en;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>GlobalShop</h3>
          <p>Your trusted global e-commerce platform</p>
        </div>

        <div className="footer-section">
          <h4>{t.about}</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t.contact}</h4>
          <ul>
            <li><a href="mailto:support@globalshop.com">support@globalshop.com</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Sellers</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t.follow}</h4>
          <div className="social-links">
            <a href="#"><FiFacebook /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiInstagram /></a>
            <a href="#"><FiLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p><a href="#">{t.privacy}</a> | <a href="#">{t.terms}</a></p>
        <p>{t.copyright}</p>
      </div>
    </footer>
  );
}

export default Footer;
