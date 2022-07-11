import React, { useState, useEffect, useRef } from "react";
import { Accordion, Table } from "react-bootstrap";
import TablaCursos from "../TablaCursos/TablaCursos.jsx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine} from "react-icons/ri";
import Tooltip from "react-bootstrap/Tooltip";
import { FcPlus } from "react-icons/fc";
import Modal from "react-bootstrap/Modal";
import { auth } from "../../firebase/firebase.js";
import store from "../../firebase/firebase.js";
import { useHistory } from "react-router-dom";
import ilapLogo from "../../img/ilap-logo.png";


export const ItemAcordeonArea = ({ handlerUpdate, handlerAdd, handlerDelete}) => {

  const historial = useHistory();
  const [usuario, setUsuario] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [show, setShow] = useState(false);
  
  const [listaCategorias, setListaCategorias] = useState([]);
  const [idCategoria, setIdCategoria] = useState("");
  const [idarea, setIdarea] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const itemCategoriaRef= useRef();

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

  const volverAdmin = () => {
    historial.push("/adminY0aES8zzD");
  };

  const [userAdmin, setUserAdmin] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((user) =>{
      if (user.email === "admin@institutolap.com"){
        setUserAdmin(true)
      }
    })
  }, []);

  const setAddCategoria = async (e) => {
    e.preventDefault();

    setIdarea(idarea);
    
    if (!idarea.trim()) {
      setError("campo vacio");
    }
    if (!nombre.trim()) {
      setError("campo vacio");
    }
       const itemNuevaCategoria = {
      idarea:  idarea,
      nombre: nombre,
    };

    try {
      //eslint-disable-next-line
      const data = await store.collection("categorias").add(itemNuevaCategoria);
      const { docs } = await store.collection("categorias").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setListaCategorias(nuevoArray);
      //alert("Categoria agregada");
    } catch (e) {
      console.log(e);
    }

    setIdarea("");
    setNombre("");
    };
  

  const getCategorias =()=>{
    store.collection("categorias").onSnapshot((querySnapshot)=>{
     const docs = []
      querySnapshot.forEach(doc=>{
       
        docs.push ({...doc.data(), id:doc.id});
        
        console.log(docs)
    });
    setListaCategorias(docs)
     })
    }

 const handlerAddCategoria = async () => {
  try {
    
    setIdarea("");
    setNombre("");
    setModoEdicion(false);
    setShow(true);

    
  } catch (e) {
    console.log(error);
  }
};

 useEffect(()=>{
   getCategorias();
 },[]);

 const handlerUpdateCategoria = async(id)=>{
  try{
    const data= await store.collection("categorias").doc(id).get();
    const { idarea, nombre } = data.data();
    
    setIdarea(idarea);
    setNombre(nombre);
    setIdCategoria(id);
    setModoEdicion(true);
    setShow(true);
 
  }catch(e){
    console.log(e)
  }
}

const setUpdateCategoria = async (e) => {
  e.preventDefault();
  const categoriaUpdate = {

    idarea: idarea,
    nombre: nombre,
  };
  try {
    await store.collection("categorias").doc(idCategoria).set(categoriaUpdate);
    const { docs } = await store.collection("categorias").get();
    const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
    setListaCategorias(nuevoArray);
  } catch (e) {
    console.log(e);
  }
  setIdarea("");
  setNombre("");
  setIdCategoria("");
  //setModoEdicion(false);
};

const handlerDeleteCategoria = async(id)=>{
  if(window.confirm("Confirma la eliminación de esta Categoria?")){
    try{
      await store.collection("categorias").doc(id).delete();
      const { docs } = await store.collection("categorias").get();
      const nuevoArray = docs.map((item)=>({id:item.id, ...item.data()}));
      setListaCategorias(nuevoArray);
    }catch(e){
      console.log(e)
    }
  }
}

const viewCategorias =()=>{
  document.getElementById("viewsCategorias").style.display="block"
}

const closeCategorias =()=>{
  document.getElementById("viewsCategorias").style.display="none"
}

const viewCursos =()=>{
  document.getElementById("viewsCursos").style.display="block"
}

