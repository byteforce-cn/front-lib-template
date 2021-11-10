import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from '@byteforce/byteforce-lib-template';
const TestPage = (props)=>{
  return (
    <Component>测试页面</Component>
  )
}

ReactDOM.render(
  <TestPage/>
  ,
  document.getElementById('root')
);
