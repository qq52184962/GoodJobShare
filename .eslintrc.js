const path = require('path');

module.exports = {
  "extends": [
    "react-app",
    "airbnb"
  ],
  "rules": {
    "arrow-parens": ["error", "as-needed"],
    "comma-dangle": ["error", "always-multiline"],
    "max-len": ["error", 199, {
      "ignorePattern": " // eslint-disable-line "
    }],
    "react/prefer-stateless-function": "off",
    "no-underscore-dangle": "off",
    "no-console": "off",
    "import/no-extraneous-dependencies": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-filename-extension": ["error", {
      "extensions": [".js"]
    }],
    "jsx-a11y/no-static-element-interactions": "off",
    "react/require-default-props": "warn",
    "indent": "off",
    "react/no-array-index-key": "off"
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": {
          "resolve": {
            "alias": {
              "common": path.resolve("./src/components/common"),
              "utils": path.resolve("./src/utils"),
            }
          }
        }
      }
    }
  }
};
