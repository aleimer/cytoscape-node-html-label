module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "rules": {
        "no-var": "off",
        "prefer-const": "off",
        "@typescript-eslint/prefer-const": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "max-len": [
            "error",
            {
                "code": 128,
                "ignoreUrls": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true
            }
        ],
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/typedef": [
            "error",
            {
                "arrayDestructuring": true,
                "arrowParameter": true,
                "memberVariableDeclaration": true,
                "objectDestructuring": true,
                "parameter": true,
                "propertyDeclaration": true,
                "variableDeclaration": true
            }
        ],
        "@typescript-eslint/init-declarations": "error",
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/no-unsafe-enum-comparison": "error",
        "semi": "error",
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "error",
        "eqeqeq": "error",
        "@typescript-eslint/member-ordering": "error",
        "brace-style": [
            "error",
            "allman",
            {
                "allowSingleLine": true
            }
        ],
        "indent": [
            "error",
            4,
            {
                "ignoredNodes": [
                    "PropertyDefinition"
                ]
            }
        ],
        "quotes": [
            "error",
            "double",
            {
                "avoidEscape": true
            }
        ]
    }
};
