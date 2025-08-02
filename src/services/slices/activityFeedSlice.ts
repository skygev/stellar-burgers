import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '@utils-types';

// Тип состояния ленты активности заказов
type ActivityFeedState = {
  errorMessage: string | null;
  isLoading: boolean;
  activityData: TOrdersData | null;
};

// Начальное состояние ленты активности
const initialState: ActivityFeedState = {
  errorMessage: null,
  isLoading: false,
  activityData: null
};

// Асинхронная загрузка ленты заказов с API
export const fetchActivityFeed = createAsyncThunk(
  'activityFeed/fetchActivityFeed',
  async function () {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      throw error; // Пробрасываем ошибку для обработки в rejected case
    }
  }
);

// Создание slice'а ленты активности заказов
export const activityFeedSlice = createSlice({
  name: 'activityFeed',
  initialState,
  reducers: {}, // Нет синхронных действий
  selectors: {
    // Селектор для получения всего состояния ленты
    getActivityFeed: function (state) {
      return state;
    }
  },
  extraReducers: function (builder) {
    builder
      // Обработка ошибки загрузки
      .addCase(fetchActivityFeed.rejected, function (state, action) {
        state.isLoading = false;
        const errorMsg = action.error.message;
        state.errorMessage = errorMsg ? errorMsg : 'Unknown error occurred';
      })
      // Успешная загрузка данных ленты
      .addCase(fetchActivityFeed.fulfilled, function (state, action) {
        state.errorMessage = null;
        state.isLoading = false;
        state.activityData = action.payload;
      })
      // Начало загрузки данных
      .addCase(fetchActivityFeed.pending, function (state) {
        state.errorMessage = null;
        state.isLoading = true;
      });
  }
});

// Извлечение селекторов и редюсера из slice'а
const sliceSelectors = activityFeedSlice.selectors;
const sliceReducer = activityFeedSlice.reducer;

// Экспорт для использования в компонентах
export const getActivityFeed = sliceSelectors.getActivityFeed;
export const activityFeedReducer = sliceReducer;
