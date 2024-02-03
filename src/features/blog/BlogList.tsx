import {setActiveBlog, selectBlogs, fetchBlogs, blogLoad} from './blogSlice';
import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';

const BlogList = () => {
    const navigate = useNavigate();
    const blogs = useAppSelector(selectBlogs);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!blogs || blogs.length === 0) {
            dispatch(fetchBlogs());
        } else {
            dispatch(blogLoad('fulfilled'));
        }
    }, []);

    const handleClickOnBlog = (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = (event.target as HTMLElement).parentElement?.getAttribute('data-id');
        if (id) {
            dispatch(setActiveBlog(Number.parseInt(id)));
        }
        navigate('/blog');
    };

    return (
        <div className="column">
            <div>
                <p id="blogosphere-icon">[*]</p>
                <p id="blogosphere-text">YOUR BLOGOSPHERE</p>
            </div>
            <ul className="blog-list">
                {blogs && blogs.length > 0 ? (
                    [...blogs].reverse().map((val, i) => (
                        <li
                            key={i}
                            data-id={val.id}
                            className="blog-list-item">
                            <button
                                className="blog-list-button"
                                onClick={handleClickOnBlog}>
                                {val.title}
                            </button>
                            <p className="blog-date">{val.date}</p>
                        </li>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </ul>
            <br />
            <button
                className="primary-button"
                onClick={() => navigate('create-blog')}>
                Create a blog
            </button>
        </div>
    );
};

export default BlogList;
