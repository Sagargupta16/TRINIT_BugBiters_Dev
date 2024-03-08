import { createSlice } from "@reduxjs/toolkit";

const initialUserValue = { user: {} };

const userSlice = createSlice({
  name: "user",
  initialState: initialUserValue,
  reducers: {
    setCurrentUser(state, action) {
      state.user = action.payload
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;