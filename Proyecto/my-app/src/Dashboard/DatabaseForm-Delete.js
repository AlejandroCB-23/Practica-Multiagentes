import React, { useState } from 'react';

import styles from './DatabaseForm.module.css';

function DatabaseDetailForm({ setShowForm }) {
  const [drugName, setDrugName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8000/delete-drug-by-name/${encodeURIComponent(drugName)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Droga eliminada exitosamente');
        setDrugName('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'No se pudo eliminar la droga');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al intentar eliminar la droga');
    }
  };

  const handleClose = () => {
    setShowForm(false);
  };

  return (
    <div className={styles.formBackground}>
      <div className={styles.formContainer}>
        <form onSubmit={handleDelete} className={styles.form}>
          <h2 className={styles.formTitle}>Eliminar Droga</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="drug_name" className={styles.label}>Nombre de la Droga a Eliminar</label>
            <input
              type="text"
              id="drug_name"
              name="drug_name"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              className={styles.input}
              required
              placeholder="Ingrese el nombre de la droga"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Eliminar
          </button>
          <button 
            type="button" 
            className={styles.closeButton} 
            onClick={handleClose}
          >
            X
          </button>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default DatabaseDetailForm;