import React from "react";
import styles from "../../styles/header.module.css";

const APP_NAME = "R_J ENTERPRISE";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
  { name: "Create Pool", href: "/create-pool" },
  { name: "Pools", href: "/pools" },
  { name: "Bids", href: "/bids" },
];

// define the prop type
type HeaderProps = {
  onOpenSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  // Close mobile nav on route change (optional, if using react-router)
  React.useEffect(() => {
    if (!mobileNavOpen) return;
    const close = () => setMobileNavOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [mobileNavOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>{APP_NAME}</h1>
        {/* Desktop Nav */}
        <nav className={styles.centerNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className={styles.navLink}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Hamburger for mobile */}
        <button
          className={styles.hamburger}
          aria-label="Open mobile menu"
          onClick={() => {
           setMobileNavOpen((v) => !v);
               onOpenSidebar();
            }}
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>
      </div>
      {/* Mobile Nav */}
      {mobileNavOpen && (
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavList}>
            <li>
              <a href="/user-dashboard" className={styles.mobileNavLink}>
                User Dashboard
              </a>
            </li>
            <li>
              <a href="/vendor-dashboard" className={styles.mobileNavLink}>
                Vendor Dashboard
              </a>
            </li>
            <li>
              <a href="/admin-dashboard" className={styles.mobileNavLink}>
                Admin Dashboard
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default React.memo(Header);
