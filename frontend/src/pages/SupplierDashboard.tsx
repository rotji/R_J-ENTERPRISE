import React, { useEffect, useState } from 'react';
import { getSupplierDashboardData } from '../utils/api';
import styles from '../../styles/dashboard.module.css';

interface IBid {
  _id: string;
  pool: string;
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

const SupplierDashboard: React.FC = () => {
  const [bids, setBids] = useState<IBid[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
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
        const data = await getSupplierDashboardData(token);
        setBids(data.bids);
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
      <h1>Supplier Dashboard</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My Bids</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pool</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bids.length > 0 ? bids.map((bid) => (
              <tr key={bid._id}>
                <td>{bid.pool}</td>
                <td>${bid.amount}</td>
                <td>{bid.status}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3}>No bids found.</td>
              </tr>
            )}
          </tbody>
        </table>
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

export default SupplierDashboard;
