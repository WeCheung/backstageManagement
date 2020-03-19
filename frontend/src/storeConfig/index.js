import {
    createStore
} from "redux";

import Reducers from '../reducers'

const devToolsExtension = window.devToolsExtension?window.devToolsExtension():undefined

export default function (init) {
    const store = createStore(
        Reducers
        ,init
        ,devToolsExtension
    )
    return store
}