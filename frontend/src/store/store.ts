import { configureStore,  getDefaultMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './reducers'
import createSagaMiddleware from 'redux-saga'
import siteSaga from './sagas'
// ...

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

export const store = configureStore({
  reducer:rootReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),

})

sagaMiddleware.run(siteSaga)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
