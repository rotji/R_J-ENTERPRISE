import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import styles from '../../styles/createpool.module.css';

const CreatePoolForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    closingDate: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const { title, description, amount, closingDate, location } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = userInfo.token;

      if (!token) {
        setError('You must be logged in to create a pool.');
        setLoading(false);
        return;
      }

      await apiCall('/api/pools', 'POST', formData, token);
      setSuccess('Pool created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
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

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Create a New Pool</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Pool Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            className={styles.input}
            placeholder="e.g., Rice Pool, Beans Pool"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            rows={4}
            className={styles.textarea}
            placeholder="Provide a brief description of the pool"
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.label}>Amount per Person ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={onChange}
            className={styles.input}
            placeholder="Enter a fixed amount"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="closingDate" className={styles.label}>Closing Date</label>
          <input
            type="date"
            id="closingDate"
            name="closingDate"
            value={closingDate}
            onChange={onChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>Sharing Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            className={styles.input}
            placeholder="Enter the location for sharing goods"
            required
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Pool'}
        </button>
      </form>
      <p className={styles.disclaimer}>
        all pool created are under the control of the admin of this platform
      </p>
    </div>
  );
};

export default CreatePoolForm;
