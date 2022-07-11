import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EdicionCatalogo from "./components/EdicionCatalogo/EdicionCatalogo.jsx";
import CrearNoticia from "./components/CrearNoticia/CrearNoticia.jsx";
import Login from "./components/Login/Login.jsx";
import Admin from "./components/Admin/Admin.jsx";


function App() {
 
  
 return (
 
    <div className="container">
      
            <Router>
                <Switch>
                  <Route exact path="/" component={Login}></Route>
                  <Route path="/adminY0aES8zzD" component={Admin}></Route>
                  <Route path="/catalogo7asf2XbP" component={EdicionCatalogo}></Route>
                  <Route path="/noticiah7723BoC8" component={CrearNoticia}></Route>
                </Switch>
            </Router>
           
    </div>
  );
}

export default App;
