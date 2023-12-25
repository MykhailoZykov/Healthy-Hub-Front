import { createSlice } from '@reduxjs/toolkit';
import {
  currentUser,
  updateUser,
  updateUserGoal,
  addUserWeight,
  userStatistics,
} from './userThunks';
import { monthCurrent } from '../../utilities/monthCurrent'; //

const initialState = {
  requestMonth: monthCurrent(), //
  user: [],
  goal: [],
  weight: [],
  statistics: {
    caloriesData: [],
    waterData: [],
    weightData: [],
  }, //
  month: null, //
  isLoading: false,
  isError: null,
};

const handlePending = (state) => {
  state.isError = null;
  state.isLoading = true;
};

const handleRejected = (state, payload) => {
  state.isError = payload;
  state.isLoading = false;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(currentUser.pending, (state) => {
        handlePending(state);
      })
      .addCase(updateUser.pending, (state) => {
        handlePending(state);
      })
      .addCase(updateUserGoal.pending, (state) => {
        handlePending(state);
      })
      .addCase(addUserWeight.pending, (state) => {
        handlePending(state);
      })
      .addCase(userStatistics.pending, (state) => {
        handlePending(state);
      })

      .addCase(currentUser.rejected, (state, { payload }) => {
        handleRejected(state, payload);
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        handleRejected(state, payload);
      })
      .addCase(updateUserGoal.rejected, (state, { payload }) => {
        handleRejected(state, payload);
      })
      .addCase(addUserWeight.rejected, (state, { payload }) => {
        handleRejected(state, payload);
      })
      .addCase(userStatistics.rejected, (state, { payload }) => {
        handleRejected(state, payload);
      })

      .addCase(currentUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.user = payload;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.user = payload;
      })
      .addCase(updateUserGoal.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.goal = payload;
      })
      .addCase(addUserWeight.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.weight = payload;
      })
      .addCase(userStatistics.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isError = null;
        state.statistics = payload;
        state.month = payload.month; //
          state.user = {
            ...state.user,
            requestMonth: payload.month,
          }; //
      });
  },
});

export const userReducer = userSlice.reducer;
