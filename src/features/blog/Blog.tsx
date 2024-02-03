import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectActiveBlog, blogDelete, blogUpdateBody, blogRename} from './blogSlice';
import Formatter from '../../common/Formatter';
import backIcon from '../../assets/angle-left-solid.svg';
import {useAppDispatch} from '../../app/hooks';
import Popup from '../../common/Popup';
import ContextMenu from '../../common/ContextMenu';
import ErrorMessage from '../../common/ErrorMessage';
import infoIcon from '../../assets/info-icon-green.svg';
import {parseHTML} from './parseHTML';

const Blog = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const activeBlog = useAppSelector(selectActiveBlog);

    // local state for UI only
    const [showEditMode, setShowEditMode] = useState(false);
    const [titleEmpty, setTitleEmpty] = useState(false);
    const [bodyEmpty, SetBodyEmpty] = useState(false);
    const [textareaHeightTitle, setTextareaHeightTitle] = useState('auto');
    const [textareaHeightBody, setTextareaHeightBody] = useState('auto');
    const newTitleRef = useRef<HTMLTextAreaElement>(null);
    const newBodyRef = useRef<HTMLTextAreaElement>(null);
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
        setTextareaHeightTitle(newTitleRef.current ? `${newTitleRef.current.scrollHeight}px` : 'auto');
        setTextareaHeightBody(newBodyRef.current ? `${newBodyRef.current.scrollHeight}px` : 'auto');
    }, [showEditMode]);

    const handleUpdateSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = activeBlog?.id;

        const title = newTitleRef.current ? newTitleRef.current.value : '';
        const body = newBodyRef.current ? newBodyRef.current.value : '';

        let updateTitle = false;
        let updateBody = false;
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

        if (body !== activeBlog?.body) {
            if (body.length !== 0) {
                SetBodyEmpty(false);
                updateBody = true;
            } else {
                isEmpty = true;
                SetBodyEmpty(true);
            }
        }

        if (!isEmpty && typeof id === 'number') {
            if (updateTitle) {
                dispatch(blogRename({id, title}));
            }
            if (updateBody) {
                dispatch(blogUpdateBody({id, body}));
            }
            setShowEditMode(false);
        }
    };

    const handleCancelEditButtonClick = () => {
        setShowEditMode(false);
        SetBodyEmpty(false);
        setTitleEmpty(false);
    };

    // get HTML markup and parse only the parts that include certain tags
    // unwanted tags will be rendered as normal text
    const parseBlogBody = () => {
        if (activeBlog?.body) {
            return parseHTML(activeBlog.body);
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
                    className="update-body-form"
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
                        ref={newBodyRef}
                        id="new-body"
                        name="new-body"
                        className="edit-body-textarea textarea"
                        style={{height: textareaHeightBody}}
                        onChange={() => handleTextareaChange(newBodyRef)}
                        defaultValue={activeBlog?.body}></textarea>
                    <ContextMenu targetRef={newBodyRef}>
                        <Formatter textareaRef={newBodyRef} />
                    </ContextMenu>

                    <div>
                        {titleEmpty && <ErrorMessage>Title is empty</ErrorMessage>}
                        {bodyEmpty && <ErrorMessage>Body is empty</ErrorMessage>}
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
                    <pre className="column-of-text">{parseBlogBody()}</pre>
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
