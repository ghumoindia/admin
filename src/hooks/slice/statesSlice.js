import { createSlice } from "@reduxjs/toolkit";
import { mockStates } from "../../services/mockData";

const statesSlice = createSlice({
  name: "states",
  initialState: {
    states: mockStates,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addState: (state, action) => {
      state.states.push(action.payload);
    },
    updateState: (state, action) => {
      const index = state.states.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.states[index] = action.payload;
      }
    },
    deleteState: (state, action) => {
      state.states = state.states.filter((s) => s.id !== action.payload);
    },
  },
});

export const { setLoading, setError, addState, updateState, deleteState } =
  statesSlice.actions;
export default statesSlice.reducer;
