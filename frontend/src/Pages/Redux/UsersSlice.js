import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://randomuser.me/api/?results=12");
  const data = await response.json();
  return data.results;
});

const UsersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    filteredUsers: [],
    filterLocation: "",
    sortOption: "none",
    ratings: {},
    flippedCards: [],
    status: "idle", 
    error: null,
  },
  reducers: {
    setFilterLocation(state, action) {
      state.filterLocation = action.payload;
    },
    setSortOption(state, action) {
      state.sortOption = action.payload;
    },
    setRatings(state, action) {
      const { builderId, rating } = action.payload;
      state.ratings[builderId] = rating;
      console.log("rating");
    },
    toggleCardFlip(state, action) {
      const id = action.payload;
      if (state.flippedCards.includes(id)) {
        state.flippedCards = state.flippedCards.filter((cardId) => cardId !== id);
      } else {
        state.flippedCards.push(id);
      }
      console.log("flipend cards");
    },
    applyFilters(state) {
      let updatedUsers = [...state.users];

      if (state.filterLocation) {
        updatedUsers = updatedUsers.filter((user) =>
          user.location.city.toLowerCase().includes(state.filterLocation.toLowerCase())
        );
      }

      if (state.sortOption === "rating") {
        updatedUsers.sort(
          (a, b) => (state.ratings[b.login.uuid] || 0) - (state.ratings[a.login.uuid] || 0)
        );
      } else if (state.sortOption === "name") {
        updatedUsers.sort((a, b) => a.name.first.localeCompare(b.name.first));
      }

      state.filteredUsers = updatedUsers;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
        state.filteredUsers = action.payload; 
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setFilterLocation,
  setSortOption,
  setRatings,
  toggleCardFlip,
  applyFilters,
} = UsersSlice.actions;

export default UsersSlice.reducer;
