import React, { useState } from 'react';
import './Dashboard.css';
import DatabaseForm_Add from './DatabaseForm-Add';
import DatabaseForm_Edit from './DatabaseForm-Edit';
import DatabaseForm_Get from './DatabaseForm-Get';
import DatabaseForm_Delete from './DatabaseForm-Delete';



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
            {showFormAdd && <DatabaseForm_Add setShowForm={setShowFormAdd} />}
            {showFormEdit && <DatabaseForm_Edit setShowForm={setShowFormEdit} />}
            {showFormDelete && <DatabaseForm_Delete setShowForm={setShowFormDelete} />}
            {showFormGet && <DatabaseForm_Get setShowForm={setShowFormGet} />}
        </div>
    );
}

export default Dashboard;
