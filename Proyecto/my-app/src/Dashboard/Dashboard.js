import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import disabledImage from '../assets/prohibition-icon.png'




function Boton({ texto, onClick, className, img, classImage, disabled }) {
    const disabledImg = disabledImage;  // Usar la imagen de deshabilitado importada

    return (
        <button
            className={`button-dashboard ${className} ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            <img
                src={disabled ? disabledImg : img}  // Usar la imagen correcta dependiendo del estado disabled
                className={classImage}
                alt={texto}
            />
            <span className="button-text">{texto}</span> {/* Siempre muestra el texto */}
        </button>
    );
}



function Dashboard() {
    const navigate = useNavigate();

    const [showFormAdd, setShowFormAdd] = useState(false);
    const [showFormEdit, setShowFormEdit] = useState(false);
    const [showFormDelete, setShowFormDelete] = useState(false);
    const [showFormGet, setShowFormGet] = useState(false);
    const [role, setRole] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    useEffect(() => {
        // Obtén el rol del almacenamiento local
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, []);

    const permissions = {
        sigma: { canAdd: true, canEdit: true, canDelete: true, canGet: true },
        mewer: { canAdd: true, canEdit: false, canDelete: false, canGet: true },
        rizzler: { canAdd: false, canEdit: false, canDelete: false, canGet: true },
    };

    const currentPermissions = permissions[role] || {};

    return (
        <div className="wrapped-menu">
            <button 
                className="button-back" 
                onClick={handleLogout}
                >
                Cerrar Sesión
            </button>
            <div className="div-dashboard">
                <header className="header-dashboard">
                    <h1>Menu Principal</h1>
                </header>
                <div className="left-section">
                    <Boton
                        texto="Añadir"
                        onClick={() => setShowFormAdd(true)}
                        img={imageAdd}
                        classImage="image-rest"
                        disabled={!currentPermissions.canAdd}
                    />
                    <Boton
                        texto="Obtener"
                        onClick={() => setShowFormGet(true)}
                        img={imageGet}
                        classImage="image-rest"
                        disabled={!currentPermissions.canGet}
                    />
                    <Boton
                        texto="Modificar"
                        onClick={() => setShowFormEdit(true)}
                        img={imageModify}
                        classImage="image-rest"
                        disabled={!currentPermissions.canEdit}
                    />
                    <Boton
                        texto="Eliminar"
                        onClick={() => setShowFormDelete(true)}
                        img={imageDelete}
                        classImage="image-rest"
                        disabled={!currentPermissions.canDelete}
                    />
                </div>
                <div className="right-section">
                    <Boton
                        texto="Akino"
                        onClick={() => (window.location.href = '/akino')}
                        className="button-akino"
                        img={imageAkino}
                        classImage="button-image"
                        disabled={false} // Akino está habilitado para todos
                    />
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

