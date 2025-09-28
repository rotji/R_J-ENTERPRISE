import React, { useEffect, useState } from 'react';
import { getAdminDashboardData } from '../utils/api';
import styles from '../../styles/dashboard.module.css';

interface IAdminData {
  users?: { daily: number; weekly: number; monthly: number; };
  revenue?: { daily: number; weekly: number; monthly: number; };
  pools?: { daily: number; weekly: number; monthly: number; };
  allBids?: any[];
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<IAdminData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
          setError('No token found');
          setLoading(false);
          return;
        }
        
        let userData;
        try {
          userData = JSON.parse(userInfo);
        } catch (parseError) {
          setError('Invalid user data');
          setLoading(false);
          return;
        }
        
        const token = userData.token;
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }
        const response = await getAdminDashboardData(token);
        setData(response);
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
          <p>Daily Active: {data.users?.daily}</p>
          <p>Weekly Active: {data.users?.weekly}</p>
          <p>Monthly Active: {data.users?.monthly}</p>
        </div>
        <div className={styles.card}>
          <h3>Revenue</h3>
          <p>Daily: ${data.revenue?.daily}</p>
          <p>Weekly: ${data.revenue?.weekly}</p>
          <p>Monthly: ${data.revenue?.monthly}</p>
        </div>
        <div className={styles.card}>
          <h3>Pools</h3>
          <p>Daily Created: {data.pools?.daily}</p>
          <p>Weekly Created: {data.pools?.weekly}</p>
          <p>Monthly Created: {data.pools?.monthly}</p>
        </div>
      </section>

      <section className={styles.section}>
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
            {data.allBids && data.allBids.length > 0 ? data.allBids.map((bid: any) => (
              <tr key={bid._id}>
                <td>{bid.pool?.title}</td>
                <td>{bid.supplier?.username}</td>
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
      </section>
    </div>
  );
};

export default AdminDashboard;
