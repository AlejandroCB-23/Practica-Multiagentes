import React, { useState, useEffect } from 'react';
import styles from './DatabaseForm.module.css';

function DatabaseForm({ setShowForm }) {
  const [formData, setFormData] = useState({
    drug_name: '',
    drug_description: '',
    drug_immediate_effects: '',
    drug_long_term_effects: '',
    drug_age_range: '',
    drug_consumption_frequency: '',
    drug_dropout_likelihood: ''
  });

  const [drugExists, setDrugExists] = useState(false);
  const [drugData, setDrugData] = useState({});

  const resetForm = () => {
    setFormData({
      drug_name: '',
      drug_description: '',
      drug_immediate_effects: '',
      drug_long_term_effects: '',
      drug_age_range: '',
      drug_consumption_frequency: '',
      drug_dropout_likelihood: ''
    });
    setDrugExists(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
// FIX: CHANGE TO GET WHEN THE API IS READY and CHANGE TO USE THE SAME STILE THAN THE GET OF GET FORM
  const handleGetDrug = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/database/get/${formData.drug_name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDrugData(data);
        setDrugExists(true);
      } else {
        throw new Error('Error al obtener droga');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al obtener la droga');
    }
  };

  useEffect(() => {
    if (drugExists) {
      setFormData(drugData);
    }
  }, [drugExists, drugData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/database/put/${formData.drug_name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Elemento editado exitosamente');
      } else {
        throw new Error('Error al editar elemento');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al editar el elemento');
    } finally {
      setShowForm(false);
      resetForm();
    }
  };

  const handleClose = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className={styles.formBackground}>
      <div className={styles.formContainer}>
        {drugExists ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>Editar Droga</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="drug_name" className={styles.label}>Nombre de la Droga</label>
              <input
                type="text"
                id="drug_name"
                name="drug_name"
                value={formData.drug_name}
                onChange={handleChange}
                className={styles.input}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="drug_description" className={styles.label}>Descripción</label>
              <textarea
                id="drug_description"
                name="drug_description"
                value={formData.drug_description}
                onChange={handleChange}
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="drug_immediate_effects" className={styles.label}>Efectos Inmediatos</label>
              <textarea
                id="drug_immediate_effects"
                name="drug_immediate_effects"
                value={formData.drug_immediate_effects}
                onChange={handleChange}
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="drug_long_term_effects" className={styles.label}>Efectos a Largo Plazo</label>
              <textarea
                id="drug_long_term_effects"
                name="drug_long_term_effects"
                value={formData.drug_long_term_effects}
                onChange={handleChange}
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="drug_age_range" className={styles.label}>Rango de Edad de Consumo</label>
              <input
                type="text"
                id="drug_age_range"
                name="drug_age_range"
                value={formData.drug_age_range}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="drug_consumption_frequency" className={styles.label}>Frecuencia de Consumo</label>
              <input
                type="text"
                id="drug_consumption_frequency"
                name="drug_consumption_frequency"
                value={formData.drug_consumption_frequency}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="drug_dropout_likelihood" className={styles.label}>Probabilidad de Abandono</label>
              <input
                type="text"
                id="drug_dropout_likelihood"
                name="drug_dropout_likelihood"
                value={formData.drug_dropout_likelihood}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Editar Droga
            </button>
            <button type="button" className={styles.closeButton} onClick={handleClose}>X</button>
          </form>
        ) : (
          <form onSubmit={handleGetDrug} className={styles.form}>
            <h2 className={styles.formTitle}>Introducir Nombre de Droga</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="drug_name" className={styles.label}>Nombre de la Droga</label>
              <input
                type="text"
                id="drug_name"
                name="drug_name"
                value={formData.drug_name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Buscar Droga
            </button>
            <button type="button" className={styles.closeButton} onClick={handleClose}>X</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default DatabaseForm;