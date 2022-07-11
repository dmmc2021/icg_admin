import React, { useState, useEffect,useRef } from "react";
import store from "../../firebase/firebase.js";
import EdicionCursos from "../EdicionCursos/EdicionCursos.jsx";
import Modal from "react-bootstrap/Modal";
import SelectArea from "../SelectArea/SelectArea.jsx";

const EdicionCatalogo = () => {
  const [idCatalogo, setIdcatalogo] = useState("");
  const [modoEdicion, setModoEdicion] = useState(null);
  const [idarea, setIdarea] = useState("");
  const [idcurso, setIdcurso] = useState("");
  const [curso, setCurso] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [costo, setCosto] = useState("");
  //eslint-disable-next-line
  const [error, setError] = useState("");
  //eslint-disable-next-line
  const [cursos, setCursos] = useState([]);
  const [show, setShow] = useState(false);
  const itemCategoriaRef= useRef();

  useEffect(() => {
    const getCursos = async () => {
      const { docs } = await store.collection("cursos").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setCursos(nuevoArray);
    };
    getCursos();
  }, []);

  const setAdd = async (e) => {
    e.preventDefault();

    setIdarea(itemCategoriaRef.current.value);
    
    if (!idarea.trim()) {
      setError("campo vacio");
    }
    if (!idcurso.trim()) {
      setError("campo vacio");
    }
    if (!curso.trim()) {
      setError("campo vacio");
    }
    if (!modalidad.trim()) {
      setError("campo vacio");
    }
    if (!costo.trim()) {
      setError("campo vacio");
    }

       const itemCursos = {
      idarea:  itemCategoriaRef.current.value,
      idcurso: idcurso,
      curso: curso,
      modalidad: modalidad,
      costo: costo,
    };

    try {
      //eslint-disable-next-line
      const data = await store.collection("cursos").add(itemCursos);
      const { docs } = await store.collection("cursos").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setCursos(nuevoArray);
      alert("Curso agregado");
    } catch (e) {
      console.log(e);
    }

    setIdarea("");
    setIdcurso("");
    setCurso("");
    setModalidad("");
    setCosto("");

  
  };
  
  //BorrarCursos
   const handlerDelete = async (id) => {
     if(window.confirm("Confirma la eliminación este curso?")){

       try {
         await store.collection("cursos").doc(id).delete();
         const { docs } = await store.collection("cursos").get();
         const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
         setCursos(nuevoArray);
       } catch (e) {
         console.log(e);
       }
     }
  };

  


  //pulsarActualizacion
  const handlerUpdate = async (id) => {
    try {
      const data = await store.collection("cursos").doc(id).get();
      const { idarea, idcurso, curso, modalidad, costo } = data.data();

      setIdarea(idarea);
      setIdcurso(idcurso);
      setCurso(curso);
      setModalidad(modalidad);
      setCosto(costo);
      setIdcatalogo(id);
      setModoEdicion(true);
      setShow(true);
      console.log(id);
    } catch (e) {
      console.log(e);
    }
  };

   const handlerAdd = async () => {
    try {
      
      setIdarea("");
      setIdcurso("");
      setCurso("");
      setModalidad("");
      setCosto("");
      setModoEdicion(false);
      setShow(true);

      
    } catch (e) {
      console.log(e);
    }
  };

  const setUpdate = async (e) => {
    e.preventDefault();

    const cursoUpdate = {
      idarea: idarea,
      idcurso: idcurso,
      curso: curso,
      modalidad: modalidad,
      costo: costo,
    };
    try {
      await store.collection("cursos").doc(idCatalogo).set(cursoUpdate);
      const { docs } = await store.collection("cursos").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setCursos(nuevoArray);
    } catch (e) {
      console.log(e);
    }
    setIdarea("");
    setIdcurso("");
    setCurso("");
    setModalidad("");
    setCosto("");
    setModoEdicion(true);
  };

  


  return (
    <div className="contenedor-editor">
      <EdicionCursos handlerUpdate={handlerUpdate} handlerAdd={handlerAdd} handlerDelete={handlerDelete} />
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
              (<h2>Edicion de Curso</h2>)
              :
              (<h2>Agregar Curso</h2>)
            }
            
              {
                modoEdicion?
                (
                  
            <form className="form-group" onSubmit={setUpdate}>
                  
                 
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={curso}
                    placeholder="Introduce nombre de curso"
                    required
                    onChange={(e) => {
                      setCurso(e.target.value);
                    }}
                  />
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={modalidad}
                    placeholder="Introduce modalidad"
                    required
                    onChange={(e) => {
                      setModalidad(e.target.value);
                    }}
                  />
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={costo}
                    placeholder="Introduce costo"
                    required
                    onChange={(e) => {
                      setCosto(e.target.value);
                    }}
                  />
                 
                    <button type="submit"
                    className="btn btn-dark btn-block mt-4">
                      Guardar
                    </button>
                    </form>
                )
                :
                (
                  /******VALIDAR FORMULARIO CAMPOS VACIOS**** */
                  /*hacer lista desplegable para las categorias******************************/
                  
                  <form className="form-group">
                    <SelectArea itemCategoriaRef={itemCategoriaRef} />
                 
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={curso}
                    placeholder="Introduce nombre de curso"
                    required
                    onChange={(e) => {
                      setCurso(e.target.value);
                    }}
                  />
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={modalidad}
                    placeholder="Introduce modalidad"
                    required
                    onChange={(e) => {
                      setModalidad(e.target.value);
                    }}
                  />
                  <input
                    className="form-control mt-4"
                    type="text"
                    value={costo}
                    placeholder="Introduce costo"
                    required
                    onChange={(e) => {
                      setCosto(e.target.value);
                    }}
                  />
                  <button type="submit"
                className="btn btn-dark btn-block mt-4" onClick={setAdd}>
                  Agregar 
                </button>
                </form> 
                )
              }
                
              
           
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EdicionCatalogo;
