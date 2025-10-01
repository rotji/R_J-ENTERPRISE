import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import PoolCard from '../components/PoolCard';
import type { Pool } from '../components/PoolCard';
import styles from '../../styles/pools.module.css';

const AllPoolsPage = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const debounceTimer = setTimeout(() => {
      const fetchPools = async () => {
        try {
          const endpoint = searchTerm ? `/api/pools?search=${searchTerm}` : '/api/pools';
          const data = await apiCall<Pool[]>(endpoint, 'GET');
          setPools(data);
          setError(null);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
          setPools([]); // Clear pools on error
        } finally {
          setLoading(false);
        }
      };

      fetchPools();
    }, 300); // 300ms debounce delay

    // Cleanup function to clear the timeout if the user types again
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]); // Re-run effect when searchTerm changes

  let content;

  if (loading) {
    content = <p>Loading pools...</p>;
  } else if (error) {
    content = <p className={styles.error}>{error}</p>;
  } else if (pools.length === 0) {
    content = <p>No pools found.</p>;
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
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for pools (e.g., rice, beans)..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {content}
    </div>
  );
};

export default AllPoolsPage;
