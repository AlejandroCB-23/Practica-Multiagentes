import React, { useState, useEffect } from 'react';
import styles from './DatabaseForm.module.css';

function DatabaseForm({ setShowForm }) {
  const [formData, setFormData] = useState({
    name: '',             
    short_term_effects: '',      
    long_term_effects: '',
    history: '', 
    age_range_plus_consumption: '',        
    consumition_frequency: '', 
    probability_of_abandonment: ''
  });

  const [drugExists, setDrugExists] = useState(false);
  const [drugData, setDrugData] = useState({});

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
    setDrugExists(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGetDrug = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay sesión activa. Por favor inicie sesión.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/get-drug-by-name/${encodeURIComponent(formData.name)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No hay sesión activa. Por favor inicie sesión.');
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
      const response = await fetch(`http://localhost:8000/update-drug-by-name?${params}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
              <label htmlFor="name" className={styles.label}>Nombre de la Droga</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                disabled
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

            <button type="submit" className={styles.submitButton}>Editar Droga</button>
            <button type="button" className={styles.closeButton} onClick={handleClose}>X</button>
          </form>
        ) : (
          <form onSubmit={handleGetDrug} className={styles.form}>
            <h2 className={styles.formTitle}>Introducir Nombre de Droga</h2>
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

            <button type="submit" className={styles.submitButton}>Buscar Droga</button>
            <button type="button" className={styles.closeButton} onClick={handleClose}>X</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default DatabaseForm;
