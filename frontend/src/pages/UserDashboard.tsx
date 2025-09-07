import React, { useEffect, useState } from 'react';
import { getUserDashboardData } from '../utils/api';
import styles from '../../styles/dashboard.module.css';

interface IPool {
  _id: string;
  title: string;
  amount: number;
  status: string;
}

interface ITransaction {
  _id: string;
  createdAt: string;
  type: string;
  amount: number;
  status: string;
}

const UserDashboard: React.FC = () => {
  const [pools, setPools] = useState<IPool[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
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
        const data = await getUserDashboardData(token);
        setPools(data.pools);
        setTransactions(data.transactions);
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
      <h1>User Dashboard</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My Pools</h2>
        {pools.length > 0 ? pools.map((pool) => (
          <div key={pool._id} className={styles.card}>
            <h3>{pool.title}</h3>
            <p>Amount: ${pool.amount}</p>
            <p>Status: {pool.status}</p>
          </div>
        )) : <p>No pools found.</p>}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My Transactions</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td>{tx.type}</td>
                <td>${tx.amount}</td>
                <td>{tx.status}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserDashboard;
