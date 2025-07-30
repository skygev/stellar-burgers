import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserData {
  name: string;
  email: string;
}

interface SessionState {
  user: UserData | null;
  isAuthenticated: boolean;
  isTokenChecked: boolean;
  loading: boolean;
  error?: string;
}

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  isTokenChecked: false,
  loading: false
};

export const authenticate = createAsyncThunk(
  'session/authenticate',
  async (_, thunkAPI) => {
    try {
      const userInfo = await getUserApi();
      return userInfo;
    } catch {
      return thunkAPI.rejectWithValue('Auth check failed');
    }
  }
);

export const authorize = createAsyncThunk(
  'session/authorize',
  async (form: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await loginUserApi(form);
      setCookie('accessToken', res.accessToken.split('Bearer ')[1]);
      setCookie('refreshToken', res.refreshToken);
      return await getUserApi();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  'session/register',
  async (form: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const res = await registerUserApi(form);
      setCookie('accessToken', res.accessToken.split('Bearer ')[1]);
      setCookie('refreshToken', res.refreshToken);
      return await getUserApi();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const signOut = createAsyncThunk('session/signOut', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
});

export const updateUser = createAsyncThunk(
  'session/updateUser',
  async (
    form: { name: string; email: string; password?: string },
    thunkAPI
  ) => {
    try {
      const updated = await updateUserApi(form);
      return updated;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    resetSession(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isTokenChecked = false;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isTokenChecked = true;
      })
      .addCase(authenticate.rejected, (state) => {
        state.isAuthenticated = false;
        state.isTokenChecked = true;
      })
      .addCase(authorize.pending, (state) => {
        state.loading = true;
      })
      .addCase(authorize.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(authorize.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
