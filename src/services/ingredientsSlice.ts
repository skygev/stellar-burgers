import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '@utils-types';

// Thunk для запроса ингредиентов
export const fetchIngredients = createAsyncThunk<
  TIngredient[], // тип данных, который вернёт Thunk
  void, // тип аргумента
  { rejectValue: string } // тип ошибки, если reject
>('ingredients/fetchIngredients', async (_, thunkAPI) => {
  try {
    const data = await getIngredientsApi(); // вызов API
    return data; // возвращаем массив ингредиентов
  } catch (err) {
    return thunkAPI.rejectWithValue('Ошибка загрузки ингредиентов');
  }
});

// Slice
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  }
});

export default ingredientsSlice.reducer;
