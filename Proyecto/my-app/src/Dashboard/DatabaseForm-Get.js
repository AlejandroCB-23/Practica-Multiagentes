import React, { useState } from 'react';
import styles from './DatabaseForm.module.css';

function DatabaseDetailForm({ setShowForm }) {
  const [drugName, setDrugName] = useState('');
  const [drugDetails, setDrugDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setDrugDetails(null);

    try {
      const response = await fetch(`/api/database/get?drug_name=${encodeURIComponent(drugName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDrugDetails(data);
      } else {
        throw new Error('Droga no encontrada');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se encontraron detalles para esta droga');
    }
  };

  const handleClose = () => {
    setShowForm(false);
  };

  return (
    <div className={styles.formBackground}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSearch} className={styles.form}>
          <h2 className={styles.formTitle}>Consultar Detalles de Droga</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="drug_name" className={styles.label}>Nombre de la Droga</label>
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
            Buscar
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

          {drugDetails && (
            <div className={styles.detailsContainer}>
              <h3>Detalles de la Droga</h3>
              <p><strong>Descripción:</strong> {drugDetails.drug_description}</p>
              <p><strong>Efectos Inmediatos:</strong> {drugDetails.drug_immediate_effects}</p>
              <p><strong>Efectos a Largo Plazo:</strong> {drugDetails.drug_long_term_effects}</p>
              <p><strong>Rango de Edad:</strong> {drugDetails.drug_age_range}</p>
              <p><strong>Frecuencia de Consumo:</strong> {drugDetails.drug_consumption_frequency}</p>
              <p><strong>Probabilidad de Abandono:</strong> {drugDetails.drug_dropout_likelihood}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default DatabaseDetailForm;