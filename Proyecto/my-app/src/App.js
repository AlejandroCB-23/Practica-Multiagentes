import './App.css';

function Boton({ texto, onClick }) {
  return (
    <button onClick={onClick}>
      {texto}
    </button>
  );
}

function App() {
  const handleClick = () => {
    alert('¡Botón clicado!');
  };

  return (
    <div>
      <h1>¡Hola, React!</h1>
      <article>
      <Boton texto="Añadir" onClick={handleClick} />
      <Boton texto="Obtener" onClick={handleClick} />
      <Boton texto="Modificar" onClick={handleClick} />
      <Boton texto="Eliminar" onClick={handleClick} />
      
      </article>
    </div>
  );
}

export default App;
