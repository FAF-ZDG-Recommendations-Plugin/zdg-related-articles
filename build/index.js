/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/editor":
/*!********************************!*\
  !*** external ["wp","editor"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["editor"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["plugins"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






// Simulated articles data with extra details: score and publishedAt timestamp

const defaultArticles = [{
  id: 1,
  title: "Cum tehnologia influențează economia locală",
  link: "https://example.com/article1",
  score: 75,
  publishedAt: "2023-10-01T12:00:00Z"
}, {
  id: 2,
  title: "Tendințele modei în 2023: Ce să alegeți",
  link: "https://example.com/article2",
  score: 82,
  publishedAt: "2023-10-02T08:45:00Z"
}, {
  id: 3,
  title: "Impactul schimbărilor climatice asupra agriculturii",
  link: "https://example.com/article3",
  score: 67,
  publishedAt: "2023-09-28T16:30:00Z"
}, {
  id: 4,
  title: "Inovații în domeniul sănătății: Noi soluții medicale",
  link: "https://example.com/article4",
  score: 90,
  publishedAt: "2023-10-03T10:15:00Z"
}, {
  id: 5,
  title: "Povești inspiraționale din lumea afacerilor",
  link: "https://example.com/article5",
  score: 78,
  publishedAt: "2023-09-30T14:20:00Z"
}, {
  id: 6,
  title: "Previziuni pentru piața imobiliară din 2024",
  link: "https://example.com/article6",
  score: 85,
  publishedAt: "2023-10-04T09:00:00Z"
}, {
  id: 7,
  title: "Sfaturi pentru economisirea energiei în gospodărie",
  link: "https://example.com/article7",
  score: 72,
  publishedAt: "2023-09-29T18:10:00Z"
}, {
  id: 8,
  title: "Top destinații de vacanță pentru aventurieri",
  link: "https://example.com/article8",
  score: 88,
  publishedAt: "2023-10-05T11:30:00Z"
}, {
  id: 9,
  title: "Recenzii: Cele mai bune gadgeturi ale momentului",
  link: "https://example.com/article9",
  score: 80,
  publishedAt: "2023-09-27T13:45:00Z"
}, {
  id: 10,
  title: "Bucătăria tradițională: Rețete autentice românești",
  link: "https://example.com/article10",
  score: 76,
  publishedAt: "2023-10-06T15:25:00Z"
}];

// Updated helper to format the published date
const formatDate = publishedAt => {
  const date = new Date(publishedAt);
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
const SidebarPanel = () => {
  // Use the new useEntityProp hook instead of useSelect/useDispatch
  const [meta, setMeta] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.useEntityProp)('postType', 'post', 'meta');

  // Debug logs
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    console.log("Current meta state:", meta);
  }, [meta]);

  // Parse the selected articles from the string in meta
  const selectedArticles = (() => {
    try {
      return JSON.parse(meta.zdg_related_articles || '[]');
    } catch (e) {
      console.error("Error parsing saved articles", e);
      return [];
    }
  })();
  const relatedEnabled = meta.zdg_related_enabled || false;

  // Local state for article list and fetching state
  const [fetching, setFetching] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [articles, setArticles] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(defaultArticles);

  // Update the toggle
  const toggleRelatedEnabled = value => {
    setMeta({
      ...meta,
      zdg_related_enabled: value
    });
  };

  // Update the article selection
  const toggleArticle = id => {
    const newSelection = selectedArticles.includes(id) ? selectedArticles.filter(articleId => articleId !== id) : [...selectedArticles, id];
    console.log("Setting new selection:", newSelection);
    setMeta({
      ...meta,
      zdg_related_articles: JSON.stringify(newSelection)
    });
  };
  const fetchSimilarArticles = () => {
    setFetching(true);
    console.log("Se obțin articole similare...");
    // Simulate API call delay and response update
    setTimeout(() => {
      // In real implementation, update articles via API response.
      setFetching(false);
      // ...existing code may update articles state...
    }, 1000);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_editor__WEBPACK_IMPORTED_MODULE_1__.PluginDocumentSettingPanel, {
    name: "zdg-related-panel",
    title: "Articole similare",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "Activeaz\u0103 articole similare",
      checked: relatedEnabled,
      onChange: toggleRelatedEnabled
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      isSecondary: true,
      onClick: fetchSimilarArticles,
      disabled: fetching,
      children: fetching ? "Se obține..." : "Obține articole similare"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      style: {
        marginTop: '20px'
      },
      children: articles.map(article => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        style: {
          marginBottom: '10px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
          label: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
            children: article.title
          }),
          checked: selectedArticles.includes(article.id),
          onChange: () => toggleArticle(article.id)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isSmall: true,
          onClick: () => window.open(article.link, '_blank'),
          children: "Deschide"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          style: {
            fontSize: '12px',
            color: '#555'
          },
          children: ["Similitudine: ", article.score, " | Publicat: ", formatDate(article.publishedAt)]
        })]
      }, article.id))
    })]
  });
};
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)('zdg-related-plugin', {
  render: SidebarPanel
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map