import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = configureStore({
	reducer: rootReducer,
  });
  
  root.render(
	<Provider store={store}>
	  <App />
	</Provider>
  );
