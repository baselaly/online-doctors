webpackJsonp([6],{

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(50)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {};
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    category: {
      required: true,
      type: Object
    },
    loading: {
      required: true,
      type: Boolean,
      default: true
    }
  },
  created: function created() {},

  methods: {
    closeDialog: function closeDialog() {
      this.$emit("close-view-dialog");
    }
  }
});

/***/ }),

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: { persistent: "", "max-width": "400px" },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _vm.loading
        ? _c(
            "v-card",
            { staticStyle: { padding: "50px", "text-align": "center" } },
            [
              _c("v-progress-circular", {
                attrs: { indeterminate: "", size: 70, width: 7, color: "amber" }
              })
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      !_vm.loading
        ? _c(
            "v-card",
            [
              _c(
                "v-layout",
                {
                  attrs: {
                    wrap: "",
                    "justify-space-around": "",
                    "align-center": ""
                  }
                },
                [
                  _c("v-card-title", {
                    staticStyle: { "text-align": "center" }
                  }),
                  _vm._v(" "),
                  _c(
                    "v-card-text",
                    [
                      _c(
                        "v-flex",
                        {
                          staticClass: "textCenter",
                          attrs: { xs12: "", title: "" }
                        },
                        [_vm._v(_vm._s(_vm.category.name))]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    [
                      _c("v-spacer"),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { color: "red" },
                          on: { click: _vm.closeDialog }
                        },
                        [_vm._v("Close")]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-22cdd321", module.exports)
  }
}

/***/ }),

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(103)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(105)
/* template */
var __vue_template__ = __webpack_require__(106)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\admin\\category_dialogs\\deleteCategory.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1daf0ba7", Component.options)
  } else {
    hotAPI.reload("data-v-1daf0ba7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 103:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(104);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("72669e68", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1daf0ba7\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./deleteCategory.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1daf0ba7\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./deleteCategory.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {};
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    categoryId: {
      required: true
    }
  },
  created: function created() {},

  methods: {
    closeDialog: function closeDialog() {
      this.$emit("close-delete-dialog", false);
    },
    deleteCategory: function deleteCategory() {
      var _this = this;

      var token = localStorage.getItem("token");
      axios.get("/api/admin/category/delete/" + this.categoryId, {
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        _this.$emit("close-delete-dialog", true);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
});

/***/ }),

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: { persistent: "", "max-width": "400px" },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _c(
        "v-card",
        [
          _c("v-card-title", { staticClass: "headline" }, [
            _vm._v("Are you sure you want to delete that category?")
          ]),
          _vm._v(" "),
          _c(
            "v-card-actions",
            [
              _c("v-spacer"),
              _vm._v(" "),
              _c(
                "v-btn",
                { attrs: { color: "red" }, on: { click: _vm.closeDialog } },
                [_vm._v("close")]
              ),
              _vm._v(" "),
              _c(
                "v-btn",
                {
                  attrs: { color: "green darken-1" },
                  on: { click: _vm.deleteCategory }
                },
                [_vm._v("Delete")]
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1daf0ba7", module.exports)
  }
}

/***/ }),

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-container",
    [
      _c(
        "v-layout",
        { attrs: { row: "", wrap: "" } },
        [
          _c(
            "v-flex",
            { attrs: { lg10: "", "category-table": "" } },
            [
              _c(
                "v-card",
                [
                  _c(
                    "v-card-title",
                    [
                      _c(
                        "v-chip",
                        {
                          attrs: {
                            color: "white",
                            large: "",
                            "text-color": "black"
                          }
                        },
                        [_vm._v("Categories")]
                      ),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { fab: "", dark: "", color: "indigo" },
                          on: { click: _vm.show_add_dialog }
                        },
                        [
                          _c("v-icon", { attrs: { dark: "" } }, [_vm._v("add")])
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("v-spacer"),
                      _vm._v(" "),
                      _c("v-text-field", {
                        attrs: {
                          "append-icon": "search",
                          label: "Search",
                          "single-line": "",
                          "hide-details": ""
                        },
                        model: {
                          value: _vm.search,
                          callback: function($$v) {
                            _vm.search = $$v
                          },
                          expression: "search"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-data-table",
                    {
                      attrs: {
                        headers: _vm.headers,
                        items: _vm.categories,
                        search: _vm.search,
                        dark: "",
                        loading: _vm.loading
                      },
                      scopedSlots: _vm._u([
                        {
                          key: "items",
                          fn: function(props) {
                            return [
                              _c("td", { staticClass: "text-xs-left" }, [
                                _vm._v(_vm._s(props.item.name))
                              ]),
                              _vm._v(" "),
                              _c(
                                "td",
                                [
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: {
                                        fab: "",
                                        dark: "",
                                        small: "",
                                        color: "success"
                                      },
                                      on: {
                                        click: function($event) {
                                          _vm.show_view_dialog(props.item.id)
                                        }
                                      }
                                    },
                                    [
                                      _c("v-icon", { attrs: { dark: "" } }, [
                                        _vm._v("visibility")
                                      ])
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: {
                                        fab: "",
                                        dark: "",
                                        small: "",
                                        color: "cyan"
                                      },
                                      on: {
                                        click: function($event) {
                                          _vm.show_edit_dialog(props.item.id)
                                        }
                                      }
                                    },
                                    [
                                      _c("v-icon", { attrs: { dark: "" } }, [
                                        _vm._v("edit")
                                      ])
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: {
                                        fab: "",
                                        dark: "",
                                        small: "",
                                        color: "red"
                                      },
                                      on: {
                                        click: function($event) {
                                          _vm.show_delete_dialog(props.item.id)
                                        }
                                      }
                                    },
                                    [
                                      _c("v-icon", { attrs: { dark: "" } }, [
                                        _vm._v("delete")
                                      ])
                                    ],
                                    1
                                  )
                                ],
                                1
                              )
                            ]
                          }
                        }
                      ])
                    },
                    [
                      _c(
                        "v-alert",
                        {
                          attrs: {
                            slot: "no-results",
                            value: true,
                            color: "error",
                            icon: "warning"
                          },
                          slot: "no-results"
                        },
                        [
                          _vm._v(
                            '\r\n        Your search for "' +
                              _vm._s(_vm.search) +
                              '" found no results.\r\n      '
                          )
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-snackbar",
        {
          attrs: { color: _vm.snackbarColor },
          model: {
            value: _vm.snackbar,
            callback: function($$v) {
              _vm.snackbar = $$v
            },
            expression: "snackbar"
          }
        },
        [_vm._v("\r\n        " + _vm._s(_vm.snackbarMessage) + "\r\n      ")]
      ),
      _vm._v(" "),
      _c("add-category", {
        attrs: { dialog: _vm.add_dialog },
        on: { "close-add-dialog": _vm.close_add_dialog }
      }),
      _vm._v(" "),
      _c("view-category", {
        attrs: {
          dialog: _vm.view_dialog,
          loading: _vm.viewCategory_loading,
          category: _vm.viewCategory
        },
        on: { "close-view-dialog": _vm.close_view_dialog }
      }),
      _vm._v(" "),
      _c("delete-category", {
        attrs: {
          dialog: _vm.delete_dialog,
          categoryId: _vm.deleted_category_id
        },
        on: { "close-delete-dialog": _vm.close_delete_dialog }
      }),
      _vm._v(" "),
      _c("editCategory", {
        attrs: {
          dialog: _vm.edit_dialog,
          category: _vm.viewCategory,
          loading: _vm.editCategory_loading
        },
        on: { "close-edit-dialog": _vm.close_edit_dialog }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4d74bfa0", module.exports)
  }
}

/***/ }),

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(128)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(130)
/* template */
var __vue_template__ = __webpack_require__(131)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\admin\\category_dialogs\\editCategory.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-22c31706", Component.options)
  } else {
    hotAPI.reload("data-v-22c31706", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(129);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("87fcc668", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-22c31706\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./editCategory.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-22c31706\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./editCategory.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 129:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.second_flex {\r\n  margin-left: 20px;\n}\n.snackbar_style {\r\n  top: 100px;\n}\ninput[type=\"file\"] {\r\n  display: none;\n}\n.custom-file-upload {\r\n  border: 1px solid #ccc;\r\n  display: inline-block;\r\n  padding: 6px 12px;\r\n  cursor: pointer;\n}\r\n", ""]);

// exports


/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      formValid: true,
      requiredRules: [function (v) {
        return !!v || "this field is required";
      }]
    };
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    loading: {
      default: true,
      type: Boolean,
      required: true
    },
    category: {
      required: true,
      type: Object
    }
  },
  created: function created() {},

  methods: {
    closeDialog: function closeDialog() {
      this.$emit("close-edit-dialog", false);
    },
    editCategory: function editCategory() {
      var _this = this;

      if (this.formValid) {
        var token = localStorage.getItem("token");
        axios.post("/api/admin/category/edit/" + this.category.id, this.category, {
          headers: {
            Authorization: "Bearer " + token
          }
        }).then(function (response) {
          _this.$emit("close-edit-dialog", true);
        }).catch(function (error) {
          _this.activateSnackbar(true, "red", "something went wrong");
        });
      } else {
        this.activateSnackbar(true, "red", "please enter valid data");
      }
    },
    activateSnackbar: function activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    }
  }
});

/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: { persistent: "", "max-width": "600px" },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _vm.loading
        ? _c(
            "v-card",
            { staticStyle: { padding: "50px", "text-align": "center" } },
            [
              _c("v-progress-circular", {
                attrs: { indeterminate: "", size: 70, width: 7, color: "amber" }
              })
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      !_vm.loading
        ? _c(
            "v-card",
            [
              _c("v-card-title", [
                _c("span", { staticClass: "headline" }, [
                  _vm._v("Edit Category")
                ])
              ]),
              _vm._v(" "),
              _c(
                "v-card-text",
                [
                  _c(
                    "v-form",
                    {
                      model: {
                        value: _vm.formValid,
                        callback: function($$v) {
                          _vm.formValid = $$v
                        },
                        expression: "formValid"
                      }
                    },
                    [
                      _c(
                        "v-container",
                        [
                          _c(
                            "v-layout",
                            { attrs: { row: "", wrap: "" } },
                            [
                              _c("v-text-field", {
                                attrs: {
                                  hint: "enter your category",
                                  rules: _vm.requiredRules,
                                  label: "Category name"
                                },
                                model: {
                                  value: _vm.category.name,
                                  callback: function($$v) {
                                    _vm.$set(_vm.category, "name", $$v)
                                  },
                                  expression: "category.name"
                                }
                              }),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs12: "" } },
                                [
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: {
                                        color: "info",
                                        disabled: !_vm.formValid
                                      },
                                      on: { click: _vm.editCategory }
                                    },
                                    [_vm._v("Save")]
                                  )
                                ],
                                1
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-card-actions",
                [
                  _c("v-spacer"),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    { attrs: { color: "red" }, on: { click: _vm.closeDialog } },
                    [_vm._v("Close")]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-snackbar",
                {
                  staticClass: "snackbar_style",
                  attrs: { top: "", color: _vm.snackbarColor },
                  model: {
                    value: _vm.snackbar,
                    callback: function($$v) {
                      _vm.snackbar = $$v
                    },
                    expression: "snackbar"
                  }
                },
                [_vm._v("\n      " + _vm._s(_vm.snackbarMessage) + "\n    ")]
              )
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-22c31706", module.exports)
  }
}

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 50:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 88:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(89)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(91)
/* template */
var __vue_template__ = __webpack_require__(107)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\admin\\categories.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4d74bfa0", Component.options)
  } else {
    hotAPI.reload("data-v-4d74bfa0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(90);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("b92a1baa", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4d74bfa0\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./categories.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4d74bfa0\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./categories.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.category-table {\r\n  margin-top: 50px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ 91:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__category_dialogs_addCategory__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__category_dialogs_addCategory___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__category_dialogs_addCategory__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__category_dialogs_viewCategory__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__category_dialogs_viewCategory___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__category_dialogs_viewCategory__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__category_dialogs_deleteCategory__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__category_dialogs_deleteCategory___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__category_dialogs_deleteCategory__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__category_dialogs_editCategory__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__category_dialogs_editCategory___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__category_dialogs_editCategory__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    addCategory: __WEBPACK_IMPORTED_MODULE_0__category_dialogs_addCategory___default.a,
    viewCategory: __WEBPACK_IMPORTED_MODULE_1__category_dialogs_viewCategory___default.a,
    deleteCategory: __WEBPACK_IMPORTED_MODULE_2__category_dialogs_deleteCategory___default.a,
    editCategory: __WEBPACK_IMPORTED_MODULE_3__category_dialogs_editCategory___default.a
  },
  data: function data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      //categories table
      categories: [],
      search: "",
      headers: [{ text: "name", value: "name" }, { text: "actions", value: "" }],
      loading: true,
      defaultCategory: {
        name: ""
      },
      // add category
      add_dialog: false,
      //view category
      view_dialog: false,
      viewCategory: {
        name: ""
      },
      viewCategory_loading: true,
      //delete category
      delete_dialog: false,
      deleted_category_id: "",
      //edit category
      edit_dialog: false,
      editCategory_loading: true
    };
  },
  created: function created() {
    this.getCategories();
  },

  methods: {
    getCategories: function getCategories() {
      var _this = this;

      var token = localStorage.getItem("token");
      axios.get("/api/admin/category/getAll", {
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        _this.categories = response.data.categories;
        _this.loading = false;
      }).catch(function (error) {
        console.log(error);
      });
    },
    activateSnackbar: function activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    },

    //add dialog
    show_add_dialog: function show_add_dialog() {
      this.add_dialog = true;
    },
    close_add_dialog: function close_add_dialog(state) {
      if (state == false) {
        this.add_dialog = false;
      } else if (state == true) {
        this.add_dialog = false;
        this.activateSnackbar(true, "green darken-2", "user added successfuly");
        this.getCategories();
      }
    },

    //view dialog
    show_view_dialog: function show_view_dialog(category_id) {
      var _this2 = this;

      this.view_dialog = true;
      setTimeout(function () {
        _this2.viewCategory_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios.get("/api/admin/category/getById/" + category_id, {
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        _this2.viewCategory = response.data.category;
      }).catch(function (error) {
        console.log(error);
      });
    },
    close_view_dialog: function close_view_dialog() {
      var _this3 = this;

      this.view_dialog = false;
      setTimeout(function () {
        _this3.viewCategory_loading = true;
        _this3.viewCategory = _this3.defaultCategory;
      }, 500);
    },

    //delete dialog
    show_delete_dialog: function show_delete_dialog(id) {
      this.deleted_category_id = id;
      this.delete_dialog = true;
    },
    close_delete_dialog: function close_delete_dialog(state) {
      if (state == false) {
        this.delete_dialog = false;
      } else if (state == true) {
        this.delete_dialog = false;
        this.activateSnackbar(true, "green darken-2", "category deleted successfuly");
        this.getCategories();
      }
    },

    //edit dialog
    show_edit_dialog: function show_edit_dialog(category_id) {
      var _this4 = this;

      this.edit_dialog = true;
      setTimeout(function () {
        _this4.editCategory_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios.get("/api/admin/category/getById/" + category_id, {
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        _this4.viewCategory = response.data.category;
      }).catch(function (error) {
        console.log(error);
      });
    },
    close_edit_dialog: function close_edit_dialog(state) {
      var _this5 = this;

      if (state == true) {
        this.edit_dialog = false;
        this.activateSnackbar(true, "green darken-2", "category edited successfuly");
        this.getCategories();
        setTimeout(function () {
          _this5.editCategory_loading = true;
        }, 500);
      } else {
        this.edit_dialog = false;
        setTimeout(function () {
          _this5.editCategory_loading = true;
        }, 500);
      }
    }
  }
});

/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(93)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(95)
/* template */
var __vue_template__ = __webpack_require__(96)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\admin\\category_dialogs\\addCategory.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4e98605e", Component.options)
  } else {
    hotAPI.reload("data-v-4e98605e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("3ae804d0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4e98605e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./addCategory.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4e98605e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./addCategory.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.second_flex {\r\n  margin-left: 20px;\n}\n.snackbar_style {\r\n  top: 200px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      formValid: true,
      newCategory: {
        name: ""
      },
      requiredRules: [function (v) {
        return !!v || "this field is required";
      }]
    };
  },

  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  created: function created() {},

  methods: {
    closeDialog: function closeDialog() {
      this.$emit("close-add-dialog", false);
      this.clearForm();
    },
    addCategory: function addCategory() {
      var _this = this;

      if (this.formValid) {
        var token = localStorage.getItem("token");
        axios.post("/api/admin/category/add", this.newCategory, {
          headers: {
            Authorization: "Bearer " + token
          }
        }).then(function (response) {
          _this.clearForm();
          _this.$emit("close-add-dialog", true);
        }).catch(function (error) {
          _this.activateSnackbar(true, "red", "something went wrong");
        });
      } else {
        this.activateSnackbar(true, "red", "please enter valid data");
      }
    },
    clearForm: function clearForm() {
      this.newCategory.name = "";
    },
    activateSnackbar: function activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    }
  }
});

/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: { persistent: "", "max-width": "600px" },
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _c(
        "v-card",
        [
          _c("v-card-title", [
            _c("span", { staticClass: "headline" }, [_vm._v("Add Category")])
          ]),
          _vm._v(" "),
          _c(
            "v-card-text",
            [
              _c(
                "v-form",
                {
                  model: {
                    value: _vm.formValid,
                    callback: function($$v) {
                      _vm.formValid = $$v
                    },
                    expression: "formValid"
                  }
                },
                [
                  _c(
                    "v-container",
                    [
                      _c(
                        "v-layout",
                        { attrs: { row: "", wrap: "" } },
                        [
                          _c("v-text-field", {
                            attrs: {
                              hint: "enter your category name",
                              rules: _vm.requiredRules,
                              label: "Category name"
                            },
                            model: {
                              value: _vm.newCategory.name,
                              callback: function($$v) {
                                _vm.$set(_vm.newCategory, "name", $$v)
                              },
                              expression: "newCategory.name"
                            }
                          }),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { xs12: "" } },
                            [
                              _c(
                                "v-btn",
                                {
                                  attrs: {
                                    color: "info",
                                    disabled: !_vm.formValid
                                  },
                                  on: { click: _vm.addCategory }
                                },
                                [_vm._v("Save")]
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-card-actions",
            [
              _c("v-spacer"),
              _vm._v(" "),
              _c(
                "v-btn",
                { attrs: { color: "red" }, on: { click: _vm.closeDialog } },
                [_vm._v("Close")]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-snackbar",
            {
              staticClass: "snackbar_style",
              attrs: { top: "", color: _vm.snackbarColor },
              model: {
                value: _vm.snackbar,
                callback: function($$v) {
                  _vm.snackbar = $$v
                },
                expression: "snackbar"
              }
            },
            [_vm._v("\n      " + _vm._s(_vm.snackbarMessage) + "\n    ")]
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4e98605e", module.exports)
  }
}

/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(98)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(100)
/* template */
var __vue_template__ = __webpack_require__(101)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\admin\\category_dialogs\\viewCategory.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-22cdd321", Component.options)
  } else {
    hotAPI.reload("data-v-22cdd321", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(99);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("8f1fd60e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-22cdd321\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./viewCategory.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-22cdd321\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./viewCategory.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.userImage {\r\n  border: 3px solid white;\n}\n.textCenter {\r\n  text-align: center !important;\r\n  color: rgb(212, 212, 212);\n}\r\n", ""]);

// exports


/***/ })

});