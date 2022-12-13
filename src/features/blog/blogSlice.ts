import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {loadBlogs} from '../../common/localStorage';

interface Blog {
    id: number;
    title: string;
    content: string;
    date: string;
    status: 'public' | 'private';
}

interface BlogState {
    blogs: Array<Blog>;
    activeBlogId: number;
    status: 'loading' | 'fulfilled' | 'rejected';
}

const blogData = loadBlogs();

const initialState: BlogState = {
    blogs: blogData.blogs,
    activeBlogId: blogData.activeBlogId || 0,
    status: 'loading',
};

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
    const response = await fetch('db.json').then((data) => data.json());
    return response.blogs;
});

export const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        blogAdd: (state, action: PayloadAction<Blog>) => {
            state.blogs.push(action.payload);
        },
        blogDelete: (state, action: PayloadAction<number>) => {
            state.blogs = state.blogs.filter((val) => val.id !== action.payload);
        },
        blogUpdateBody: (state, action: PayloadAction<{id: number; content: string}>) => {
            state.blogs = state.blogs.filter((val) =>
                val.id === action.payload.id ? (val.content = action.payload.content) : val
            );
        },
        blogRename: (state, action: PayloadAction<{id: number; title: string}>) => {
            state.blogs = state.blogs.filter((val) =>
                val.id === action.payload.id ? (val.title = action.payload.title) : val
            );
        },
        setActiveBlog: (state, action: PayloadAction<number>) => {
            state.activeBlogId = action.payload;
        },
        blogLoad: (state, action: PayloadAction<'loading' | 'fulfilled' | 'rejected'>) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.blogs = action.payload;
            });
    },
});

export const {blogAdd, blogDelete, blogUpdateBody, blogRename, blogLoad, setActiveBlog} = blogSlice.actions;

export const selectBlogs = (state: RootState) => state.blog.blogs;

export const selectStatus = (state: RootState) => state.blog.status;

export const selectActiveBlog = (state: RootState) =>
    state.blog.blogs.find((val) => val.id === state.blog.activeBlogId);

export default blogSlice.reducer;
