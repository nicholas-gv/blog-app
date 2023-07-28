import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectActiveBlog, blogDelete, blogUpdateBody, blogRename} from './blogSlice';
import {formatText} from './formattingText';
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
    const [showPopup, setShowPopup] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
    const [titleEmpty, setTitleEmpty] = useState(false);
    const [contentEmpty, setContentEmpty] = useState(false);

    const handleDeleteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const id = activeBlog?.id;

        if (typeof id === 'number') {
            dispatch(blogDelete(id));
        }
        navigate('/');
    };

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement;
        target.style.height = 'inherit';
        target.style.height = `${target.scrollHeight}px`;
    };

    const handleUpdateSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = activeBlog?.id;
        const title = (document.getElementById('new-title') as HTMLInputElement).value;
        const content = (document.getElementById('new-content') as HTMLInputElement).value;

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

    const handleContextMenu = (event: React.MouseEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setContextMenuPosition([event.clientX, event.clientY]);
        setShowContextMenu(true);
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
                        domNode.tagName !== 'br' &&
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
                        id="new-title"
                        name="new-title"
                        className="edit-title-textarea textarea"
                        rows={activeBlog ? activeBlog?.title.length / 20 : 1}
                        onChange={handleTextareaChange}
                        defaultValue={activeBlog?.title}></textarea>
                    <p className="blog-date">{activeBlog?.date}</p>

                    <div className="info-container">
                        <img
                            src={infoIcon}
                            width="23"
                            className="info-icon"></img>
                        <p className="hidden-hint">Select text and right click to format text</p>
                    </div>

                    <textarea
                        id="new-content"
                        name="new-content"
                        className="edit-content-textarea textarea"
                        rows={activeBlog ? activeBlog?.content.length / 50 : 25}
                        onChange={handleTextareaChange}
                        defaultValue={activeBlog?.content}
                        onContextMenu={handleContextMenu}></textarea>

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
                            className="delete-button"
                            onClick={() => setShowPopup(true)}>
                            Delete
                        </button>
                    </div>
                </>
            )}

            {showPopup && (
                <Popup setShowPopup={setShowPopup}>
                    <p>Are you sure you want to delete this blog?</p>
                    <button
                        className="primary-button"
                        onClick={handleDeleteButtonClick}>
                        Yes
                    </button>
                    <button className="secondary-button">No</button>
                </Popup>
            )}

            {showContextMenu && (
                <ContextMenu
                    contextMenuPosition={contextMenuPosition}
                    setShowContextMenu={setShowContextMenu}>
                    <button
                        className="secondary-button"
                        onClick={() => formatText('bold')}>
                        Bold
                    </button>
                    <button
                        className="secondary-button"
                        onClick={() => formatText('italic')}>
                        Italic
                    </button>
                    <button
                        className="secondary-button"
                        onClick={() => formatText('underline')}>
                        Underline
                    </button>
                    <button
                        className="secondary-button"
                        onClick={() => formatText('strikethrough')}>
                        Strikethrough
                    </button>
                    <button
                        className="secondary-button"
                        onClick={() => formatText('code')}>
                        Code
                    </button>
                </ContextMenu>
            )}
        </div>
    );
};

export default Blog;
