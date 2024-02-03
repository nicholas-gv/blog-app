import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {loadBlogs} from '../../common/localStorage';
import axios, {AxiosError} from 'axios';
import {SerializedError} from '@reduxjs/toolkit';

interface Blog {
    id: number;
    title: string;
    body: string;
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

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get('db.json');
        return response.data.blogs;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<SerializedError>;
            if (axiosError.response) {
                // Handle HTTP error response (e.g., status code is not in 2xx range)
                return rejectWithValue(axiosError.response.data);
            } else if (axiosError.request) {
                // Handle network error (e.g., no response received)
                return rejectWithValue({message: 'Network error. Please try again later.'});
            }
        }
        return rejectWithValue({message: 'An error occurred. Please try again later.'});
    }
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
        blogUpdateBody: (state, action: PayloadAction<{id: number; body: string}>) => {
            state.blogs = state.blogs.filter((val) =>
                val.id === action.payload.id ? (val.body = action.payload.body) : val
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
