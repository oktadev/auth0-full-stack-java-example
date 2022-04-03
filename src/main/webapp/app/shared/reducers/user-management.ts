import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IUser } from 'app/shared/model/user.model';
import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  errorMessage: null,
  users: [] as ReadonlyArray<IUser>,
};

const apiUrl = 'api/users';

// Async Actions

export const getUsers = createAsyncThunk('userManagement/fetch_users', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return axios.get<IUser[]>(requestUrl);
});

export type UserManagementState = Readonly<typeof initialState>;

export const UserManagementSlice = createSlice({
  name: 'userManagement',
  initialState: initialState as UserManagementState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUsers.pending, state => state)
      .addCase(getUsers.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
      });
  },
});

export const { reset } = UserManagementSlice.actions;

// Reducer
export default UserManagementSlice.reducer;
