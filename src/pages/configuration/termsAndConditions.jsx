import React, { useState,useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import axios from 'axios';
import { postTermsContent,fetchTermsContent } from '../../data/slices/termsSlice';
import { useDispatch, useSelector } from 'react-redux';

const { Title } = Typography;

function TermsAndConditions() {
    const dispatch=useDispatch()
    const { error, loading, content } = useSelector((state) => state.terms);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());


   useEffect(() => {
    dispatch(fetchTermsContent())
  }, [dispatch]);
  
  useEffect(()=>{
    if(content&& content.content){
     const parsedContent = JSON.parse(content.content);
    const contentState = convertFromRaw(parsedContent);
     setEditorState(EditorState.createWithContent(contentState));
    }
  },[content])



  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const submitConfiguration = async() => {
    const content = convertToRaw(editorState.getCurrentContent());
    if (content.blocks.length > 0 && content.blocks[0].text.trim() !== '') {
        try {
             dispatch(postTermsContent(content))
             message.success('Content saved successfully');
           
         } catch (error) {
           console.error('Error saving content:', error);
           message.error('Error while saving content');
         }
    } 
  };

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          border: '2px solid #FA003F',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#fffbea',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          placeholder="Define your terms of service, user responsibilities, and legal disclaimers..."
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'image'],
          }}
        />
      </div>

      <Button
        style={{ backgroundColor: '#FA003F', borderColor: '#FA003F', color: '#fff' }}
        type="primary"
        block
        onClick={submitConfiguration}
      >
        Update Now
      </Button>
    </div>
  );
}

export default TermsAndConditions;
