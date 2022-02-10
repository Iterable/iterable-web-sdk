(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "axios", "../request", "../users", "../inapp", "../constants", "./utils", "../utils/config"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("axios"), require("../request"), require("../users"), require("../inapp"), require("../constants"), require("./utils"), require("../utils/config"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.axios, global.request, global.users, global.inapp, global.constants, global.utils, global.config);
    global.authorization = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _axios, _request, _users, _inapp, _constants, _utils, _config) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _axios = _interopRequireDefault(_axios);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const ONE_MINUTE = 60000;

  function initialize(authToken, generateJWT) {
    const logLevel = _config.config.getConfig('logLevel');

    if (!generateJWT && _constants.IS_PRODUCTION) {
      /* only let people use non-JWT mode if running the app locally */
      if (logLevel === 'verbose') {
        return console.error('Please provide a Promise method for generating a JWT token.');
      }

      return;
    }

    let timer = null;
    /* 
      only set token interceptor if we're using a non-JWT key.
      Otherwise, we'll set it later once we generate the JWT
    */

    let authInterceptor = generateJWT ? null : _request.baseAxiosRequest.interceptors.request.use(config => _objectSpread(_objectSpread({}, config), {}, {
      headers: _objectSpread(_objectSpread({}, config.headers), {}, {
        'Api-Key': authToken
      })
    }));
    let userInterceptor = null;
    let responseInterceptor = null;
    /**
      method that sets a timer one minute before JWT expiration
       @param { string } jwt - JWT token to decode
      @param { (...args: any ) => Promise<any> } callback - promise to invoke before expiry
    */

    const handleTokenExpiration = (jwt, callback) => {
      const expTime = (0, _utils.getEpochExpiryTimeInMS)(jwt);
      const millisecondsToExpired = (0, _utils.getEpochDifferenceInMS)(Date.now(), expTime);
      timer = setTimeout(() => {
        if (timer) {
          /* clear existing timeout on JWT refresh */
          clearTimeout(timer);
        }
        /* get new token */


        return callback().catch(e => {
          console.warn(e);
          console.warn('Could not refresh JWT. Try identifying the user again.');
        });
        /* try to refresh one minute until expiry */
      }, millisecondsToExpired - ONE_MINUTE);
    };

    const addEmailToRequest = email => {
      userInterceptor = _request.baseAxiosRequest.interceptors.request.use(config => {
        /* 
          endpoints that use _currentEmail_ payload prop in POST/PUT requests 
        */
        if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/updateEmail/gim)) {
          return _objectSpread(_objectSpread({}, config), {}, {
            data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
              currentEmail: email
            })
          });
        }
        /*
          endpoints that use _email_ payload prop in POST/PUT requests 
        */


        if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/(users\/update)|(events\/trackInApp)|(events\/inAppConsume)|(events\/track)/gim)) {
          return _objectSpread(_objectSpread({}, config), {}, {
            data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
              email
            })
          });
        }
        /*
          endpoints that use _userId_ payload prop in POST/PUT requests nested in { user: {} }
        */


        if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/(commerce\/updateCart)|(commerce\/trackPurchase)/gim)) {
          return _objectSpread(_objectSpread({}, config), {}, {
            data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
              user: _objectSpread(_objectSpread({}, config.data.user || {}), {}, {
                email
              })
            })
          });
        }
        /*
          endpoints that use _email_ query param in GET requests
        */


        if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/getMessages/gim)) {
          return _objectSpread(_objectSpread({}, config), {}, {
            params: _objectSpread(_objectSpread({}, config.params || {}), {}, {
              email
            })
          });
        }

        return config;
      });
    };

    if (!generateJWT) {
      /* we want to set a normal non-JWT enabled API key */
      return {
        setNewAuthToken: newToken => {
          if (typeof authInterceptor === 'number') {
            /* clear previously cached interceptor function */
            _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
          }

          authInterceptor = _request.baseAxiosRequest.interceptors.request.use(config => _objectSpread(_objectSpread({}, config), {}, {
            headers: _objectSpread(_objectSpread({}, config.headers), {}, {
              'Api-Key': newToken
            })
          }));
        },
        clearAuthToken: () => {
          /* might be 0 which is a falsy value */
          if (typeof authInterceptor === 'number') {
            /* clear previously cached interceptor function */
            _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
          }
        },
        setEmail: email => {
          (0, _inapp.clearMessages)();

          if (typeof userInterceptor === 'number') {
            _request.baseAxiosRequest.interceptors.request.eject(userInterceptor);
          }
          /* 
            endpoints that use _currentEmail_ payload prop in POST/PUT requests 
          */


          addEmailToRequest(email);
        },
        setUserID: async userId => {
          (0, _inapp.clearMessages)();

          if (typeof userInterceptor === 'number') {
            _request.baseAxiosRequest.interceptors.request.eject(userInterceptor);
          }
          /*
            endpoints that use _userId_ payload prop in POST/PUT requests 
          */


          userInterceptor = _request.baseAxiosRequest.interceptors.request.use(config => {
            if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/updateEmail/gim)) {
              return _objectSpread(_objectSpread({}, config), {}, {
                data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
                  currentUserId: userId
                })
              });
            }
            /*
              endpoints that use _userId_ payload prop in POST/PUT requests 
            */


            if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/(users\/update)|(events\/trackInApp)|(events\/inAppConsume)|(events\/track)/gim)) {
              return _objectSpread(_objectSpread({}, config), {}, {
                data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
                  userId
                })
              });
            }
            /*
              endpoints that use _userId_ payload prop in POST/PUT requests nested in { user: {} }
            */


            if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/(commerce\/updateCart)|(commerce\/trackPurchase)/gim)) {
              return _objectSpread(_objectSpread({}, config), {}, {
                data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
                  user: _objectSpread(_objectSpread({}, config.data.user || {}), {}, {
                    userId
                  })
                })
              });
            }
            /*
              endpoints that use _userId_ query param in GET requests
            */


            if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/getMessages/gim)) {
              return _objectSpread(_objectSpread({}, config), {}, {
                params: _objectSpread(_objectSpread({}, config.params || {}), {}, {
                  userId
                })
              });
            }

            return config;
          });

          const tryUser = () => {
            let createUserAttempts = 0;
            return async function tryUserNTimes() {
              try {
                return await (0, _users.updateUser)({});
              } catch (e) {
                if (createUserAttempts < _constants.RETRY_USER_ATTEMPTS) {
                  createUserAttempts += 1;
                  return tryUserNTimes();
                }

                return Promise.reject(`could not create user after ${createUserAttempts} tries`);
              }
            };
          };

          try {
            return await tryUser()();
          } catch (e) {
            /* failed to create a new user. Just silently resolve */
            return Promise.resolve();
          }
        },
        logout: () => {
          /* clear fetched in-app messages */
          (0, _inapp.clearMessages)();

          if (typeof authInterceptor === 'number') {
            /* stop adding auth token to requests */
            _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
          }

          if (typeof userInterceptor === 'number') {
            /* stop adding JWT to requests */
            _request.baseAxiosRequest.interceptors.request.eject(userInterceptor);
          }
        }
      };
    }
    /* 
      We're using a JWT enabled API key
      callback is assumed to be some sort of GET /api/generate-jwt 
    */


    const doRequest = payload => {
      /* clear any token interceptor if any exists */
      if (typeof authInterceptor === 'number') {
        _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
      }

      if (typeof responseInterceptor === 'number') {
        _request.baseAxiosRequest.interceptors.response.eject(responseInterceptor);
      }

      return generateJWT(payload).then(token => {
        /* set JWT token and auth token headers */
        authInterceptor = _request.baseAxiosRequest.interceptors.request.use(config => _objectSpread(_objectSpread({}, config), {}, {
          headers: _objectSpread(_objectSpread({}, config.headers), {}, {
            'Api-Key': authToken,
            Authorization: `Bearer ${token}`
          })
        }));
        responseInterceptor = _request.baseAxiosRequest.interceptors.response.use(config => {
          var _config$config$url;

          if ((_config$config$url = config.config.url) !== null && _config$config$url !== void 0 && _config$config$url.match(/users\/updateEmail/gim)) {
            try {
              var _JSON$parse;

              /* 
                if the customer just called the POST /users/updateEmail 
                that means their JWT needs to be updated to include this new
                email as well, so we run their JWT generation method and
                set a new token on the axios interceptor
              */
              const newEmail = (_JSON$parse = JSON.parse(config.config.data)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.newEmail;
              return generateJWT({
                email: newEmail
              }).then(newToken => {
                /* 
                  clear any existing interceptors that are adding user info 
                  or API keys
                */
                if (typeof authInterceptor === 'number') {
                  /* stop adding auth token to requests */
                  _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
                }

                if (typeof userInterceptor === 'number') {
                  /* stop adding JWT to requests */
                  _request.baseAxiosRequest.interceptors.request.eject(userInterceptor);
                }
                /* add the new JWT to all outgoing requests */


                authInterceptor = _request.baseAxiosRequest.interceptors.request.use(config => _objectSpread(_objectSpread({}, config), {}, {
                  headers: _objectSpread(_objectSpread({}, config.headers), {}, {
                    Api_Key: authToken,
                    Authorization: `Bearer ${newToken}`
                  })
                }));
                /* add the new email to all outgoing requests  */

                addEmailToRequest(newEmail);
                /* 
                  set up a new timer for when the JWT expires to regenerate 
                  a new one encoded with the new email address.
                */

                /* 
                  important here to clear the timer first since there was one set up 
                  previously the first time the JWT was generated.
                */

                if (timer) {
                  clearTimeout(timer);
                }

                handleTokenExpiration(newToken, () => {
                  /* re-run the JWT generation */
                  return doRequest({
                    email: newEmail
                  }).catch(e => {
                    console.warn(e);
                    console.warn('Could not refresh JWT. Try identifying the user again.');
                  });
                });
                return config;
              });
            } catch {
              return config;
            }
          }

          return config;
        }, error => {
          var _error$response;

          /*
            adds a status code 401 callback to try and get a new JWT
            key if the Iterable API told us the JWT is invalid.
          */
          if ((error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401) {
            return generateJWT(payload).then(newToken => {
              if (authInterceptor) {
                _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
              }

              authInterceptor = _request.baseAxiosRequest.interceptors.request.use(config => _objectSpread(_objectSpread({}, config), {}, {
                headers: _objectSpread(_objectSpread({}, config.headers), {}, {
                  'Api-Key': authToken,
                  Authorization: `Bearer ${newToken}`
                })
              }));
              /*
                finally, after the new JWT is generated, try the original
                request that failed again.
              */

              return (0, _axios.default)(_objectSpread(_objectSpread({}, error.config), {}, {
                headers: _objectSpread(_objectSpread(_objectSpread({}, error.config.headers), _constants.STATIC_HEADERS), {}, {
                  'Api-Key': authToken,
                  Authorization: `Bearer ${newToken}`
                })
              }));
            }).catch(e => {
              /*
                if the JWT generation failed, 
                just abort with a Promise rejection.
              */
              return Promise.reject(e);
            });
          }

          return Promise.reject(error);
        });
        handleTokenExpiration(token, () => {
          /* re-run the JWT generation */
          return doRequest(payload).catch(e => {
            if (logLevel === 'verbose') {
              console.warn(e);
              console.warn('Could not refresh JWT. Try identifying the user again.');
            }
          });
        });
        return token;
      }).catch(error => {
        /* clear interceptor */
        if (typeof authInterceptor === 'number') {
          _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }

        return Promise.reject(error);
      });
    };

    return {
      clearRefresh: () => {
        if (timer) {
          clearTimeout(timer);
        }
      },
      setEmail: email => {
        /* clear previous user */
        (0, _inapp.clearMessages)();

        if (typeof userInterceptor === 'number') {
          _request.baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }

        addEmailToRequest(email);
        return doRequest({
          email
        }).catch(e => {
          if (logLevel === 'verbose') {
            console.warn('Could not generate JWT after calling setEmail. Please try calling setEmail again.');
          }

          return Promise.reject(e);
        });
      },
      setUserID: async userId => {
        (0, _inapp.clearMessages)();

        if (typeof userInterceptor === 'number') {
          _request.baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }
        /*
          endpoints that use _userId_ payload prop in POST/PUT requests 
        */


        userInterceptor = _request.baseAxiosRequest.interceptors.request.use(config => {
          if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/updateEmail/gim)) {
            return _objectSpread(_objectSpread({}, config), {}, {
              data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
                currentUserId: userId
              })
            });
          }
          /*
            endpoints that use _userId_ payload prop in POST/PUT requests 
          */


          if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/(users\/update)|(events\/trackInApp)|(events\/inAppConsume)|(events\/track)/gim)) {
            return _objectSpread(_objectSpread({}, config), {}, {
              data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
                userId
              })
            });
          }
          /*
            endpoints that use _userId_ payload prop in POST/PUT requests nested in { user: {} }
          */


          if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/(commerce\/updateCart)|(commerce\/trackPurchase)/gim)) {
            return _objectSpread(_objectSpread({}, config), {}, {
              data: _objectSpread(_objectSpread({}, config.data || {}), {}, {
                user: _objectSpread(_objectSpread({}, config.data.user || {}), {}, {
                  userId
                })
              })
            });
          }
          /*
            endpoints that use _userId_ query param in GET requests
          */


          if (!!((config === null || config === void 0 ? void 0 : config.url) || '').match(/getMessages/gim)) {
            return _objectSpread(_objectSpread({}, config), {}, {
              params: _objectSpread(_objectSpread({}, config.params || {}), {}, {
                userId
              })
            });
          }

          return config;
        });

        const tryUser = () => {
          let createUserAttempts = 0;
          return async function tryUserNTimes() {
            try {
              return await (0, _users.updateUser)({});
            } catch (e) {
              if (createUserAttempts < _constants.RETRY_USER_ATTEMPTS) {
                createUserAttempts += 1;
                return tryUserNTimes();
              }

              return Promise.reject(`could not create user after ${createUserAttempts} tries`);
            }
          };
        };

        return doRequest({
          userID: userId
        }).then(async token => {
          await tryUser()();
          return token;
        }).catch(e => {
          if (logLevel === 'verbose') {
            console.warn('Could not generate JWT after calling setUserID. Please try calling setUserID again.');
          }

          return Promise.reject(e);
        });
      },
      logout: () => {
        /* clear fetched in-app messages */
        (0, _inapp.clearMessages)();

        if (timer) {
          /* prevent any refreshing of JWT */
          clearTimeout(timer);
        }

        if (typeof authInterceptor === 'number') {
          /* stop adding auth token to requests */
          _request.baseAxiosRequest.interceptors.request.eject(authInterceptor);
        }

        if (typeof userInterceptor === 'number') {
          /* stop adding JWT to requests */
          _request.baseAxiosRequest.interceptors.request.eject(userInterceptor);
        }
      }
    };
  }
});