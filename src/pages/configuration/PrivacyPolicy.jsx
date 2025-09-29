import React, { useState,useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { useDispatch, useSelector } from 'react-redux';
import { postPrivacyPolicy,fetchPrivacyPolicy } from '../../data/slices/privacyPolicySlice'

const { Title } = Typography;

function PrivacyPolicy() {
  const dispatch=useDispatch()
  const { error, loading, content } = useSelector((state) => state.privacyPolicy);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
 useEffect(() => {
  dispatch(fetchPrivacyPolicy())
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
      if (content.blocks.length === 0 || content.blocks[0].text.trim() === '') {
          return message.warning('Please fill out the content before submitting.');
        }
      try {
            dispatch(postPrivacyPolicy(content))
            message.success('Content saved successfully');
          
        } catch (error) {
          console.error('Error saving content:', error);
          message.error('Error while saving content');
        }
   
  };

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          border: '2px solid #FA003F',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#fffbea',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          placeholder="Write your privacy policy here..."
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

export default PrivacyPolicy;
