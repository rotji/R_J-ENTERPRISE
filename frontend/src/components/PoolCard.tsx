import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import styles from '../../styles/pools.module.css';

export interface Pool {
  _id: string;
  title: string;
  description: string;
  amount: number;
  closingDate: string;
  location: string;
  creator: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

interface PoolCardProps {
  pool: Pool;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const [memberCount, setMemberCount] = useState(pool.members.length);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo._id) {
      if (pool.members.includes(userInfo._id)) {
        setIsJoined(true);
      }
    }
  }, [pool.members]);

  const handleJoin = async () => {
    setLoading(true);
    setError(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = userInfo.token;

      if (!token) {
        throw new Error('You must be logged in to join a pool.');
      }

      const updatedPool = await apiCall(`/api/pools/${pool._id}/join`, 'POST', {}, token);

      setMemberCount(updatedPool.members.length);
      setIsJoined(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join the pool.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.poolCard}>
      <h3>{pool.title}</h3>
      <p>{pool.description}</p>
      <div className={styles.details}>
        <span>Amount: <strong>${pool.amount}</strong></span>
        <span>Members: <strong>{memberCount}</strong></span>
      </div>
      <p>Closing Date: {new Date(pool.closingDate).toLocaleDateString()}</p>
      <div className={styles.actions}>
        <button
          onClick={handleJoin}
          disabled={isJoined || loading}
          className={styles.joinButton}
        >
          {loading ? 'Joining...' : isJoined ? 'Joined' : 'Join'}
        </button>
        <button className={styles.bidButton}>Bid</button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default PoolCard;
