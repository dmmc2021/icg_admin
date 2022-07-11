import React, { useEffect, useState } from "react";
import store from "../../firebase/firebase.js";
import Table from "react-bootstrap/Table";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine} from "react-icons/ri";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export const TablaCursos = ({ idarea, handlerUpdate, handlerDelete }) => {
  const [objetoCursos, setObjetoCursos] = useState([]);

  useEffect(() => {
    store.collection("cursos").onSnapshot((snap) => {
      const documents = [];
      snap.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setObjetoCursos(documents);
    });
  }, []);

  const mapeo = objetoCursos.map((cursos) => cursos);
  //eslint-disable-next-line
  const filterByArea = mapeo.filter((curso) => {
    if (curso.idarea === idarea) {
      return true;
    }
  });

  return (
    <div className="accordion-body">
      <div className="tabla-cursos">
        <Table striped bordered hover size="sm" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th scope="col">Curso</th>
              <th className="col-acciones" scope="col" style={{textAlign:"center"}}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filterByArea.map((curso) => (
              <tr>
                <td>{curso.curso}</td>
                <td>
                  <div className="group-btn">
                        <div className="btns-edition">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id={curso.id}>
                                    Editar Información del Curso
                                  </Tooltip>
                                }
                              >
                                <button className="btn-icon">
                                  <GrEdit
                                    className="btn-editar "
                                    size={24}
                                    onClick={(id) => {
                                      handlerUpdate(curso.id);
                                    }}
                                  />
                                </button>
                              </OverlayTrigger>
                            </div>
                            <div className="btns-delete">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id={curso.id}>
                                    Eliminar Curso
                                  </Tooltip>
                                }
                              >
                                <button className="btn-icon">
                                  <RiDeleteBinLine
                                    className="btn-delete"
                                    size={24}
                                    onClick={()=>handlerDelete(curso.id)}
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
      </div>
    </div>
  );
};

export default TablaCursos;
