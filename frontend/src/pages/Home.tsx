import React from "react";
import styles from "../../styles/home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeTitle}>Welcome to R_J ENTERPRISE</h1>
      <p className={styles.homeIntro}>
        <strong>R_J ENTERPRISE</strong> is a collaborative bulk buying platform
        designed to empower individuals, small businesses, and communities to
        save money by pooling their purchasing power. Our mission is to make
        high-quality products more affordable and accessible by enabling group
        purchases, negotiating better deals, and streamlining the buying
        process.
      </p>
      <ul className={styles.homeList}>
        <li>✔️ Join or create buying groups for products you need</li>
        <li>✔️ Access exclusive bulk discounts and offers</li>
        <li>✔️ Transparent, secure, and easy-to-use platform</li>
        <li>✔️ Support local businesses and community initiatives</li>
      </ul>
      <p className={styles.homeOutro}>
        Start exploring today and discover how collaborative buying can benefit
        you and your community!
      </p>
    </div>
  );
};

export default Home;
