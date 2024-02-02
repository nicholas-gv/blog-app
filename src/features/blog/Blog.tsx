import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectActiveBlog, blogDelete, blogUpdateBody, blogRename} from './blogSlice';
import Formatter from '../../common/Formatter';
import backIcon from '../../assets/angle-left-solid.svg';
import {useAppDispatch} from '../../app/hooks';
import Popup from '../../common/Popup';
import ContextMenu from '../../common/ContextMenu';
import parse from 'html-react-parser';
import {HTMLReactParserOptions, Element, domToReact} from 'html-react-parser';
import ErrorMessage from '../../common/ErrorMessage';
import infoIcon from '../../assets/info-icon-green.svg';

const Blog = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const activeBlog = useAppSelector(selectActiveBlog);

    // local state for UI only
    const [showEditMode, setShowEditMode] = useState(false);
    const [titleEmpty, setTitleEmpty] = useState(false);
    const [contentEmpty, setContentEmpty] = useState(false);
    const [textareaHeightTitle, setTextareaHeightTitle] = useState('auto'); 
    const [textareaHeightContent, setTextareaHeightContent] = useState('auto'); 
    const newTitleRef = useRef<HTMLTextAreaElement>(null);
    const newContentRef = useRef<HTMLTextAreaElement>(null);
    const deleteBlogRef = useRef<HTMLButtonElement>(null);
    
    const handleDeleteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const id = activeBlog?.id;

        if (typeof id === 'number') {
            dispatch(blogDelete(id));
        }
        navigate('/');
    };

    const handleTextareaChange = (ref: React.RefObject<HTMLTextAreaElement>) => {
        if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        setTextareaHeightTitle(newTitleRef.current ? `${newTitleRef.current.scrollHeight}px` : "auto")
        setTextareaHeightContent(newContentRef.current ? `${newContentRef.current.scrollHeight}px` : "auto")
    }, [showEditMode])

    const handleUpdateSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = activeBlog?.id;


        const title = newTitleRef.current ? newTitleRef.current.value : "";
        const content = newContentRef.current ? newContentRef.current.value : "";

        let updateTitle = false;
        let updateContent = false;
        let isEmpty = false;

        if (title !== activeBlog?.title) {
            if (title.length !== 0) {
                setTitleEmpty(false);
                updateTitle = true;
            } else {
                isEmpty = true;
                setTitleEmpty(true);
            }
        }

        if (content !== activeBlog?.content) {
            if (content.length !== 0) {
                setContentEmpty(false);
                updateContent = true;
            } else {
                isEmpty = true;
                setContentEmpty(true);
            }
        }

        if (!isEmpty && typeof id === 'number') {
            if (updateTitle) {
                dispatch(blogRename({id, title}));
            }
            if (updateContent) {
                dispatch(blogUpdateBody({id, content}));
            }
            setShowEditMode(false);
        }
    };

    const handleCancelEditButtonClick = () => {
        setShowEditMode(false);
        setContentEmpty(false);
        setTitleEmpty(false);
    };

    const parseContent = () => {
        // get HTML markup and parse only the parts that include certain tags
        // but unwanted tags that have text as children will be rendered as normal text

        if (activeBlog?.content) {
            const options: HTMLReactParserOptions = {
                replace: (domNode) => {
                    if (
                        domNode instanceof Element &&
                        domNode.attribs &&
                        domNode.tagName !== 'b' &&
                        domNode.tagName !== 'i' &&
                        domNode.tagName !== 'ins' &&
                        domNode.tagName !== 'code' &&
                        domNode.tagName !== 'del'
                    ) {
                        return <>{domToReact(domNode.children, options)}</>;
                    }
                },
            };
            return parse(activeBlog?.content, options);
        }
    };

    return (
        <div className="column">
            <input
                type="image"
                className="back-icon"
                src={backIcon}
                onClick={() => navigate('/')}
                width="20"
                alt="back-to-the-main-page-icon"></input>

            {showEditMode ? (
                <form
                    className="update-content-form"
                    onSubmit={handleUpdateSubmit}>
                    <textarea
                        ref={newTitleRef}
                        id="new-title"
                        name="new-title"
                        className="edit-title-textarea textarea"
                        style={{height: textareaHeightTitle}}
                        onChange={() => handleTextareaChange(newTitleRef)}
                        defaultValue={activeBlog?.title}></textarea>
                    <p className="blog-date">{activeBlog?.date}</p>

                    <div className="info-container">
                        <img
                            src={infoIcon}
                            width="23"
                            className="info-icon"></img>
                        <p className="hidden-hint">Select text and right click it to format</p>
                    </div>

                    <textarea
                        ref={newContentRef}
                        id="new-content"
                        name="new-content"
                        className="edit-content-textarea textarea"
                        style={{height: textareaHeightContent}}
                        onChange={() => handleTextareaChange(newContentRef)}
                        defaultValue={activeBlog?.content}></textarea>
                        <ContextMenu targetRef={newContentRef}>
                            <Formatter textareaRef={newContentRef}/>
                        </ContextMenu>

                    <div>
                        {titleEmpty && <ErrorMessage>Title is empty</ErrorMessage>}
                        {contentEmpty && <ErrorMessage>Content is empty</ErrorMessage>}
                    </div>

                    <div className="edit-delete-container">
                        <button
                            className="primary-button"
                            type="submit">
                            Update
                        </button>
                        <button
                            className="secondary-button"
                            onClick={handleCancelEditButtonClick}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h1 className="blog-title">{activeBlog?.title}</h1>
                    <p className="blog-date">{activeBlog?.date}</p>
                    <pre className="column-of-text">{parseContent()}</pre>
                    <div className="edit-delete-container">
                        <button
                            className="primary-button"
                            onClick={() => setShowEditMode(!showEditMode)}>
                            Edit
                        </button>
                        <button
                            ref={deleteBlogRef}
                            className="delete-button">
                            Delete
                        </button>
                    </div>
                </>
            )}
            <Popup targetRef={deleteBlogRef}>
                <p>Are you sure you want to delete this blog?</p>
                <button
                    className="primary-button"
                    onClick={handleDeleteButtonClick}>
                    Yes
                </button>
                <button className="secondary-button">No</button>
            </Popup>
        </div>
    );
};

export default Blog;
