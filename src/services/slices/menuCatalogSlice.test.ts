import { menuCatalogReducer, fetchMenuItems } from './menuCatalogSlice';
import type { TIngredient } from '@utils-types';

const initialState = {
  buns: [],
  mains: [],
  sauces: [],
  loading: false,
  error: null as string | null
};

describe('Тесты на Jest: Проверяют редьюсеры остальных слайсов (на примере ingredients)', () => {
  it('инициализация по умолчанию', () => {
    expect(menuCatalogReducer(undefined, { type: '@@INIT' } as any)).toEqual(
      initialState
    );
  });

  it('При вызове экшена Request булевая переменная isLoading меняется на true', () => {
    const action = fetchMenuItems.pending('', undefined);
    const state = menuCatalogReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('При вызове экшена Success: данные записываются в стор и isLoading=false', () => {
    const payload = [
      { _id: 'b1', type: 'bun' },
      { _id: 'm1', type: 'main' },
      { _id: 's1', type: 'sauce' }
    ] as TIngredient[] as any;
    const action = fetchMenuItems.fulfilled(payload, '', undefined);
    const state = menuCatalogReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.buns.map((i) => i._id)).toEqual(['b1']);
    expect(state.mains.map((i) => i._id)).toEqual(['m1']);
    expect(state.sauces.map((i) => i._id)).toEqual(['s1']);
  });

  it('При вызове экшена Failed: ошибка записывается и isLoading=false', () => {
    const action = fetchMenuItems.rejected(new Error('boom'), '', undefined);
    const state = menuCatalogReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('boom');
  });
});
