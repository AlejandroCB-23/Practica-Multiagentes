import React, { useState } from 'react';
import './Dashboard.css';
import DatabaseFormAdd from './DatabaseForm-Add';
import DatabaseFormEdit from './DatabaseForm-Edit';
import DatabaseFormGet from './DatabaseForm-Get';
import DatabaseFormDelete from './DatabaseForm-Delete';

function Boton({ texto, onClick, className }) {
    return <button className={`button-dashboard ${className}`} onClick={onClick}>{texto}</button>;
}

function Dashboard() {
    const [showFormAdd, setShowFormAdd] = useState(false);
    const [showFormEdit, setShowFormEdit] = useState(false);
    const [showFormDelete, setShowFormDelete] = useState(false);
    const [showFormGet, setShowFormGet] = useState(false);

    return (
        <div className='wrapped-menu'>  
            <div className='div-dashboard'>
                <header className='header-dashboard'>
                    <h1>Menu Principal</h1>
                </header>
                <div className='left-section'>
                    <Boton texto="Añadir" onClick={() => setShowFormAdd(true)} />
                    <Boton texto="Obtener" onClick={() => setShowFormGet(true)} />
                    <Boton texto="Modificar" onClick={() => setShowFormEdit(true)} />
                    <Boton texto="Eliminar" onClick={() => setShowFormDelete(true)} />
                </div>
                <div className='right-section'>
                    <Boton texto="Akino" onClick={() => (window.location.href = '/akino')} className="button-akino" />
                </div>
                {showFormAdd && <DatabaseFormAdd setShowForm={setShowFormAdd} />}
                {showFormEdit && <DatabaseFormEdit setShowForm={setShowFormEdit} />}
                {showFormDelete && <DatabaseFormDelete setShowForm={setShowFormDelete} />}
                {showFormGet && <DatabaseFormGet setShowForm={setShowFormGet} />}
            </div>
        </div>
    );
}

export default Dashboard;

