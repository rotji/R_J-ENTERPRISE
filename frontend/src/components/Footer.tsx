import React from "react";
import styles from "../../styles/footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMainInfo}>
          <strong>R_J ENTERPRISE</strong> &mdash; Collaborative Bulk Buying
          Platform
        </div>
        <ul className={styles.footerLinks}>
          <li>
            <a href="/about" className={styles.footerLink}>
              About
            </a>
          </li>
          <li>
            <a
              href="/docs/developerschecklist.md"
              className={styles.footerLink}
            >
              Developer Checklist
            </a>
          </li>
          <li>
            <a href="/docs/logics.md" className={styles.footerLink}>
              Project Logic
            </a>
          </li>
          <li>
            <a href="/docs/readme.md" className={styles.footerLink}>
              Docs
            </a>
          </li>
          <li>
            <a
              href="https://github.com/your-org/your-repo"
              className={styles.footerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
        <div className={styles.footerContact}>
          <span>
            <strong>Contact:</strong> rjenterprise@gmail.com | WhatsApp: +234 703
            373 3737 | Twitter: @rjenterprise | Instagram: @rjenterprise
          </span>
        </div>
        <div className={styles.footerSponsors}>
          <span>
            <strong>Sponsors:</strong>
          </span>{" "}
          <span>
            <strong>Partners:</strong>
          </span>
        </div>
        <div className={styles.footerTech}>
          <span>
            Built with Vite, React, TypeScript, Node.js, Express, MongoDB Atlas
          </span>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} R_J ENTERPRISE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
