import React, {Component} from 'react';
import { Button } from 'antd'

import './index.scss'
class MyButton extends Component {

    render() {
        return (
            <Button
                {...this.props}
                className={'my-button'}
                style={this.props.style}
                ghost
            />
        );
    }
}

export default MyButton;