import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected
} from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { RootState } from '../store';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export const sliceName = 'authentication';

// Константы статусов запросов для отслеживания состояния загрузки
const REQUEST_STATUS = {
  IDLE: 'Idle',
  LOADING: 'Loading',
  SUCCESS: 'Success',
  FAILED: 'Failed'
} as const;

type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export type UserProfile = {
  name: string;
  email: string;
};

// Интерфейс состояния аутентификации
export interface AuthenticationState {
  error?: string | null | undefined; // Ошибка запроса
  statusRequest: RequestStatus; // Статус текущего запроса
  data: UserProfile | null; // Данные пользователя
  isAuth: boolean; // Флаг авторизации
}

// Начальное состояние slice'а
const initialState: AuthenticationState = {
  error: null,
  statusRequest: REQUEST_STATUS.IDLE,
  data: null,
  isAuth: false
};

// Асинхронная проверка пользовательской сессии при загрузке приложения
export const verifyUserSession = createAsyncThunk(
  `${sliceName}/verifyUserSession`,
  async function (_, { dispatch }) {
    const hasToken = getCookie('accessToken');

    if (hasToken) {
      try {
        const response = await getUserApi();
        dispatch(setUserProfile(response.user));
      } catch (error) {
        // Игнорируем ошибки получения данных пользователя
      } finally {
        dispatch(sessionVerified());
      }
    } else {
      dispatch(sessionVerified());
    }
  }
);

// Регистрация нового пользователя
export const createUserAccount = createAsyncThunk<UserProfile, TRegisterData>(
  `${sliceName}/createUserAccount`,
  async function (dataUser, { rejectWithValue }) {
    const response = await registerUserApi(dataUser);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    // Сохранение токенов после успешной регистрации
    setCookie('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

// Авторизация пользователя
export const authenticateUser = createAsyncThunk<UserProfile, TLoginData>(
  `${sliceName}/authenticateUser`,
  async function (dataUser, { rejectWithValue }) {
    const response = await loginUserApi(dataUser);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    // Сохранение токенов после успешной авторизации
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

// Обновление профиля пользователя
export const updateUserProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile>
>(`${sliceName}/updateUserProfile`, async function (userData) {
  const response = await updateUserApi(userData);
  return response.user;
});

// Выход пользователя из системы
export const signOutUser = createAsyncThunk<void, void>(
  `${sliceName}/signOutUser`,
  async function (_, { dispatch }) {
    try {
      await logoutApi();
      // Очистка всех токенов и данных
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      dispatch(signOut());
    } catch (error) {
      // При ошибке все равно выполняем локальный выход
      dispatch(signOut());
    }
  }
);

// Создание slice'а аутентификации с редюсерами
export const authenticationSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // Установка профиля пользователя в состояние
    setUserProfile: function (state, action) {
      state.data = action.payload;
    },
    // Выход из системы (сброс флага авторизации)
    signOut: function (state) {
      state.isAuth = false;
    },
    // Подтверждение проверки сессии
    sessionVerified: function (state) {
      state.isAuth = true;
    }
  },
  // Обработчики async thunk'ов и универсальные матчеры
  extraReducers: function (builder) {
    builder
      // Успешное обновление профиля
      .addCase(updateUserProfile.fulfilled, function (state, action) {
        state.statusRequest = REQUEST_STATUS.SUCCESS;
        state.data = action.payload;
      })
      // Ошибка обновления профиля
      .addCase(updateUserProfile.rejected, function (state) {
        state.statusRequest = REQUEST_STATUS.FAILED;
      })
      // Успешный выход из системы
      .addCase(signOutUser.fulfilled, function (state) {
        state.statusRequest = REQUEST_STATUS.IDLE;
        state.data = null;
        state.isAuth = false;
      })
      // Успешная авторизация
      .addCase(authenticateUser.fulfilled, function (state, action) {
        state.statusRequest = REQUEST_STATUS.SUCCESS;
        state.data = action.payload;
      })
      // Успешная регистрация
      .addCase(createUserAccount.fulfilled, function (state, action) {
        state.statusRequest = REQUEST_STATUS.SUCCESS;
        state.data = action.payload;
      })
      // Завершение проверки сессии
      .addCase(verifyUserSession.fulfilled, function (state) {
        state.statusRequest = REQUEST_STATUS.SUCCESS;
      })
      // Универсальный обработчик начала загрузки
      .addMatcher(isPending, function (state) {
        state.statusRequest = REQUEST_STATUS.LOADING;
      })
      // Универсальный обработчик ошибок
      .addMatcher(isRejected, function (state) {
        state.statusRequest = REQUEST_STATUS.FAILED;
      });
  }
});

// Экспорт редюсера и actions
export const authenticationReducer = authenticationSlice.reducer;
export const { sessionVerified, signOut, setUserProfile } =
  authenticationSlice.actions;

// Селекторы для получения данных из состояния аутентификации

// Получение профиля пользователя
export function getUserProfile(state: RootState) {
  return state.authentication.data;
}

// Проверка завершена ли верификация сессии
export function getIsSessionVerified(state: RootState) {
  return state.authentication.statusRequest !== REQUEST_STATUS.IDLE;
}

// Получение данных зарегистрированного пользователя
export function getRegisteredUserProfile(state: RootState) {
  return state.authentication.data;
}

// Получение данных авторизованного пользователя с проверкой статуса
export function getAuthenticatedUser(state: RootState) {
  const authState = state.authentication;

  if (authState.isAuth && authState.data) {
    return authState.data;
  }

  return null;
}
