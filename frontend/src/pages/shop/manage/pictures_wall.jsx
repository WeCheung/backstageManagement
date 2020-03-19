import React, {Component} from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import {deleteImg} from "../../../api";

class PicturesWall extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    componentDidMount() {
        // 如果是修改页面
        this.handleRenderPreImgs()
    }

    handleRenderPreImgs = () => {
        let fileList = this.props.imgs
        fileList = fileList.map((item, index)=>({
            uid: -index
            , name: item
            , status: 'done'
            , url: `http://localhost:5000/images/${item}`
        }))
        this.setState({ fileList })
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        // console.log(file);
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({ fileList, file }) => {
        // console.log('handleChange执行', fileList, file);
        if( file['status'] === 'done' ){
            message.success('图片上传成功!')
            const {name, url} = file.response
            file.name = name                        // 将该组件状态存储的图片的状态更改为由时间戳命名的名字
            file.url = url                          // 设置该图片的url，此项为必须，如果更改名字后不设置url将不显示图片
            fileList[fileList.length - 1] = file
        } else if( file['status'] === 'removed' ){
            const result = await deleteImg({name: file.name})
            // console.log(result);
            const {status, msg} = result.data
            if( status === 0 ){
                message.success(msg)
            } else{
                message.error(msg)
            }
        }
        this.setState({ fileList })
    };

    getImagesInfo = ()=>{
        return this.state.fileList.map(item=>item.name)
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div>
                <Upload
                    action="/img/upload"
                    listType="picture-card"
                    fileList={fileList}
                    name={'images'}
                    accept={'image/*'}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 6 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;