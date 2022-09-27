/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/commentSection.js":
/*!*****************************************!*\
  !*** ./src/client/js/commentSection.js ***!
  \*****************************************/
/***/ (() => {

eval("var videoContainer = document.getElementById(\"videoContainer\");\nvar form = document.getElementById(\"commentForm\");\n\nvar handleSubmit = function handleSubmit(event) {\n  event.preventDefault();\n  var textarea = form.querySelector(\"textarea\");\n  var text = textarea.value;\n  var videoId = videoContainer.dataset.id;\n\n  if (text !== \"\") {\n    fetch(\"/api/videos/\".concat(videoId, \"/comment\"), {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify({\n        text: text\n      })\n    });\n  }\n\n  ;\n  textarea.value = \"\";\n};\n\nif (form) {\n  form.addEventListener(\"submit\", handleSubmit);\n}\n\n//# sourceURL=webpack://wetube/./src/client/js/commentSection.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/commentSection.js"]();
/******/ 	
/******/ })()
;