import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabase";
import toast from "react-hot-toast";
export const getUserProfile = createAsyncThunk(
  "GET_USER_PROFILE",
  async (id) => {
    const { data, error } = await supabase
      .from("users")
      .select(`*`)
      .eq("id", id)
      .single();
    if (data) {
    toast.success(`Welcome Back ${data?.first_name}`);
      return data;
    }
    if (error) {
      throw error?.message;
    }
  }
);


const initialState = {
  userData: null,
  isLoading: true, // <-- Add loading flag

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = false
    },
    signOut(state){
      state.userData = null
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isLoading = false;
      })

  },
});

export const userActions = userSlice.actions;
export default userSlice;
