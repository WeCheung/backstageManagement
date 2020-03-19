import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import ConfigStore from './storeConfig'
import {compose, applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import App from './App';

import './index.css';
const init = compose(applyMiddleware(thunk))
const store = ConfigStore(init)


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

