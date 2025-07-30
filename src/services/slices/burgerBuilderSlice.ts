import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient } from './ingredientsStoreSlice';
import { v4 as uuidv4 } from 'uuid';

export interface ConstructorIngredient extends Ingredient {
  uuid: string;
}

interface ConstructorState {
  bun: Ingredient | null;
  fillings: ConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  fillings: []
};

const burgerBuilder = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    selectBun(state, action: PayloadAction<Ingredient>) {
      state.bun = action.payload;
    },
    addFilling(state, action: PayloadAction<Ingredient>) {
      state.fillings.push({ ...action.payload, uuid: uuidv4() });
    },
    removeFilling(state, action: PayloadAction<string>) {
      state.fillings = state.fillings.filter(
        (item) => item.uuid !== action.payload
      );
    },
    reorderFillings(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const updated = [...state.fillings];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      state.fillings = updated;
    },
    resetConstructor(state) {
      state.bun = null;
      state.fillings = [];
    }
  }
});

export const {
  selectBun,
  addFilling,
  removeFilling,
  reorderFillings,
  resetConstructor
} = burgerBuilder.actions;

export default burgerBuilder.reducer;
