import tseslint from 'typescript-eslint';
import base from '../../eslint.config.mjs';

tseslint.config(
  ...base,
  {
    // extends: [base]
  }
);
