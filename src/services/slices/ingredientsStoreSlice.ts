import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

export interface Ingredient {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

interface IngredientsState {
  items: Ingredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<Ingredient[]>(
  'ingredients/fetchIngredients',
  async (_, thunkAPI) => {
    try {
      const data = await getIngredientsApi();

      const ingredients = data.map((item) => ({
        ...item,
        type: item.type as 'bun' | 'sauce' | 'main'
      })) as Ingredient[];

      return ingredients;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Не удалось загрузить ингредиенты');
    }
  }
);

const ingredientsStoreSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default ingredientsStoreSlice.reducer;
