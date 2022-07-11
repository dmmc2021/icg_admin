import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CrearNoticia from "./components/CrearNoticia/CrearNoticia.jsx";
import Login from "./components/Login/Login.jsx";


function App() {
 
  
 return (
 
    <div className="container">
      
            <Router>
                <Switch>
                  <Route exact path="/" component={Login}></Route>
                  <Route path="/noticiah7723BoC8" component={CrearNoticia}></Route>
                </Switch>
            </Router>
           
    </div>
  );
}

export default App;
