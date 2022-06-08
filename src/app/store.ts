import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import blogReducer from '../features/blog/blogSlice'
import { loadBlogs, saveBlogs } from '../common/localStorage'


export const store = configureStore({
  reducer: {
    blog: blogReducer,
  },
});

store.subscribe(() => saveBlogs(store.getState()));

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

