import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { setBun, addIngredient, removeIngredient, clearConstructor } =
  constructorSlice.actions;

export default constructorSlice.reducer;
