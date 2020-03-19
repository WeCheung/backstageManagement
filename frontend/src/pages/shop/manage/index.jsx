import React, {Component, Fragment} from 'react';
import {
    Switch
    , Route
} from 'react-router-dom'

import './index.scss'
import ItemManager from "./item_manager";
import AddItem from "./addItem";
import Details from "./details";
class Manage extends Component {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path={'/admin/manage'} exact component={ItemManager} />
                    <Route path={'/admin/manage/addItem'} component={AddItem} />
                    <Route path={'/admin/manage/details'} component={Details} />
                </Switch>
            </Fragment>
        );
    }
}

export default Manage;