import React, { useEffect, useState } from "react";
import ItemAcordeonArea from "../ItemAcordeonArea/ItemAcordeonArea.jsx";
import store from "../../firebase/firebase.js";


function EdicionCursos({ handlerUpdate, handlerAdd, handlerDelete }) {
  //const [areasObj, setAreasObj] = useState([]);
  const [listaCategorias, setListaCategorias] = useState("");

  useEffect(() => {
    store.collection("categorias").onSnapshot((snap) => {
      const documents = [];
      snap.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setListaCategorias(documents);
    });
  }, []);

  console.log("lista de categorias", listaCategorias)


  return (
    <div className="cur-dip">
      <ItemAcordeonArea
        listaCategorias={listaCategorias[0]}
        handlerUpdate={handlerUpdate}
        handlerAdd={handlerAdd}
        handlerDelete={handlerDelete}
      />
    </div>
  );
}

export default EdicionCursos;
