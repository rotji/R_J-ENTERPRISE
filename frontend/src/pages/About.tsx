import React from "react";
import styles from "../../styles/about.module.css";

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>About R_J ENTERPRISE</h1>
      <p className={styles.aboutIntro}>
        <strong>R_J ENTERPRISE</strong> was founded with the vision of making
        bulk buying accessible, transparent, and beneficial for everyone. We
        believe in the power of community and collaboration to unlock better
        prices and opportunities for individuals and small businesses.
      </p>
      <h2 className={styles.aboutSectionTitle}>Our Mission</h2>
      <p className={styles.aboutSectionText}>
        To empower people and organizations to save money and access quality
        products by joining forces and leveraging collective bargaining.
      </p>
      <h2 className={styles.aboutSectionTitle}>Our Vision</h2>
      <p className={styles.aboutSectionText}>
        To become the leading platform for collaborative purchasing, supporting
        local economies and fostering trust among buyers and sellers.
      </p>
      <h2 className={styles.aboutSectionTitle}>Our Team</h2>
      <p className={styles.aboutSectionTextLast}>
        We are a passionate group of entrepreneurs, technologists, and community
        advocates dedicated to building a fair, efficient, and user-friendly
        bulk buying experience. Our team is committed to continuous improvement
        and customer satisfaction.
      </p>
    </div>
  );
};

export default About;
