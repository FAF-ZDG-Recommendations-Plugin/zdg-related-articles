/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/** @typedef {{icon: JSX.Element, size?: number} & import('@wordpress/primitives').SVGProps} IconProps */

/**
 * Return an SVG icon.
 *
 * @param {IconProps}                                 props icon is the SVG component to render
 *                                                          size is a number specifying the icon size in pixels
 *                                                          Other props will be passed to wrapped SVG component
 * @param {import('react').ForwardedRef<HTMLElement>} ref   The forwarded ref to the SVG element.
 *
 * @return {JSX.Element}  Icon component
 */
function Icon({
  icon,
  size = 24,
  ...props
}, ref) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
    width: size,
    height: size,
    ...props,
    ref
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(Icon));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/external.js":
/*!************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/external.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */


const external = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, {
    d: "M19.5 4.5h-7V6h4.44l-5.97 5.97 1.06 1.06L18 7.06v4.44h1.5v-7Zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3V5.5h-3Z"
  })
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (external);
//# sourceMappingURL=external.js.map

/***/ }),

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

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

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

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

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
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/external.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);








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

  // Get the post content using useSelect
  const postContent = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => select('core/editor').getEditedPostAttribute('content'));

  // Debug logs
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {}, [meta]);

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
  const [articles, setArticles] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(selectedArticles);

  // State for start date selection
  const [startYear, setStartYear] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('2015');
  const [startMonth, setStartMonth] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('01');

  // Options for year selection (adjust as needed)
  const yearOptions = Array.from({
    length: new Date().getFullYear() - 2007
  }, (_, i) => {
    const year = 2008 + i;
    return {
      label: year.toString(),
      value: year.toString()
    };
  }).reverse();

  // Options for month selection
  const monthOptions = [{
    label: 'Ianuarie',
    value: '01'
  }, {
    label: 'Februarie',
    value: '02'
  }, {
    label: 'Martie',
    value: '03'
  }, {
    label: 'Aprilie',
    value: '04'
  }, {
    label: 'Mai',
    value: '05'
  }, {
    label: 'Iunie',
    value: '06'
  }, {
    label: 'Iulie',
    value: '07'
  }, {
    label: 'August',
    value: '08'
  }, {
    label: 'Septembrie',
    value: '09'
  }, {
    label: 'Octombrie',
    value: '10'
  }, {
    label: 'Noiembrie',
    value: '11'
  }, {
    label: 'Decembrie',
    value: '12'
  }];

  // Update the toggle
  const toggleRelatedEnabled = value => {
    setMeta({
      ...meta,
      zdg_related_enabled: value
    });
  };

  // Update the article selection - store complete article object
  const toggleArticle = article => {
    let newSelection;

    // Check if this article is already selected by comparing IDs
    const isSelected = selectedArticles.some(item => item.ID === article.ID);
    if (isSelected) {
      // Remove the article from selection
      newSelection = selectedArticles.filter(item => item.ID !== article.ID);
    } else {
      // Add the complete article object to selection
      newSelection = [...selectedArticles, article];
    }
    setMeta({
      ...meta,
      zdg_related_articles: JSON.stringify(newSelection)
    });
  };
  const fetchSimilarArticles = () => {
    setFetching(true);
    // Extract text content from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = postContent || '';
    const textContent = tempDiv.innerText.replace(/\s+/g, ' ').trim();

    // Get the IDs of already selected articles
    const selectedIds = selectedArticles.map(article => article.ID);
    fetch("http://localhost:5000/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query_text: textContent,
        top_k: 10,
        // Always fetch 10 articles
        start_date: `${startYear}-${startMonth}-01`,
        // Use selected start date
        end_date: ""
        // Removed exclude_ids since API doesn't support it
      })
    }).then(response => response.json()).then(data => {
      // Extract articles from the first element of the response array
      if (Array.isArray(data) && data.length >= 1) {
        const newArticlesData = data[0];

        // Filter out articles that are already selected
        const filteredNewArticles = newArticlesData.filter(newArticle => !selectedIds.includes(newArticle.ID));

        // Keep only enough new articles to have a total of 10 (including selected)
        const maxNewArticlesToAdd = Math.max(10 - selectedArticles.length, 0);
        const limitedNewArticles = filteredNewArticles.slice(0, maxNewArticlesToAdd);

        // Set articles to be the combination of selected and new filtered articles
        setArticles([...selectedArticles, ...limitedNewArticles]);
      } else {
        console.error("Unexpected API response format:", data);
      }
    }).catch(error => {
      console.error("Error fetching similar articles:", error);
    }).finally(() => {
      setFetching(false);
    });
  };

  // State for manual article link input
  const [manualArticleLink, setManualArticleLink] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const handleAddManualArticle = () => {
    if (manualArticleLink) {
      // Extract post name from the link (example: https://www.example.com/post-name/ -> post-name)
      const postName = manualArticleLink.split('/').filter(Boolean).pop();
      // Make an API request to a custom endpoint to fetch article data by post name
      fetch(`${zdgApi.baseUrl}zdg-related-articles/v1/article-by-name?post_name=${postName}`, {
        method: 'GET',
        headers: {
          'X-WP-Nonce': zdgApi.nonce
        }
      }).then(response => response.json()).then(data => {
        if (data && data.ID) {
          // Add the fetched article to selected articles
          toggleArticle(data);
          // Also add the article to the local articles state if not already included
          setArticles(prevArticles => {
            if (prevArticles.some(article => article.ID === data.ID)) {
              return prevArticles;
            }
            return [...prevArticles, data];
          });
          // Clear the input field
          setManualArticleLink('');
        } else {
          alert('Articolul nu a fost găsit.');
        }
      }).catch(error => {
        console.error("Error fetching article by post name:", error);
        alert('Eroare la căutarea articolului.');
      });
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_editor__WEBPACK_IMPORTED_MODULE_1__.PluginDocumentSettingPanel, {
    name: "zdg-related-panel",
    title: "Articole similare",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "Activeaz\u0103 articole similare",
      checked: relatedEnabled,
      onChange: toggleRelatedEnabled
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      style: {
        marginTop: '10px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
        htmlFor: "manual-article-link",
        style: {
          display: 'block',
          marginBottom: '5px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
          children: "Adaug\u0103 un articol manual (Link)"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          style: {
            flexGrow: '1'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
            id: "manual-article-link",
            placeholder: "https://www.zdg.com/articol",
            type: "url",
            value: manualArticleLink,
            onChange: newLink => setManualArticleLink(newLink),
            style: {
              width: '100%'
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isSecondary: true,
          onClick: handleAddManualArticle,
          style: {
            paddingBottom: '12px',
            marginLeft: '5px',
            marginBottom: '8px',
            width: '32px',
            height: '32px',
            fontSize: '30px',
            lineHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          children: "+"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      style: {
        marginTop: '5px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
        style: {
          display: 'block',
          marginBottom: '5px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
          children: "Caut\u0103 \xEEncep\xE2nd cu:"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        style: {
          width: 'fit-content'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            width: 'fit-content'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            value: startYear,
            options: yearOptions,
            onChange: newYear => setStartYear(newYear),
            style: {
              textAlign: 'center'
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            value: startMonth,
            options: monthOptions,
            onChange: newMonth => setStartMonth(newMonth),
            style: {
              textAlign: 'center'
            }
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          isSecondary: true,
          onClick: fetchSimilarArticles,
          disabled: fetching,
          style: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          },
          children: fetching ? "Se obține..." : "Obține articole similare"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("hr", {
      style: {
        marginTop: '10px',
        marginBottom: '10px'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      style: {
        marginTop: '10px'
      },
      children: articles.map(article => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        style: {
          marginBottom: '10px'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
          label: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
            children: article.title
          }),
          checked: selectedArticles.some(item => item.ID === article.ID),
          onChange: () => toggleArticle(article)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            // marginLeft: '26px', 
            fontSize: '12px',
            color: '#555'
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("span", {
            children: ["Similitudine: ", Math.round(article.score * 100), "% | Publicat: ", formatDate(article.date)]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            isSmall: true,
            onClick: () => window.open(article.url, '_blank'),
            variant: "link",
            style: {
              padding: '0'
            },
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_7__["default"], {
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_8__["default"]
            })
          })]
        })]
      }, article.ID))
    })]
  });
};

// registerPlugin('zdg-related-plugin', { render: SidebarPanel });
if (!window.zdgPluginRegistered) {
  (0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)("zdg-related-plugin", {
    render: SidebarPanel
  });
  window.zdgPluginRegistered = true;
}
})();

/******/ })()
;
//# sourceMappingURL=index.js.map