import React, {useState, useEffect} from "react"
import store from "../../firebase/firebase.js";



const SelectArea = ({itemCategoriaRef}) => {


    const [listaCategorias, setListaCategorias] = useState([]);

    useEffect(() => {
      store.collection("categorias").onSnapshot((snap) => {
        const documents = [];
        snap.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        setListaCategorias(documents);
      });
    }, []);
  
    
    const mapaAreasObj = listaCategorias.map((listaCategoria) => {
      return listaCategorias;

    });
   

    
    return (
        <section>

                <label style={{ color: "#000000" }}>Categorias</label>
                    <select aria-label="Default select example" ref={itemCategoriaRef} style={{ width: "100%", height:"50px" }} >
                    
                      {mapaAreasObj[0] &&
                        mapaAreasObj[0].map((identCurso) => {
                    
                    return <option value={identCurso.idarea}>{identCurso.nombre}</option>;
                        })}
                    </select>
        </section>

    )
}

export default SelectArea;

