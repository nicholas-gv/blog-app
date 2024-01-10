import {blogAdd, selectBlogs, selectStatus} from './blogSlice';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import backIcon from '../../assets/angle-left-solid.svg';
import ErrorMessage from '../../common/ErrorMessage';
import ContextMenu from '../../common/ContextMenu';
import Formatter from '../../common/Formatter';
import infoIcon from '../../assets/info-icon-green.svg';

const CreateBlog = () => {
    const navigate = useNavigate();
    const blogs = useAppSelector(selectBlogs);
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectStatus);

    // local state for UI only
    const [titleEmpty, setTitleEmpty] = useState(false);
    const [contentEmpty, setContentEmpty] = useState(false);
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);

    useEffect(() => {
        if (status === 'loading') {
            navigate('/');
        }
    }, []);

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
    };

    const handleAddSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const blogTitle = titleRef.current ? titleRef.current.value : '';
        const blogContent = contentRef.current ? contentRef.current.value : '';

        blogTitle.length === 0 ? setTitleEmpty(true) : setTitleEmpty(false);
        blogContent.length === 0 ? setContentEmpty(true) : setContentEmpty(false);

        if (blogTitle.length !== 0 && blogContent.length !== 0) {
            const id = calculateUniqueId();
            const [dateStr] = new Date(Date.now()).toISOString().split('T');

            dispatch(blogAdd({id, title: blogTitle, content: blogContent, date: dateStr, status: 'public'}));
            event.target.reset();
            navigate('/');
        }
    };

    const handleTextareaChange = (ref: React.RefObject<HTMLTextAreaElement>) => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setContextMenuPosition([event.clientX, event.clientY]);
        setShowContextMenu(true);
    };

    if (status === 'loading') {
        return <></>;
    }

    return (
        <div className="column">
            <input
                type="image"
                className="back-icon"
                src={backIcon}
                onClick={() => navigate('/')}
                width="20"
                alt="back-to-the-main-page-icon"></input>

            <form
                className="update-content-form"
                onSubmit={handleAddSubmit}>
                <label
                    htmlFor="title"
                    className="large-text create-label">
                    Title:
                </label>
                <textarea
                    ref={titleRef}
                    id="title"
                    name="title"
                    onChange={() => handleTextareaChange(titleRef)}
                    rows={1}
                    className="edit-title-textarea textarea"></textarea>
                <div className="info-container margin-top">
                    <img
                        src={infoIcon}
                        width="23"
                        className="info-icon"></img>
                    <p className="hidden-hint">Select text and right click it to format</p>
                </div>
                <label
                    htmlFor="content"
                    className="large-text">
                    Content:
                </label>
                <textarea
                    ref={contentRef}
                    id="content"
                    name="content"
                    onChange={() => handleTextareaChange(contentRef)}
                    rows={5}
                    className="edit-content-textarea textarea"
                    onContextMenu={handleContextMenu}></textarea>
                <div>
                    {titleEmpty && <ErrorMessage>Title is empty</ErrorMessage>}
                    {contentEmpty && <ErrorMessage>Content is empty</ErrorMessage>}
                </div>
                <div className="edit-delete-container">
                    <button
                        className="primary-button"
                        type="submit">
                        Publish Blog
                    </button>
                </div>
            </form>
            {showContextMenu && (
                <ContextMenu
                    contextMenuPosition={contextMenuPosition}
                    setShowContextMenu={setShowContextMenu}>
                    <Formatter textareaRef={contentRef}/>
                </ContextMenu>
            )}
        </div>
    );
};

export default CreateBlog;
