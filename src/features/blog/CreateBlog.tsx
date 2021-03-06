import {
    blogAdd,
    selectBlogs,
    selectStatus
} from './blogSlice';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import backIcon from '../../assets/angle-left-solid.svg'
import ErrorMessage from '../../common/ErrorMessage';


const CreateBlog = () => {
    const navigate = useNavigate();
    const blogs = useAppSelector(selectBlogs);
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectStatus);

    // local state for UI only
    const [ titleEmpty, setTitleEmpty ] = useState(false);
    const [ contentEmpty, setContentEmpty ] = useState(false);

    useEffect(() => {
        if (status==='loading') { 
            navigate('/') 
        }
    }, [])

    const calculateUniqueId = () => {
        let id = 0;
        let knownIds = [];

        for (let i = 0; i < blogs.length; i++) {
            knownIds.push(blogs[i].id);
        }

        for (let i = 0; i < blogs.length; i++) {
            if (knownIds.includes(id)) {
                id++;
            } else break;
        }

        return id;
    }


    const handleAddSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const blogTitle = (document.getElementById("title") as HTMLInputElement).value;
        const blogContent = (document.getElementById("content") as HTMLInputElement).value;

        (blogTitle.length === 0) ? setTitleEmpty(true) : setTitleEmpty(false);
        (blogContent.length === 0) ? setContentEmpty(true) : setContentEmpty(false);

        if (blogTitle.length!==0 && blogContent.length!==0) {
            const id = calculateUniqueId();
            const [ dateStr ] = new Date(Date.now()).toISOString().split('T');

            dispatch(blogAdd({id, title: blogTitle, content: blogContent, date: dateStr, status: "public"}));
            event.target.reset();
            navigate('/');
        }
    }


    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement;
        target.style.height = 'inherit';
        target.style.height = `${target.scrollHeight}px`; 
        // In case you have a limitation
        // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
    }

    if (status==='loading') {
        return <></>;
    }
    
        
    return (
        <div className='column'>

            <input
                type='image'
                className='back-icon'
                src={backIcon}
                onClick={() => navigate("/")}
                width='20'
                alt='back-to-the-main-page-icon'
            ></input>
            
            <form className='update-content-form' onSubmit={handleAddSubmit}>
                <label htmlFor="title" className='large-text create-label'>Title:</label>
                <textarea 
                    id='title' 
                    name='title' 
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className='edit-title-textarea textarea'>
                </textarea>
                <label htmlFor="content" className='large-text create-label'>Content:</label>
                <textarea
                    id='content' 
                    name='content' 
                    onKeyDown={handleKeyDown}
                    rows={5}
                    className='edit-content-textarea textarea'>
                </textarea>
                <div>
                    {titleEmpty && <ErrorMessage>Title is empty</ErrorMessage>}
                    {contentEmpty && <ErrorMessage>Content is empty</ErrorMessage>}
                </div>
                <div className='edit-delete-container'>
                    <button className='primary-button' type='submit'>Publish Blog</button>    
                </div>
            </form>

        </div>
    );
}
  
export default CreateBlog;
  