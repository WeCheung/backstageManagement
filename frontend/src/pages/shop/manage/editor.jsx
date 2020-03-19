import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    const html = this.props.details;
    if (Boolean(html)) {
      const contentBlock = htmlToDraft(html); // 这个
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);

      this.state = {
        editorState,
      };
    } else{
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  getEditorContent = ()=>draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          editorStyle={{border: '1px solid rgb(241,241,241)', height: 200, padding:10}}
        />
        {/*<textarea*/}
        {/*  disabled*/}
        {/*  value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}*/}
        {/*/>*/}
      </div>
    );
  }
}
export default EditorConvertToHTML