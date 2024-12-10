import React, { useState } from 'react';
import './Dashboard.css';
import DatabaseFormAdd from './DatabaseForm-Add';
import DatabaseFormEdit from './DatabaseForm-Edit';
import DatabaseFormGet from './DatabaseForm-Get';
import DatabaseFormDelete from './DatabaseForm-Delete';



function Boton({ texto, onClick }) {
    return <button className='button-dashboard' onClick={onClick}>{texto}</button>;
}

function Dashboard() {
    const [showFormAdd, setShowFormAdd] = useState(false);
    const [showFormEdit, setShowFormEdit] = useState(false);
    const [showFormDelete, setShowFormDelete] = useState(false);
    const [showFormGet, setShowFormGet] = useState(false);


    return (
        <div className='div-dashboard'>
            <h1> Aki no me drogo</h1>
            <article className='article-dashboard'>
                <Boton texto="Añadir" onClick={ () => setShowFormAdd(true) } />
                <Boton texto="Obtener" onClick={()=> setShowFormGet(true)} />
                <Boton texto="Modificar" onClick={()=> setShowFormEdit(true)} />
                <Boton texto="Eliminar" onClick={()=> setShowFormDelete(true)} />
            </article>
            <article className='article-akinomedrogo'>
                <Boton texto="Akino" onClick={()=> window.location.href = '/akino'} />
            </article>
            {showFormAdd && <DatabaseFormAdd setShowForm={setShowFormAdd} />}
            {showFormEdit && <DatabaseFormEdit setShowForm={setShowFormEdit} />}
            {showFormDelete && <DatabaseFormDelete setShowForm={setShowFormDelete} />}
            {showFormGet && <DatabaseFormGet setShowForm={setShowFormGet} />}
        </div>
    );
}

export default Dashboard;
