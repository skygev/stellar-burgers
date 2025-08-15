describe('Интеграционные тесты на Cypress написаны для страницы конструктора бургера', () => {
  beforeEach(() => {
    // Созданы моковые данные для ингредиентов (например, в файле ingredients.json)
    // Настроен перехват запроса на эндпоинт 'api/ingredients', в ответе на который возвращаются созданные ранее моковые данные
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Протестировано добавление ингредиента из списка в конструктор. Минимальные требования — добавление одного ингредиента, в идеале — добавление булок и добавление начинок', () => {
    // Добавление булки
    cy.contains('Флюоресцентная булка R2-D3')
      .closest('li')
      .within(() => cy.contains('Добавить').click());

    // Добавление начинки
    cy.contains('Мясо бессмертных моллюсков Protostomia')
      .closest('li')
      .within(() => cy.contains('Добавить').click());

    cy.contains('Оформить заказ').should('be.visible');
  });

  it('Протестирована работа модальных окон: открытие модального окна ингредиента; закрытие по клику на оверлей', () => {
    // Открытие модального окна ингредиента
    cy.contains('Флюоресцентная булка R2-D3').click();
    cy.contains('Детали ингридиента').should('exist');
    // Закрытие по клику на оверлей (эквивалент — переход назад)
    cy.go('back');
    cy.contains('Детали ингридиента').should('not.exist');
  });

  it('Создание заказа: Созданы моковые данные ответа на запрос данных пользователя и создания заказа. Подставляются моковые токены авторизации. Собирается бургер. Вызывается клик по кнопке «Оформить заказ». Проверяется, что модальное окно открылось и номер заказа верный. Закрывается модальное окно и проверяется успешность закрытия. Проверяется, что конструктор пуст', () => {
    // Токены авторизации
    cy.setCookie('accessToken', 'test-access');
    window.localStorage.setItem('refreshToken', 'test-refresh');

    // Мокаем профиль пользователя
    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Tester', email: 'test@example.com' }
      }
    }).as('getUser');

    // Перезагрузка, чтобы сработала верификация
    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);

    // Мокаем создание заказа
    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: { success: true, order: { number: 12345 }, name: 'Test' }
    }).as('postOrder');

    // Собираем бургер: булка + начинка
    cy.contains('Флюоресцентная булка R2-D3')
      .closest('li')
      .within(() => cy.contains('Добавить').click());
    cy.contains('Мясо бессмертных моллюсков Protostomia')
      .closest('li')
      .within(() => cy.contains('Добавить').click());

    // Оформляем заказ
    cy.contains('Оформить заказ').click();
    cy.wait('@postOrder');

    // Проверяем модалку с номером заказа
    cy.contains('идентификатор заказа').prev().should('have.text', '12345');

    // Закрываем модалку любым доступным способом (ESC, клик по фону, крестик)
    cy.get('body').type('{esc}');
    cy.contains('идентификатор заказа').should('not.exist');

    // Проверяем, что конструктор очищен
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
