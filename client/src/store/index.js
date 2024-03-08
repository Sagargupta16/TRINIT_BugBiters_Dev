import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./user";
import uiReducer from "./ui";

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
});

export default rootReducer;