import { combineReducers } from '@reduxjs/toolkit';

import uiReducer from './ui';
import userReducer from './user';

const rootReducer = combineReducers({
	user: userReducer,
	ui: uiReducer
});

export default rootReducer;
