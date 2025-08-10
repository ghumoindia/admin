import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../lib/axios";
import EndPoints from "../../lib/endpoints";

// Fetch all calendars for a specific year
export const fetchCalendars = createAsyncThunk(
  "calendar/fetchCalendars",
  async (year = new Date().getFullYear()) => {
    const response = await Api.get(
      `${EndPoints.fetchAllCalenders}/year/${year}`
    );
    return response.calendars || [];
  }
);

// Add or update a month's calendar data
export const addCalendar = createAsyncThunk(
  "calendar/addCalendar",
  async (monthData) => {
    console.log("Adding/updating month calendar:", monthData);
    const response = await Api.post(`${EndPoints.createCalender}`, monthData);
    return response || {};
  }
);

// Get specific month data
export const getMonthCalendar = createAsyncThunk(
  "calendar/getMonthCalendar",
  async ({ year = new Date().getFullYear(), monthNumber }) => {
    try {
      const response = await Api.get(
        `${EndPoints.fetchAllCalenders}/month/${year}/${monthNumber}`
      );
      return response || {};
    } catch (error) {
      // If month doesn't exist, return empty structure
      if (error.response?.status === 404) {
        return { success: false, calendar: null };
      }
      throw error;
    }
  }
);

// Update specific month calendar
export const updateCalendar = createAsyncThunk(
  "calendar/updateCalendar",
  async ({ year = new Date().getFullYear(), monthNumber, data }) => {
    console.log("Updating month calendar:", { year, monthNumber, data });
    const response = await Api.put(
      `${EndPoints.updateCalender}/month/${year}/${monthNumber}`,
      data
    );
    console.log("Month calendar updated:", response);
    return response;
  }
);

// Delete specific month calendar
export const deleteCalendar = createAsyncThunk(
  "calendar/deleteCalendar",
  async ({ year = new Date().getFullYear(), monthNumber }) => {
    const result = await Api.delete(
      `${EndPoints.deleteCalender}/month/${year}/${monthNumber}`
    );
    return { ...result, year, monthNumber };
  }
);

// Add state to specific month
export const addStateToMonth = createAsyncThunk(
  "calendar/addStateToMonth",
  async ({ year = new Date().getFullYear(), monthNumber, stateData }) => {
    const response = await Api.post(
      `${EndPoints.createCalender}/month/${year}/${monthNumber}/state`,
      stateData
    );
    return response;
  }
);

// Remove state from specific month
export const removeStateFromMonth = createAsyncThunk(
  "calendar/removeStateFromMonth",
  async ({ year = new Date().getFullYear(), monthNumber, stateIndex }) => {
    const response = await Api.delete(
      `${EndPoints.deleteCalender}/month/${year}/${monthNumber}/state/${stateIndex}`
    );
    return response;
  }
);

const CalendarSlice = createSlice({
  name: "calendar",
  initialState: {
    calendars: [], // Array of all months for current year
    currentMonth: null, // Currently selected month data
    currentYear: new Date().getFullYear(),
    savedMonths: [], // Track which months are saved
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentYear: (state, action) => {
      state.currentYear = action.payload;
    },
    setCurrentMonth: (state, action) => {
      state.currentMonth = action.payload;
    },
    addSavedMonth: (state, action) => {
      if (!state.savedMonths.includes(action.payload)) {
        state.savedMonths.push(action.payload);
      }
    },
    resetCalendar: (state) => {
      state.calendars = [];
      state.currentMonth = null;
      state.savedMonths = [];
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCalendars (get all months for year)
      .addCase(fetchCalendars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendars.fulfilled, (state, action) => {
        console.log("Year calendars fetched:", action.payload);
        state.loading = false;
        state.calendars = action.payload;

        // Update saved months set
        const savedMonths = [];
        action.payload.forEach((month) => {
          if (month.monthNumber) {
            savedMonths.push(month.monthNumber);
          }
        });
        state.savedMonths = savedMonths;
      })
      .addCase(fetchCalendars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addCalendar (create/update month)
      .addCase(addCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCalendar.fulfilled, (state, action) => {
        console.log("Month calendar added/updated:", action.payload);
        state.loading = false;

        if (action.payload.success && action.payload.calendar) {
          const calendar = action.payload.calendar;
          state.currentMonth = calendar;
          state.successMessage = action.payload.message;

          // Add to saved months
          if (
            calendar.monthNumber &&
            !state.savedMonths.includes(calendar.monthNumber)
          ) {
            state.savedMonths.push(calendar.monthNumber);
          }

          // Update calendars array
          const existingIndex = state.calendars.findIndex(
            (cal) => cal.monthNumber === calendar.monthNumber
          );

          if (existingIndex !== -1) {
            state.calendars[existingIndex] = calendar;
          } else {
            state.calendars.push(calendar);
          }
        }
      })
      .addCase(addCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // getMonthCalendar
      .addCase(getMonthCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMonthCalendar.fulfilled, (state, action) => {
        console.log("Month calendar fetched:", action.payload);
        state.loading = false;

        if (action.payload.success && action.payload.calendar) {
          state.currentMonth = action.payload.calendar;

          // Add to saved months if it exists
          if (
            action.payload.calendar.monthNumber &&
            !state.savedMonths.includes(action.payload.calendar.monthNumber)
          ) {
            state.savedMonths.push(action.payload.calendar.monthNumber);
          }
        } else {
          // Month doesn't exist in database
          state.currentMonth = null;
        }
      })
      .addCase(getMonthCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateCalendar (update month)
      .addCase(updateCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCalendar.fulfilled, (state, action) => {
        console.log("Month calendar updated:", action.payload);
        state.loading = false;

        if (action.payload.success && action.payload.calendar) {
          const calendar = action.payload.calendar;
          state.currentMonth = calendar;
          state.successMessage = action.payload.message;

          // Update in calendars array
          const index = state.calendars.findIndex(
            (cal) => cal.monthNumber === calendar.monthNumber
          );
          if (index !== -1) {
            state.calendars[index] = calendar;
          }
        }
      })
      .addCase(updateCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCalendar.fulfilled, (state, action) => {
        console.log("Month calendar deleted:", action.payload);
        state.loading = false;
        state.successMessage = action.payload.message;

        state.calendars = state.calendars.filter(
          (calendar) => calendar.monthNumber !== action.payload.monthNumber
        );

        state.savedMonths = state.savedMonths.filter(
          (monthNum) => monthNum !== action.payload.monthNumber
        );
        if (state.currentMonth?.monthNumber === action.payload.monthNumber) {
          state.currentMonth = null;
        }
      })
      .addCase(deleteCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addStateToMonth
      .addCase(addStateToMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStateToMonth.fulfilled, (state, action) => {
        console.log("State added to month:", action.payload);
        state.loading = false;

        if (action.payload.success && action.payload.calendar) {
          state.currentMonth = action.payload.calendar;
          state.successMessage = action.payload.message;
        }
      })
      .addCase(addStateToMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // removeStateFromMonth
      .addCase(removeStateFromMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeStateFromMonth.fulfilled, (state, action) => {
        console.log("State removed from month:", action.payload);
        state.loading = false;

        if (action.payload.success && action.payload.calendar) {
          state.currentMonth = action.payload.calendar;
          state.successMessage = action.payload.message;
        }
      })
      .addCase(removeStateFromMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setCurrentYear,
  setCurrentMonth,
  addSavedMonth,
  resetCalendar,
} = CalendarSlice.actions;

export default CalendarSlice.reducer;
