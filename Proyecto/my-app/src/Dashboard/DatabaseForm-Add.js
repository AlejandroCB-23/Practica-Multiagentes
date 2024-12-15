import React, { useState } from 'react';
import styles from './DatabaseForm.module.css';

function DatabaseForm({setShowForm}) {
  const [formData, setFormData] = useState({
    name: '',             
    short_term_effects: '',      
    long_term_effects: '',
    history: '', 
    age_range_plus_consumption: '',        
    consumition_frequency: '', 
    probability_of_abandonment: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',             
      short_term_effects: '',      
      long_term_effects: '',
      history: '', 
      age_range_plus_consumption: '',        
      consumition_frequency: '', 
      probability_of_abandonment: ''
    });
  };

  const handleChange = (e) => {
    setError('');
    setSuccess('');
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    setError('');
    setSuccess('');
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay sesión activa. Por favor inicie sesión.');
      return;
    }
    const params = new URLSearchParams({
      name: formData.name,
      short_term_effects: formData.short_term_effects,
      long_term_effects: formData.long_term_effects,
      history: formData.history,
      age_range_plus_consumption: formData.age_range_plus_consumption,
      consumition_frequency: formData.consumition_frequency,
      probability_of_abandonment: formData.probability_of_abandonment
    }).toString();

    try {
      const response = await fetch(`http://localhost:8000/post-drug?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setSuccess('Elemento añadido exitosamente');
        resetForm();
      } else {
        throw new Error('Error al añadir elemento');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ocurrió un error al añadir el elemento');
    } 
  };

  const handleClose = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className={styles.formBackground}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Añadir Nueva Droga</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Nombre de la Droga</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
  
          <div className={styles.formGroup}>
            <label htmlFor="short_term_effects" className={styles.label}>Efectos Inmediatos</label>
            <textarea
              id="short_term_effects"
              name="short_term_effects"
              value={formData.short_term_effects}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>
  
          <div className={styles.formGroup}>
            <label htmlFor="long_term_effects" className={styles.label}>Efectos a Largo Plazo</label>
            <textarea
              id="long_term_effects"
              name="long_term_effects"
              value={formData.long_term_effects}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>
  
          <div className={styles.formGroup}>
            <label htmlFor="history" className={styles.label}>Historia</label>
            <textarea
              id="history"
              name="history"
              value={formData.history}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>
  
          <div className={styles.formGroup}>
            <label htmlFor="age_range_plus_consumption" className={styles.label}>Rango de Edad de Consumo</label>
            <input
              type="text"
              id="age_range_plus_consumption"
              name="age_range_plus_consumption"
              value={formData.age_range_plus_consumption}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
  
          <div className={styles.formGroup}>
            <label htmlFor="consumition_frequency" className={styles.label}>Frecuencia de Consumo</label>
            <input
              type="text"
              id="consumition_frequency"
              name="consumition_frequency"
              value={formData.consumition_frequency}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
  
          <div className={styles.formGroup}>
            <label htmlFor="probability_of_abandonment" className={styles.label}>Probabilidad de Abandono</label>
            <input
              type="text"
              id="probability_of_abandonment"
              name="probability_of_abandonment"
              value={formData.probability_of_abandonment}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
  
          <button type="submit" className={styles.submitButton}>
            Añadir Droga
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

          <button type="button" className={styles.closeButton} onClick={handleClose}>X</button>
        </form>
      </div>
    </div>
  );
}

export default DatabaseForm;
