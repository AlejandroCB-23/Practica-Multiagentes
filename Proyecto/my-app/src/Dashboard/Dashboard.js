import React from 'react';
import './Dashboard.css';

function Boton({ texto, onClick }) {
    return <button className='button-dashboard' onClick={onClick}>{texto}</button>;
}

function Dashboard() {
    const handleClick = () => {
        alert('¡Botón clicado!');
    };

    return (
        <div className='div-dashboard'>
            <h1> Aki no me drogo</h1>
            <article className='article-dashboard'>
                <Boton texto="Añadir" onClick={handleClick} />
                <Boton texto="Obtener" onClick={handleClick} />
                <Boton texto="Modificar" onClick={handleClick} />
                <Boton texto="Eliminar" onClick={handleClick} />
            </article>
        </div>
    );
}

export default Dashboard;
