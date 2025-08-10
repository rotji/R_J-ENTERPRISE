import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import PoolCard from '../components/PoolCard';
import { Pool } from '../components/PoolCard';
import styles from '../../styles/pools.module.css';

const AllPoolsPage = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const data = await apiCall('/api/pools', 'GET');
        setPools(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch pools.');
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  let content;

  if (loading) {
    content = <p>Loading pools...</p>;
  } else if (error) {
    content = <p className={styles.error}>{error}</p>;
  } else if (pools.length === 0) {
    content = <p>No pools have been created yet.</p>;
  } else {
    content = (
      <div className={styles.poolsGrid}>
        {pools.map((pool) => (
          <PoolCard key={pool._id} pool={pool} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>All Available Pools</h1>
      {content}
    </div>
  );
};

export default AllPoolsPage;
