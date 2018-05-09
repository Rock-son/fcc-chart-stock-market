"use strict";

module.exports = {
    "env": {
        "browser": true,
        "node":true,
        "es6": true
    },
    "extends": [
		"airbnb"
	],
	settings: {
		"import/resolver": {
			"webpack": {
				"config": "webpack.config.js"
			}
		}
	},
    "parserOptions": {
		"ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
		"quote-props": [
			"error",
			"consistent"
		],
		"max-len": [
			"error",
			{"code": 350}
		],
		"import/extensions": [
			"error",
			"never"
		],
		"jsx-a11y/anchor-is-valid": [
			"error",
			{
				"components": [ "Link" ],
				"specialLink": [ "to" ]
			}
		],
		"react/jsx-no-bind": [2, {
			"ignoreRefs": false,
			"allowArrowFunctions": false,
			"allowFunctions": false,
			"allowBind": false
		}],
		"react/jsx-indent": [
			2,
			"tab"
		],
		"comma-dangle": [
			"error",
			"only-multiline"
		],
		"strict": [
			0,
			"global"
		],
		"no-tabs": 0,
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            0,
            "double"
		],
        "semi": [
            "error",
            "always"
        ]
    }
};