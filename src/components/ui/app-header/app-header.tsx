import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <NavLink
            className={function generateLinkStyles({ isActive }) {
              return clsx(
                styles.link,
                'text text_type_main-default mr-10',
                isActive && styles.link_active
              );
            }}
            to='/'
          >
            <BurgerIcon type={'primary'} />
            <p className='ml-2'>Конструктор</p>
          </NavLink>
        </>
        <>
          <NavLink
            className={function generateOrdersLinkStyles({ isActive }) {
              return clsx(
                styles.link,
                'text text_type_main-default',
                isActive && styles.link_active
              );
            }}
            to='/feed'
          >
            <ListIcon type={'primary'} />
            <p className='ml-2'>Лента заказов</p>
          </NavLink>
        </>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          className={function generateProfileLinkStyles({ isActive }) {
            return clsx(
              styles.link,
              'text text_type_main-default',
              isActive && styles.link_active
            );
          }}
          to='/profile'
        >
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </div>
    </nav>
  </header>
);
