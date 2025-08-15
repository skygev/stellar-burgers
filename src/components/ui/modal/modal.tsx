import { FC, memo } from 'react';
import { useParams } from 'react-router-dom';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => {
    const { number } = useParams();

    // Если это модальное окно заказа, показываем номер заказа
    const isOrderModal = title === 'modal-order';

    return (
      <>
        <div className={styles.modal}>
          <div className={styles.header}>
            {isOrderModal && number ? (
              <h3 className={`${styles.title} text text_type_digits-default`}>
                #{String(number).padStart(6, '0')}
              </h3>
            ) : (
              <h3 className={`${styles.title} text text_type_main-large`}>
                {title}
              </h3>
            )}
            <button className={styles.button} type='button'>
              <CloseIcon type='primary' onClick={onClose} />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  }
);
