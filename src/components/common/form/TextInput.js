import React, { PropTypes } from 'react';

import styles from './TextInput.module.css';

const TextInput = (
  { value, placeholder, onChange, isWarning, warningWording }
) => (
  <div
    style={{
      position: 'relative',
    }}
  >
    <input
      type="text"
      placeholder={placeholder}
      className={isWarning ? styles.warning : styles.input}
      value={value}
      onChange={onChange}
    />
    {
      warningWording ?
        <p
          className={`
            pS ${styles.warning__text} ${isWarning ? styles.isWarning : ''}
          `}
        >
          { warningWording }
        </p> : null
    }
  </div>
);


TextInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  isWarning: PropTypes.bool,
  warningWording: PropTypes.string,
};

export default TextInput;
