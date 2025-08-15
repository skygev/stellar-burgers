import {
  builderReducer,
  addComponent,
  removeComponent,
  repositionComponent,
  resetBuilder
} from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';

const bun: TConstructorIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 10,
  image: '',
  image_large: '',
  image_mobile: '',
  id: 'id-bun'
};

const main1: TConstructorIngredient = {
  _id: 'main-1',
  name: 'Начинка 1',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 20,
  image: '',
  image_large: '',
  image_mobile: '',
  id: 'id-m1'
};

const main2: TConstructorIngredient = {
  ...main1,
  _id: 'main-2',
  name: 'Начинка 2',
  id: 'id-m2'
};

describe('Тесты на Jest: Проверяют редьюсер слайса constructor', () => {
  it('обработку экшена добавления ингредиента; (инициализация по умолчанию тоже проверяем)', () => {
    expect(builderReducer(undefined, { type: '@@INIT' } as any)).toEqual({
      ingredients: [],
      bun: null
    });
  });

  it('обработку экшена добавления ингредиента; булка заменяет предыдущую', () => {
    let state = builderReducer(undefined, addComponent(bun as any));
    expect(state.bun?._id).toBe('bun-1');
    const newBun = { ...bun, _id: 'bun-2', name: 'Другая булка' } as any;
    state = builderReducer(state, addComponent(newBun));
    expect(state.bun?._id).toBe('bun-2');
    expect(state.ingredients.length).toBe(0);
  });

  it('обработку экшена добавления ингредиента; начинка добавляется в конец', () => {
    let state = builderReducer(undefined, resetBuilder());
    state = builderReducer(state, addComponent(bun as any));
    state = builderReducer(state, addComponent(main1 as any));
    state = builderReducer(state, addComponent(main2 as any));
    expect(state.ingredients.map((i) => i._id)).toEqual(['main-1', 'main-2']);
  });

  it('обработку экшена удаления ингредиента', () => {
    let state = builderReducer(undefined, resetBuilder());
    state = builderReducer(state, addComponent(bun as any));
    state = builderReducer(state, addComponent(main1 as any));
    state = builderReducer(state, addComponent(main2 as any));
    state = builderReducer(state, removeComponent(main1 as any));
    expect(state.ingredients.map((i) => i._id)).toEqual(['main-2']);
    // попытка удалить булку не должна менять bun
    const prevBunId = state.bun?._id;
    state = builderReducer(state, removeComponent(bun as any));
    expect(state.bun?._id).toBe(prevBunId);
  });

  it('обработку экшена изменения порядка ингредиентов в начинке', () => {
    let state = builderReducer(undefined, resetBuilder());
    state = builderReducer(state, addComponent(bun as any));
    state = builderReducer(state, addComponent(main1 as any));
    state = builderReducer(state, addComponent(main2 as any));
    // Поменять местами 0 и 1 через перемещение вниз первого
    state = builderReducer(
      state,
      repositionComponent({ index: 0, direction: 'down' })
    );
    expect(state.ingredients.map((i) => i._id)).toEqual(['main-2', 'main-1']);
  });
});
