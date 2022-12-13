import React from 'react';
import './reset.css'
import './App.scss';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Blog from './features/blog/Blog';
import BlogList from './features/blog/BlogList';
import CreateBlog from './features/blog/CreateBlog';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlogList/>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/create-blog" element={<CreateBlog/>}/>
      </Routes>
  </BrowserRouter>
  );
}

export default App;
