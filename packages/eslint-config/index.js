import tseslint from "typescript-eslint";
import nextPlugin from '@next/eslint-plugin-next';

export const base = [
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],}
    }
];
export const nextjs = [...base,
    {
        plugins: { '@next/next': nextPlugin },
        rules: {
            ...nextPlugin.configs.recommended.rules,
    }
  }
];
export const nestjs = [...base,
    {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
    }
  }
];