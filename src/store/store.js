import { configureStore } from "@reduxjs/toolkit";
import userSLice from "./user-slice";


const store = configureStore({
  reducer: {
    user: userSLice.reducer,
  },
});

export default store;