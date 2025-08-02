import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { useDispatch } from '../../services/store';
import { verifyUserSession } from '../../services/slices/authenticationSlice';
import { ProtectedRoute } from './ProtectedRoute';
import { Modal, OrderInfo, IngredientDetails, AppHeader } from '@components';

const App = () => {
  // Хуки для управления состоянием и навигацией
  const storeDispatch = useDispatch();
  const currentLocation = useLocation();
  const routerNavigation = useNavigate();
  const modalBackgroundLocation = currentLocation.state?.background;

  // Функция закрытия модального окна
  function handleModalClose() {
    routerNavigation(-1);
  }

  // Функция инициализации пользовательской сессии
  function initializeUserSession() {
    storeDispatch(verifyUserSession());
  }

  // Проверка сессии пользователя при загрузке приложения
  useEffect(initializeUserSession, [storeDispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* Основные маршруты приложения */}
      <Routes location={modalBackgroundLocation || currentLocation}>
        {/* Защищенные маршруты для авторизованных пользователей */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Маршруты только для неавторизованных пользователей */}
        <Route
          path='/register'
          element={
            <ProtectedRoute guestOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute guestOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute guestOnly>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute guestOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        {/* Публичные маршруты */}
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна при навигации */}
      {modalBackgroundLocation && (
        <Routes>
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={'Детали заказа'} onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингридиента'} onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Детали заказа'} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
