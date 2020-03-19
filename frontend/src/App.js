import React, {Component} from 'react';
import {
    BrowserRouter as Router
    , Switch
    , Route
    , Redirect
} from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/admin";

class App extends Component {

    render(){
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path={'/login'} component={Login} />
                        <Route path={'/admin'} component={Admin} />
                        <Redirect to={'/login'}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;

