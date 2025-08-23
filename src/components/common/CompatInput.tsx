import React, { forwardRef } from 'react';
import { Input } from '@zlden/react-developer-burger-ui-components';

/**
 * Обёртка над Input, которая добавляет безопасные обработчики
 * onPointerEnterCapture / onPointerLeaveCapture по умолчанию.
 * Это устраняет ошибки TS2739 в проектах с жёсткими типами.
 */
export type CompatInputProps = React.ComponentProps<typeof Input>;

export const CompatInput = forwardRef<HTMLInputElement, CompatInputProps>(
  ({ onPointerEnterCapture, onPointerLeaveCapture, ...rest }, ref) => {
    const noop = () => {};

    return (
      <Input
        ref={ref}
        onPointerEnterCapture={onPointerEnterCapture ?? noop}
        onPointerLeaveCapture={onPointerLeaveCapture ?? noop}
        {...rest}
      />
    );
  }
);

CompatInput.displayName = 'CompatInput';

export default CompatInput;
