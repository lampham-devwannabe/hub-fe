import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import localeReducer from './slices/localeSlice'
import testReducer from './slices/testSlice'
import classReducer from './slices/classSlice'
import attemptReducer from './slices/attemptSlice'
import resourceReducer from './slices/resourceSlice'
import paymentReducer from './slices/paymentSlice'
import accountReducer from './slices/accountSlice'
import subscriptionReducer from './slices/subscriptionSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
  auth: authReducer,
  locale: localeReducer,
  test: testReducer,
  class: classReducer,
  attempt: attemptReducer,
  resource: resourceReducer,
  payment: paymentReducer,
  account: accountReducer,
  subscription: subscriptionReducer
})

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'locale', 'class', 'test', 'attempt', 'payment', 'account', 'subscription'] // Name of reducers
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
