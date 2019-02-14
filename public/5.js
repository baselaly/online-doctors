webpackJsonp([5],{

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(59)
}
var normalizeComponent = __webpack_require__(2)
/* script */
var __vue_script__ = __webpack_require__(61)
/* template */
var __vue_template__ = __webpack_require__(62)
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
Component.options.__file = "resources\\assets\\js\\components\\admin\\login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6f4b2d15", Component.options)
  } else {
    hotAPI.reload("data-v-6f4b2d15", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6bee7daf", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6f4b2d15\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6f4b2d15\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.content {\r\n  background: #06beb6; /* fallback for old browsers */ /* Chrome 10-25, Safari 5.1-6 */\r\n  background: -webkit-gradient(\r\n    linear,\r\n    left top, right top,\r\n    from(#48b1bf),\r\n    to(#06beb6)\r\n  );\r\n  background: linear-gradient(\r\n    to right,\r\n    #48b1bf,\r\n    #06beb6\r\n  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */\r\n  color: rgb(255, 255, 255);\n}\n.mt {\r\n  margin-top: 150px;\n}\n.card-style {\r\n  padding: 15px;\n}\n.center-who {\r\n  text-align: center;\n}\r\n", ""]);

// exports


/***/ }),

/***/ 61:
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
      snackbarMessage: "",
      snackbarColor: "",
      snackbar: false,
      passwordHide: true,
      formValid: true,
      email: "",
      password: "",
      passwordRules: [function (v) {
        return !!v || "password is required";
      }],
      emailRules: [function (v) {
        return !!v || "Email is required";
      }, function (v) {
        return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Email must be valid"
        );
      }]
    };
  },

  methods: {
    validate_email: function validate_email() {
      this.emailErrors = [];
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        return true;
      } else {
        this.emailErrors.push("error");
        return false;
      }
    },
    validate_password: function validate_password() {
      this.passwordErrors = [];
      if (this.password !== "" && this.password) {
        return true;
      } else {
        this.passwordErrors.push("error");
        return false;
      }
    },
    login: function login() {
      var _this = this;

      this.validate_email();
      this.validate_password();
      if (this.emailErrors.length == 0 && this.passwordErrors.length == 0) {
        axios.post("/api/admin/login", {
          email: this.email,
          password: this.password
        }).then(function (response) {
          localStorage.setItem("token", response.data.token);
          _this.$router.push("/admin");
        }).catch(function (error) {
          if (error.message == "Request failed with status code 422") {
            _this.activateSnackbar(true, "red", "please check your info");
          } else if (error.message == "Request failed with status code 401") {
            _this.activateSnackbar(true, "red", "wrong Email or password");
          } else {
            _this.activateSnackbar(true, "red", "something went wrong");
          }
        });
      } else {
        if (this.emailErrors.length != 0) {
          this.activateSnackbar(true, "red", "please check your email");
        } else if (this.passwordErrors.length != 0) {
          this.activateSnackbar(true, "red", "please check your password");
        }
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

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-app",
    [
      _c(
        "v-content",
        [
          _c(
            "v-container",
            [
              _c(
                "v-flex",
                { attrs: { xs10: "", lg4: "", "mx-auto": "", mt: "" } },
                [
                  _c(
                    "v-flex",
                    { attrs: { "center-who": "", "display-2": "" } },
                    [
                      _vm._v(
                        "\r\n                        who's there?\r\n                    "
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "v-card",
                    { staticClass: "card-style" },
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
                          _c("v-text-field", {
                            attrs: {
                              hint: "enter your email",
                              rules: _vm.emailRules,
                              label: "Email"
                            },
                            model: {
                              value: _vm.email,
                              callback: function($$v) {
                                _vm.email = $$v
                              },
                              expression: "email"
                            }
                          }),
                          _vm._v(" "),
                          _c("v-text-field", {
                            attrs: {
                              hint: "enter your password",
                              rules: _vm.passwordRules,
                              type: _vm.passwordHide ? "password" : "text",
                              "append-icon": _vm.passwordHide
                                ? "visibility"
                                : "visibility_off",
                              "append-icon-cb": function() {
                                return (_vm.passwordHide = !_vm.passwordHide)
                              },
                              label: "Password"
                            },
                            model: {
                              value: _vm.password,
                              callback: function($$v) {
                                _vm.password = $$v
                              },
                              expression: "password"
                            }
                          }),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                color: "info",
                                disabled: !_vm.formValid
                              },
                              on: { click: _vm.login }
                            },
                            [_vm._v("login")]
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
                [
                  _vm._v(
                    "\r\n                    " +
                      _vm._s(_vm.snackbarMessage) +
                      "\r\n                    "
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
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6f4b2d15", module.exports)
  }
}

/***/ })

});