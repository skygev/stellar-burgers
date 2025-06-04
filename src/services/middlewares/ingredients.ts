import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => {
    const response = await fetch(
      'https://norma.nomoreparties.space/api/ingredients'
    );
    if (!response.ok) {
      throw new Error('Не удалось загрузить ингредиенты');
    }
    const data = await response.json();
    return data.data; // это массив ингредиентов
  }
);
