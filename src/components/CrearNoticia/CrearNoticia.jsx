import React, { useEffect, useRef, useState } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine} from "react-icons/ri";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import store from "../../firebase/firebase.js";
import Modal from "react-bootstrap/Modal";
import SunEditor from "suneditor-react";
import { Accordion, Table } from "react-bootstrap";
import { GoInfo } from "react-icons/go";
import { auth } from "../../firebase/firebase.js";
import { useHistory } from "react-router-dom";
import "suneditor/dist/css/suneditor.min.css";
import ilapLogo from "../../img/ilap-logo.png";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";



const CrearNoticia = () => {
  const fecha = new Date().toLocaleDateString();
  const fechaRef = useRef();
  const tituloRef = useRef();
  const autorRef = useRef();
  const imagenRef = useRef();
  const parrafosRef = useRef();
  const editor = useRef();
  //const contenidoRef = useRef(); 

  const [send, setSend] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [tipoAlert, setTipoAlert] = useState("");
  const [message, setMessage] = useState("");
  const [modoEdicion, setModoEdicion] = useState(null);

  const [noticias, setNoticias]= useState([]);
  const [listarNoticias, setListarNoticias] = useState([]);
  const [idNoticia, setIdNoticia] = useState([]);
  const [fechaAct, setFechaAct] = useState(fechaRef)
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [autor, setAutor] = useState("");
  const [image, setImage] = useState("")

  const [contents, setContents]= useState("")

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
 };
  
  const handleEditorChange = (content) => {
    parrafosRef.current.value = ''.concat(content).concat('');
  };

  const handleClean = () => {
    tituloRef.current.value = "";
    parrafosRef.current.value = "";
    autorRef.current.value = "";
    imagenRef.current.value = "";
    editor.current.setContents("");
  };

  useEffect(() => {
    if (send === false) return;
    store
      .collection("noticia")
      .doc()
      .set({
        titulo: tituloRef.current.value,
        fecha: fechaRef.current.defaultValue,
        contenido: parrafosRef.current.value,
        autor: autorRef.current.value,
        image: imagenRef.current.value,
      })
      .then(() => {
        setTipoAlert("info");
        setMessage("Se guardó la data del formulario exitosamente.");
      })
      .catch((error) => {
        setTipoAlert("error");
        setMessage('La operacion "Guardar" no tuvo Exito.');
      });
    setShow2(true);
    handleClean();

    return  setSend(false);
  }, [send]);

  const [usuario, setUsuario] = useState(null);
  const historial = useHistory();

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


  const handlerUpdateNoticia = async(id)=>{
    try{
      const data= await store.collection("noticia").doc(id).get();
      const { fechaAct, titulo, contenido, autor, image } = data.data();
      
      setIdNoticia(id);
      setFechaAct(fechaRef);
      setTitulo(titulo);
      setContenido(contenido);
      setAutor(autor);
      setImage(image);
      setShow(true);
      
    }catch(e){
      console.log(e)
    }
  }


  const handlerDeleteNoticia = async(id)=>{
    if(window.confirm("Confirma la eliminación de esta noticia?")){
      try{
        await store.collection("noticia").doc(id).delete();
        const { docs } = await store.collection("noticia").get();
        const nuevoArray = docs.map((item)=>({id:item.id, ...item.data()}));
        setListarNoticias(nuevoArray);
      }catch(e){
        console.log(e)
      }
    }
  }
  


  const getNoticias =()=>{
     store.collection("noticia").onSnapshot((querySnapshot)=>{
      const docs = []
       querySnapshot.forEach(doc=>{
        
         docs.push ({...doc.data(), id:doc.id});
         //console.log(docs)
     });
     setListarNoticias(docs)
      })
     
  }

  useEffect(()=>{
    getNoticias();
  },[])


  const setUpdateNoticia = async (e) => {
    e.preventDefault();

    const noticiaUpdate = {
      
      fecha: fecha,
      titulo: titulo,
      contenido: contenido,
      autor: autor,
      image: image
    };
    try {
      await store.collection("noticia").doc(idNoticia).set(noticiaUpdate);
      const { docs } = await store.collection("noticia").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setNoticias(nuevoArray);
    } catch (e) {
      console.log(e);
    }
    
    setFechaAct("");
    setTitulo("");
    setContenido("");
    setAutor("");
    setImage("");
    setModoEdicion(false);
    setShow(false);
    
  };

  const handlerChange = (contenido) => {
    setContenido(contenido);
    console.log(contenido);
    
  };

  const viewCreacion =()=>{
    //document.getElementById("creacionNews").style.display="block";
    setShow2(true);
  }

  const viewEdicion =()=>{
    document.getElementById("edicionNews").style.display="block"
  }

  /*const closeCreacion =()=>{
    document.getElementById("creacionNews").style.display="none";
  }*/

  const closeEdicion =()=>{
    document.getElementById("edicionNews").style.display="none"
  }
 
  return (
  
    <body className="creacionN" style={{background:"#cccdd3"}}>
     <div class="container-nav">
    <img className="ilapLogo" src={ilapLogo} alt="logo-ilap"/>
    
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
      <a href="javascript:void(0);" onClick={viewCreacion}><h1>Creación de Noticias</h1></a>
    </li>
    <li>
      <a href="javascript:void(0);" onClick={viewEdicion}><h1>Edición de Noticias</h1></a>
    </li>
  </ul>

  </div>  
     <div className="edicionNews" id="edicionNews">

  <Accordion flush style={{marginLeft:"auto", marginRight:"auto", marginBottom:"50px"}}>
  <Accordion.Item eventKey="0">
    <Accordion.Header>Noticias publicadas</Accordion.Header>
        <Accordion.Body>
             <Table striped bordered hover size="sm" style={{ width: "100%" }}>
        
             <thead>
              <tr>
              <th scope="col">Titulo de la Noticia</th>
              <th className="col-acciones" scope="col" style={{textAlign:"center"}}>
                Acciones
              </th>
            </tr>
          </thead>
        
         <tbody>
         {listarNoticias.map((noticia) =>(

           <tr>
             <td >{noticia.titulo}</td>
             
             <td>
                 <div className="group-btn">
                 <div className="btns-edition">
                             <OverlayTrigger
                               overlay={
                                 <Tooltip id={noticia.id}>
                                   Editar Noticia
                                 </Tooltip>
                               }
                             >
                               <button className="btn-icon">
                                 <GrEdit
                                   className="btn-editar "
                                   size={24}
                                   onClick={(id) => {
                                    handlerUpdateNoticia(noticia.id);
                                  }}

                                 />
                               </button>
                             </OverlayTrigger>
                           </div>
                           <div className="btns-delete">
                             <OverlayTrigger
                               overlay={
                                 <Tooltip id={noticia.id}>
                                   Eliminar Noticia
                                 </Tooltip>
                               }
                             >
                               <button className="btn-icon">
                                 <RiDeleteBinLine
                                   className="btn-delete"
                                   size={24}
                                   onClick={()=>handlerDeleteNoticia(noticia.id)}
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
         <a href="javascript:void(0);" onClick={closeEdicion}>Cerrar Edicion de Noticia</a>
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
          <Modal.Title id="example-custom-modal-styling-title">Edición de Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="contenedorN" id="edicionNews2">
       
       <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
         
         <Form>
           <Form.Group className="mb-3" controlId="formGroupFecha">
             <Form.Label style={{ color: "#000000" , fontWeight:"bold", paddingTop:"50px"}}>Fecha</Form.Label>
             <Form.Control
               type="text"
               readOnly
               //defaultValue={fecha}
               ref={fechaRef}
               value={fecha}
               onChange={(e)=>{setFechaAct(e.target.value)}}
             />
           </Form.Group>
           <Form.Group className="mb-3" controlId="formGroupTitulo">
             <Form.Label style={{ color: "#000000", fontWeight:"bold"}}>Titulo</Form.Label>
             <Form.Control
               type="text"
               value={titulo}
               onChange={(e)=>{setTitulo(e.target.value)}}
               ref={tituloRef}
               style={{ width: "100%" }}
             />
           </Form.Group>
           <Form.Group className="mb-3" controlId="formGroupContenido">
             <Form.Label style={{ color: "#000000", fontWeight:"bold"}}>Contenido </Form.Label>
             <Form.Control type="hidden" ref={parrafosRef} 
              />
             <SunEditor
               setContents={contenido}
               showToolbar={true}
               ref={parrafosRef}
               onChange={handlerChange}
               minHeight="160px !important"
               height="250px"
               disable="false"
               getSunEditorInstance={getSunEditorInstance}
             
               setOptions={{
                 buttonList: [
                   ["undo", "redo"],
                   [
                     "bold",
                     "underline",
                     "italic",
                     "strike",
                     "list",
                     "align",
                     "fontSize",
                     "formatBlock",
                   ],
                 ],
               }}
             />
           </Form.Group>
           <Form.Group className="mb-3" controlId="formGroupAutor">
             <Form.Label style={{ color: "#000000", fontWeight:"bold" }}>Autor</Form.Label>
             <Form.Control
               type="text"
               value={autor}
               onChange={(e)=>{setAutor(e.target.value)}}
               ref={autorRef}
               style={{ width: "100%" }}
             />
           </Form.Group>
           <Form.Group className="mb-3" controlId="formGroupImagen">
             <Form.Label style={{ color: "#000000", fontWeight:"bold" }}>
               URL de Imagen
             </Form.Label>
             <Form.Control
               type="text"
               value={image}
               onChange={(e)=>{setImage(e.target.value)}}
               ref={imagenRef}
               style={{ width: "100%" }}
             />
           </Form.Group>
        </Form>
         
         <div className="btn-not" style={{ marginTop:"50px", paddingBottom:"50px"}}>
         <Button
             variant="primary"
             style={{ background: "#2c303b" }}
             onClick={(id) =>{setUpdateNoticia(id)}}
             //onSubmit={setUpdateNoticia}
           >
             Guardar Cambios
           </Button>
          
          </div>
       </div>
     
     </div>
                   
        </Modal.Body>
      </Modal>
    </div>

    
    <div className="contenedor-editor">
      
      <Modal
        show={show2}
        onHide={() => setShow2(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        style={{ maxWidth: "none" }}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">Creacion de Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="contenedorN" id="creacionNews">
       
        <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
           <Form>
            <Form.Group className="mb-3" controlId="formGroupFecha">
              <Form.Label style={{ color: "#000000" , fontWeight:"bold", paddingTop:"50px"}}>Fecha</Form.Label>
              <Form.Control
                type="text"
                readOnly
                defaultValue={fecha}
                ref={fechaRef}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTitulo">
              <Form.Label style={{ color: "#000000", fontWeight:"bold"}}>Titulo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese Titulo"
                ref={tituloRef}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupContenido">
              <Form.Label style={{ color: "#000000", fontWeight:"bold"}}>Contenido </Form.Label>
              <Form.Control type="hidden" ref={parrafosRef} />
              <SunEditor
                setContents=""
                showToolbar={true}
                //ref={parrafosRef}
                placeholder="Ingrese contenido..."
                minHeight="160px !important"
                height="250px"
                onChange={handleEditorChange}
                getSunEditorInstance={getSunEditorInstance}
                //setDefaultStyle="height: auto"
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "list",
                      "align",
                      "fontSize",
                      "formatBlock",
                    ],
                  ],
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupAutor">
              <Form.Label style={{ color: "#000000", fontWeight:"bold" }}>Autor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese nombre del Autor"
                ref={autorRef}
                style={{ width: "100%" }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupImagen">
              <Form.Label style={{ color: "#000000", fontWeight:"bold" }}>
                URL de Imagen
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Direccion de imagen, ejemplo: http://path/nombre-imagen.png"
                ref={imagenRef}
                style={{ width: "100%" }}
              />
            </Form.Group>
         </Form>
          
          <div className="btn-not" style={{ marginTop:"50px", paddingBottom:"50px"}}>
            <Button
              variant="primary"
              style={{ background: "#2c303b" }}
              onClick={() => setSend(true)}
            >
              Crear Noticia
            </Button>
           </div>
        </div>
      </div>
        </Modal.Body>
      </Modal>
    </div>
      
    
      
    </body>
            );
          };
      export default CrearNoticia;