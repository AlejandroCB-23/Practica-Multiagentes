import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  // Definimos el estado para almacenar el texto del cuadro de entrada
  const [inputValue, setInputValue] = useState('');
  const [displayText, setDisplayText] = useState('');

  // Manejador de cambio para actualizar el valor del cuadro de entrada
  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  // Componente del botón con manejador para mostrar el texto del cuadro de entrada en la alerta
  function MyButton() {

    async function handleClick() {
      try {
        // Construye la URL con el parámetro de consulta
        const response = await fetch('http://localhost:8000/consulta_id/' + inputValue);
  
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
  
        const data = await response.json(); // Suponiendo que la respuesta es JSON
        setDisplayText(data.nombre);
      } catch (error) {
        console.error('Error al consultar el backend:', error);
        setDisplayText('Error al obtener respuesta del servidor');
      }
    }

    return (
      <button onClick={handleClick}>
        Enviar
      </button>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Gestion de Datos</h1>
        <div>
          <p>Digite el ID de la persona que quieras consultar en la base de datos</p>

          {/* Cuadro de texto con valor controlado por el estado inputValue */}
          <input 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange} 
            placeholder="Ingrese el texto aquí" 
          />

          {/* Mostramos el componente MyButton */}
          <MyButton />
          
          <p>Respuesta del servidor: {displayText}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
