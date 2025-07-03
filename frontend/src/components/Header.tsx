import React from "react";
import styles from "../../styles/header.module.css";

const APP_NAME = "R_J ENTERPRISE";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
];

interface HeaderProps {
  onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>{APP_NAME}</h1>
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
        <button
          className={styles.hamburger}
          aria-label="Open sidebar menu"
          onClick={onOpenSidebar}
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>
      </div>
    </header>
  );
};

export default React.memo(Header);
