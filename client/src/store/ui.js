import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    navbarDropdown: false,
    contactModal: false,
  },
  reducers: {
    toggleContactModal(state) {
      state.modalOpen = !state.modalOpen;
    },
    toggleNavbarDropdown(state) {
      state.navbarDropdown = !state.navbarDropdown;
    },
    setNavbarDropdown(state, action) {
      state.navbarDropdown = action.payload;
    },
    setContactModal(state, action) {
      state.contactModal = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
