import React, { useEffect, useState } from 'react';
import { getAdminDashboardData } from '../utils/api';
import styles from '../../styles/dashboard.module.css';

interface IStats {
  userCount?: number;
  poolCount?: number;
  bidCount?: number;
  totalRevenue?: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<IStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }
        const data = await getAdminDashboardData(token);
        setStats({
          userCount: data.userCount,
          poolCount: data.poolCount,
          bidCount: data.bidCount,
          totalRevenue: data.totalRevenue,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Platform Metrics</h2>
        <div className={styles.card}>
          <h3>Users</h3>
          <p>Total Users: {stats.userCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Pools</h3>
          <p>Total Pools: {stats.poolCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Bids</h3>
          <p>Total Bids: {stats.bidCount}</p>
        </div>
        <div className={styles.card}>
          <h3>Revenue</h3>
          <p>Total Revenue: ${stats.totalRevenue}</p>
        </div>
      </section>

      {/* The backend doesn't send all bids, so this section is commented out for now */}
      {/* <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All Bids</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pool</th>
              <th>Supplier</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bids.length > 0 ? bids.map((bid: any) => (
              <tr key={bid._id}>
                <td>{bid.pool.title}</td>
                <td>{bid.supplier.username}</td>
                <td>${bid.amount}</td>
                <td>{bid.status}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4}>No bids found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section> */}
    </div>
  );
};

export default AdminDashboard;
