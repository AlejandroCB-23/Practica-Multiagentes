import React, { useState } from 'react';
import './Dashboard.css';
import DatabaseFormAdd from './DatabaseForm-Add';
import DatabaseFormEdit from './DatabaseForm-Edit';
import DatabaseFormGet from './DatabaseForm-Get';
import DatabaseFormDelete from './DatabaseForm-Delete';
import imageAkino from '../assets/akino_button.svg';
import imageAdd from '../assets/add-image.png';
import imageDelete from '../assets/delete-image.png';
import imageModify from '../assets/edit-image.png';
import imageGet from '../assets/get-image.png';


function Boton({ texto, onClick, className,img,classImage }) {
    return <button className={`button-dashboard ${className}`} onClick={onClick}>
    <img src={img} className={classImage}></img> {texto}
    </button>;
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
                    <Boton texto="Añadir" onClick={() => setShowFormAdd(true)} img={imageAdd} classImage={'image-rest'} />
                    <Boton texto="Obtener" onClick={() => setShowFormGet(true)} img={imageGet} classImage={'image-rest'} />
                    <Boton texto="Modificar" onClick={() => setShowFormEdit(true)} img={imageModify} classImage={'image-rest'}/>
                    <Boton texto="Eliminar" onClick={() => setShowFormDelete(true)} img={imageDelete} classImage={'image-rest'} />
                </div>
                <div className='right-section'>
                    <Boton texto="Akino" onClick={() => (window.location.href = '/akino')} className="button-akino" img={imageAkino} classImage={'button-image'}/>
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

