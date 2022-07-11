import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase/firebase.js";
import Admin from "../Admin/Admin.jsx";
import App from "../../App.js";

const MenuAdm = () => {
  const historial = useHistory();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuario(user.email);
      }
    });
  }, []);

  const CerrarSesion = () => {
    auth.signOut();
    setUsuario(null);
    historial.push("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Admin CerrarSesion={CerrarSesion}/>
            <App CerrarSesion={CerrarSesion}/>
            
          </li>
        </ul>
        {usuario ? (
          <button className="btn btn-danger" style={{marginLeft:"1100px", marginTop:"50px"}} onClick={CerrarSesion}>
            Cerrar sesion
          </button>
        ) : (
          <span></span>
        )}
      </nav>
    </div>
  );
};

export default MenuAdm;