const closeCursos =()=>{
  document.getElementById("viewsCursos").style.display="none"
}
  
  return (
    <div className="contenedor-cursos" id="cursos-id">
     
     <div class="container-nav">
      <img className="ilapLogo" src={ilapLogo} alt="logo-ilap" />
    
    <ul>
     <li>
      {userAdmin ? (
            <a href="/adminY0aES8zzD" onClick={volverAdmin}>
            Regresar a Admin
          </a>
           ) : (
            <span style={{color:"transparent"}}>contenido para hacer espacio</span>
        )}
      </li>
      <li>
      {usuario ? (
        
        //eslint-disable-next-line
        <a href="https://cdn1.institutolap.com">Actualizar PDF</a>
        ) : (
          <span></span>
        )}
      </li>
      <li>
      {usuario ? (
        
        //eslint-disable-next-line
        <a href="javascript:void(0)" onClick={CerrarSesion} style={{fontWeight:"bold"}}>Cerrar sesion</a>
        ) : (
          <span></span>
        )}
      </li>
      </ul>
  </div>
  <hr />
  <div className="img-admin">
    <ul>
      <li>
        <a href="javascrpt:void(0);" onClick={viewCategorias}><h1>Edición de Categorias</h1></a>
      </li>
    </ul>
  </div>

  
          <div className="viewsCategorias" id="viewsCategorias">

     <div className="btns-edition" style={{ marginBottom:"25px"}}>
                    <OverlayTrigger
                      overlay={
                        <Tooltip >
                          Agregar Categoria
                        </Tooltip>
                      }
                    >
                      <button className="btn-icon" >
                        <FcPlus
                          className="btn-agregar "
                          size={35}
                          onClick={() => {
                            handlerAddCategoria();
                          }}
                          
                        />
                      </button>
                    </OverlayTrigger>
                  </div>

<Accordion flush style={{marginLeft:"auto", marginRight:"auto", marginBottom:"50px"}}>
  <Accordion.Item eventKey="0">
    <Accordion.Header>Categorias</Accordion.Header>
        <Accordion.Body>
             <Table striped bordered hover size="sm" style={{ width: "100%" }}>
        
        <thead>
           <tr>
             <th scope="col">Codigo</th>
             <th scope="col">Nombre de la Categoria</th>
             <th className="col-acciones" scope="col" style={{textAlign:"center"}}>
               Acciones
             </th>
           </tr>
         </thead>
        
         <tbody>
           {listaCategorias.map((categoria)=>(

           <tr>
             <td >{categoria.idarea}</td>
             <td >{categoria.nombre}</td>
             <td>
                 <div className="group-btn">
                 <div className="btns-edition">
                             <OverlayTrigger
                               overlay={
                                 <Tooltip id={categoria.id}>
                                   Editar Categoria
                                 </Tooltip>
                               }
                             >
                               <button className="btn-icon">
                                 <GrEdit
                                   className="btn-editar "
                                   size={24}
                                   onClick={(id) => {
                                     handlerUpdateCategoria(categoria.id);
                                   }}

                                 />
                               </button>
                             </OverlayTrigger>
                           </div>
                           <div className="btns-delete">
                             <OverlayTrigger
                               overlay={
                                 <Tooltip id={categoria.id}>
                                   Eliminar Categoria
                                 </Tooltip>
                               }
                             >
                               <button className="btn-icon">
                                 <RiDeleteBinLine
                                   className="btn-delete"
                                   size={24}
                                   onClick={()=>handlerDeleteCategoria(categoria.id)}
                                 />
                               </button>
                             </OverlayTrigger>
                           </div>
      
                       </div>
                     </td>
                   </tr>
                 
           ))}
               </tbody>
             </Table>
          </Accordion.Body>
     </Accordion.Item>
    </Accordion>
    
    <div className="retorno-creacion">
         <a href="javascript:void(0);" onClick={closeCategorias}>Cerrar Edicion de Categorias</a>
    </div>
  </div>
  
    
  <div className="img-admin">
    <ul>
      <li>
        <a href="javascript:void(0);" onClick={viewCursos}><h1>Edición de Cursos</h1></a>
      </li>
    </ul>
  </div>

    
  <div className="viewsCursos" id="viewsCursos">

      <div className="sub-head">
        <div className="btns-edition" style={{ marginBottom:"25px"}}>
                    <OverlayTrigger
                      overlay={
                        <Tooltip >
                          Agregar Nuevo Curso
                        </Tooltip>
                      }
                    >
                      <button className="btn-icon" >
                        <FcPlus
                          className="btn-agregar "
                          size={35}
                          onClick={() => {
                            handlerAdd();
                          }}
                          
                        />
                      </button>
                    </OverlayTrigger>
                  </div>
      </div>
      <Accordion flush style={{marginLeft:"auto", marginRight:"auto", marginBottom:"50px"}}>
        {listaCategorias &&
          listaCategorias.map((a, i) => {
            return (
              <Accordion.Item eventKey={i}>
                <Accordion.Header>{a.nombre}</Accordion.Header>
                <Accordion.Body>
                  <TablaCursos
                    idarea={a.idarea}
                    handlerUpdate={handlerUpdate}
                    handlerDelete={handlerDelete}
                  />
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
      </Accordion>
      <div className="retorno-creacion">
         <a href="javascript:void(0);" onClick={closeCursos}>Cerrar Edicion de Cursos</a>
    </div>
  </div>

    <div className="contenedor-editor">
      
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        style={{ maxWidth: "none" }}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="edicion-curso">
            {
              modoEdicion?
              (<h2>Edicion de Categoria</h2>)
              :
              (<h2>Agregar Categoria</h2>)
            }
            
              {
                modoEdicion?
                (
                  
            <form className="form-group" onSubmit={setUpdateCategoria}>
                  
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={nombre}
                    placeholder="Categoria actualizada"
                    required
                    onChange={(e) => {
                      setNombre(e.target.value);
                    }}
                  />
                   <button type="submit"
                    className="btn btn-dark btn-block mt-4">
                      Actualizar
                    </button>
                    </form>
                )
                :
                (
                  /******VALIDAR FORMULARIO CAMPOS VACIOS**** */
                  /*hacer lista desplegable para las categorias******************************/
                  
                  <form className="form-group">
                   
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={idarea}
                    placeholder="Introduce el codigo de la  Categoria"
                    required
                    onChange={(e) => {
                      setIdarea(e.target.value);
                    }}
                  />
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={nombre}
                    placeholder="Introduce el nombre de la Categoria"
                    required
                    onChange={(e) => {
                      setNombre(e.target.value);
                    }}
                  />
                  <button type="submit"
                  className="btn btn-dark btn-block mt-4" onClick={setAddCategoria}>
                  Agregar 
                  </button>
                  </form> 
                )
              }
                
              
           
          </div>
        </Modal.Body>
      </Modal>
    </div>
    </div>
    
  );
};

export default ItemAcordeonArea;
