export const saveBlogs = (state: any) => {
  try {
    const serializedState = JSON.stringify(state.blog);
    localStorage.setItem('blog', serializedState);
  } catch (error) {
    return error;
  }
};


// Loads the state and returns an object that can be provided as the
// preloadedState parameter of store.js's call to configureStore
export const loadBlogs = () => { 
  try {
    const serializedBlogState = localStorage.getItem('blog');
    if (serializedBlogState === null) {
      return [];
    }
    return JSON.parse(serializedBlogState);
  } catch (error) {
    return error;
  }
};
