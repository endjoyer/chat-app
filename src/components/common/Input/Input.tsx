import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: React.FC<InputProps> = ({ error, className, ...props }) => {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.input} ${error ? styles.error : ''} ${
          className || ''
        }`}
        {...props}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};
