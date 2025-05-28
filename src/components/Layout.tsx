import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// === Header Component ===
function Header() {
  return (
    <nav className="header">
      <div className="header-logo">
        <a href="/" className="header-logo-link">
          Last.fm
        </a>
      </div>

      <div className="header-wrap">
        <a className="header-search" href="/search" aria-label="Search">
          {/* Search icon handled via CSS */}
        </a>

        <div className="header-nav">
          <ul className="header-nav-list" role="menubar">
            <NavItem label="Live" />
            <NavItem label="Music" />
            <NavItem label="Charts" />
            <NavItem label="Events" />
          </ul>
        </div>

        <a className="header-avatar" aria-label="User profile">
          <img className="header-avatar-img" src="images/image.png" loading="eager" {...{ fetchpriority: 'high' }} />
        </a>
      </div>
    </nav>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <li className="header-nav-item" role="menuitem">
      <a className="header-nav-link">{label}</a>
    </li>
  );
}

// === Footer Component ===
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <FooterSection title="Company">
            <FooterLink>About Last.fm</FooterLink>
            <FooterLink>Contact Us</FooterLink>
            <FooterLink>Jobs</FooterLink>
            <FooterLink>Features</FooterLink>
          </FooterSection>

          <FooterSection title="Help">
            <FooterLink>Track My Music</FooterLink>
            <FooterLink>Community Support</FooterLink>
            <FooterLink>Community Guidelines</FooterLink>
            <FooterLink>Help</FooterLink>
          </FooterSection>

          <FooterSection title="Goodies">
            <FooterLink>Download Scrobbler</FooterLink>
            <FooterLink>Developer API</FooterLink>
            <FooterLink>Free Music Downloads</FooterLink>
            <FooterLink>Merchandise</FooterLink>
          </FooterSection>

          <FooterSection title="Account">
            <FooterLink>Inbox</FooterLink>
            <FooterLink>Settings</FooterLink>
            <FooterLink>Last.fm Pro</FooterLink>
            <FooterLink>Logout</FooterLink>
          </FooterSection>

          <FooterSection title="Follow Us">
            <FooterLink>Facebook</FooterLink>
            <FooterLink>Bluesky</FooterLink>
            <FooterLink>Instagram</FooterLink>
            <FooterLink>YouTube</FooterLink>
          </FooterSection>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <div className="footer-languages">
              <a className="footer-language footer-language--active">English</a>
              <a className="footer-language">Deutsch</a>
              <a className="footer-language">Español</a>
              <a className="footer-language">Français</a>
              <a className="footer-language">Italiano</a>
              <a className="footer-language">日本語</a>
              <a className="footer-language">Polski</a>
              <a className="footer-language">Português</a>
              <a className="footer-language">Русский</a>
              <a className="footer-language">Svenska</a>
              <a className="footer-language">Türkçe</a>
              <a className="footer-language">简体中文</a>
            </div>

            <div className="footer-timezone">Time zone: Europe/Moscow</div>

            <div className="footer-legal">
              CBS Interactive © 2025 Last.fm Ltd. All rights reserved · Terms of Use · Privacy Policy · Legal Policies · California Notice · Your Privacy Choices · Jobs at Paramount · Last.fm Music
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// === Reusable Components for Footer ===
function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="footer-section">
      <h4 className="footer-title">{title}</h4>
      <ul className="footer-list">{children}</ul>
    </div>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <li className="footer-item">
      <a className="footer-link">{children}</a>
    </li>
  );
}