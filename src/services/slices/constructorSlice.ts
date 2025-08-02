import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid'; // Для генерации уникальных ID

// Тип состояния конструктора бургера
type BuilderState = {
  ingredients: TConstructorIngredient[]; // Список добавленных ингредиентов
  bun: TConstructorIngredient | null; // Выбранная булочка
};

// Начальное состояние конструктора
const initialState: BuilderState = {
  ingredients: [],
  bun: null
};

// Вспомогательная функция для создания компонента с уникальным ID
function createUniqueComponent(component: any) {
  return {
    payload: {
      ...component,
      id: uuidv4() // Добавляем уникальный идентификатор
    }
  };
}

// Поиск индекса компонента в массиве по ID
function findComponentIndex(
  items: TConstructorIngredient[],
  targetId: string
): number {
  let foundIndex = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i]._id === targetId) {
      foundIndex = i;
      break;
    }
  }
  return foundIndex;
}

// Обмен местами двух элементов в массиве
function swapArrayElements(
  arr: TConstructorIngredient[],
  firstIndex: number,
  secondIndex: number
) {
  // Проверка валидности индексов
  if (
    firstIndex >= 0 &&
    secondIndex >= 0 &&
    firstIndex < arr.length &&
    secondIndex < arr.length
  ) {
    const temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
  }
}

// Создание slice'а конструктора бургера
export const builderSlice = createSlice({
  name: 'foodBuilder',
  initialState,

  reducers: {
    // Перемещение ингредиента вверх или вниз в списке
    repositionComponent: function (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) {
      const actionData = action.payload;
      const currentIndex = actionData.index;
      const moveDirection = actionData.direction;

      // Определение целевого индекса для перемещения
      let targetIndex: number;
      if (moveDirection === 'up') {
        targetIndex = currentIndex - 1;
      } else {
        targetIndex = currentIndex + 1;
      }

      const itemsCount = state.ingredients.length;
      const canMove = targetIndex >= 0 && targetIndex < itemsCount;

      // Выполнение перемещения при возможности
      if (canMove) {
        const itemsCopy = [...state.ingredients];
        swapArrayElements(itemsCopy, currentIndex, targetIndex);
        state.ingredients = itemsCopy;
      }
    },

    // Удаление ингредиента из конструктора
    removeComponent: function (state, action) {
      const itemToRemove = action.payload;
      const isNotBun = itemToRemove.type !== 'bun';

      // Удаляем только ингредиенты, не булочки
      if (isNotBun) {
        const itemId = itemToRemove._id;
        const itemIndex = findComponentIndex(state.ingredients, itemId);

        if (itemIndex !== -1) {
          const updatedIngredients = [...state.ingredients];
          updatedIngredients.splice(itemIndex, 1);
          state.ingredients = updatedIngredients;
        }
      }
    },

    // Добавление нового ингредиента в конструктор
    addComponent: {
      prepare: createUniqueComponent, // Препроцессор для добавления уникального ID
      reducer: function (state, action: PayloadAction<TConstructorIngredient>) {
        const newItem = action.payload;
        const itemType = newItem.type;

        // Булочки заменяют предыдущую, остальные добавляются в список
        if (itemType === 'bun') {
          state.bun = newItem;
        } else {
          const currentIngredients = state.ingredients;
          const updatedIngredients = [...currentIngredients, newItem];
          state.ingredients = updatedIngredients;
        }
      }
    },

    // Очистка конструктора (сброс состояния)
    resetBuilder: function (state) {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

// Извлечение actions и reducer из slice'а
const sliceActions = builderSlice.actions;
const sliceReducer = builderSlice.reducer;

// Экспорт редюсера и actions для использования в других частях приложения
export const builderReducer = sliceReducer;
export const addComponent = sliceActions.addComponent; // Добавить ингредиент
export const removeComponent = sliceActions.removeComponent; // Удалить ингредиент
export const resetBuilder = sliceActions.resetBuilder; // Очистить конструктор
export const repositionComponent = sliceActions.repositionComponent; // Переместить ингредиент
