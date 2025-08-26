module.exports = {
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "unused-imports",
    "typescript-sort-keys",
    "import",
    "promise",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  // Configuration for JavaScript files
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        endOfLine: "auto",
        semi: true,
      },
    ],

    "import/newline-after-import": ["error"],
    "import/extensions": "off", // Avoid missing file extension errors when using '@/' alias
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-duplicates": ["error"],
    "import/order": [
      "error",
      {
        pathGroups: [
          {
            pattern: "~/**",
            group: "external",
            position: "after",
          },
        ],
        groups: [
          "external",
          "internal",
          "unknown",
          "index",
          "object",
          "type",
          "builtin",
          "sibling",
          "parent",
        ],
      },
    ],
    "import/no-mutable-exports": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: false,
      },
    ],

    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-loop-func": "warn",
    "@typescript-eslint/no-inferrable-types": "warn",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/ban-types": ["error"],
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        functions: true,
        classes: true,
        variables: true,
      },
    ],
    "@typescript-eslint/comma-dangle": [
      "off",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
        enums: "always-multiline",
        generics: "always-multiline",
        tuples: "always-multiline",
      },
    ],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "warn",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/return-await": ["warn", "in-try-catch"],
    "@typescript-eslint/comma-spacing": [
      "off",
      {
        before: false,
        after: true,
      },
    ],
    "@typescript-eslint/quotes": [
      0,
      "single",
      {
        avoidEscape: true,
      },
    ],
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-function": [
      "error",
      {
        allow: ["arrowFunctions", "functions", "methods"],
      },
    ],
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-misused-new": ["error"],
    "@typescript-eslint/no-non-null-asserted-optional-chain": ["error"],
    "@typescript-eslint/no-this-alias": ["error"],
    "@typescript-eslint/no-unnecessary-type-constraint": ["error"],
    "@typescript-eslint/prefer-as-const": ["error"],
    "@typescript-eslint/no-redeclare": ["error"],
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      },
    ],
    "@typescript-eslint/no-useless-constructor": ["error"],

    "typescript-sort-keys/string-enum": [
      "warn",
      "asc",
      { caseSensitive: true },
    ],

    // file
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-var": "error",
    "no-nested-ternary": "error",
    "no-unneeded-ternary": "error",
    "no-empty-pattern": "error",
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
    "no-restricted-exports": "off",
    "no-param-reassign": "off",
    "no-array-constructor": "off",
    "no-empty-function": [
      "off",
      {
        allow: ["arrowFunctions", "functions", "methods"],
      },
    ],
    "no-redeclare": "off",
    "no-use-before-define": [
      "off",
      {
        functions: true,
        classes: true,
        variables: true,
      },
    ],
    "no-unused-expressions": [
      "off",
      {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      },
    ],
    "no-useless-constructor": "off",
    "no-duplicate-imports": ["off"],
    "no-useless-rename": [
      "error",
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],

    "prefer-destructuring": [
      "error",
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    "array-callback-return": "off",
    "prefer-spread": ["error"],

    camelcase: "warn",
    "max-lines": [
      "warn",
      { skipComments: true, skipBlankLines: true, max: 280 },
    ],
    "max-params": ["error", 4],
    "max-classes-per-file": ["error", 3],

    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "export" },
      { blankLine: "always", prev: "*", next: "return" },
    ],
    "symbol-description": "off",
    "consistent-return": "off",
    "class-methods-use-this": 0,
    "operator-linebreak": ["off"],
    "implicit-arrow-linebreak": ["off", "beside"],

    "object-shorthand": [
      "error",
      "always",
      {
        ignoreConstructors: false,
        avoidQuotes: true,
      },
    ],
    "object-curly-newline": [
      "off",
      {
        ObjectExpression: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
      },
    ],
    "object-curly-spacing": ["off", "always"],
    "object-property-newline": [
      "off",
      {
        allowAllPropertiesOnSameLine: true,
        allowMultiplePropertiesPerLine: false,
      },
    ],

    "promise/always-return": ["error"],
    "promise/no-return-wrap": ["error"],
    "promise/param-names": ["error"],
    "promise/catch-or-return": ["error"],
    "promise/no-native": ["off"],
    "promise/no-nesting": ["warn"],
    "promise/no-promise-in-callback": ["warn"],
    "promise/no-callback-in-promise": ["warn"],
    "promise/avoid-new": ["off"],
    "promise/no-new-statics": ["error"],
    "promise/no-return-in-finally": ["warn"],
    "promise/valid-params": ["warn"],
  },
};
