import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

// Тип состояния каталога ингредиентов
type MenuCatalogState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
  error: string | null;
};

// Начальное состояние каталога
const initialState: MenuCatalogState = {
  buns: [],
  mains: [],
  sauces: [],
  loading: false,
  error: null
};

// Асинхронная загрузка ингредиентов с API
export const fetchMenuItems = createAsyncThunk(
  'menuCatalog/fetchMenuItems',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

// Создание slice'а каталога ингредиентов
export const menuCatalogSlice = createSlice({
  name: 'menuCatalog',
  initialState,
  reducers: {}, // Нет синхронных действий
  selectors: {
    // Селектор для получения всего каталога
    getMenuCatalog: (state) => state
  },
  extraReducers: (builder) => {
    builder
      // Начало загрузки ингредиентов
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Успешная загрузка и сортировка ингредиентов по типам
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.buns = action.payload.filter(
          (item: TIngredient) => item.type === 'bun'
        );
        state.mains = action.payload.filter(
          (item: TIngredient) => item.type === 'main'
        );
        state.sauces = action.payload.filter(
          (item: TIngredient) => item.type === 'sauce'
        );
      })
      // Ошибка загрузки ингредиентов
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

// Экспорт селектора и редюсера
export const { getMenuCatalog } = menuCatalogSlice.selectors;
export const menuCatalogReducer = menuCatalogSlice.reducer;
