import{a as O}from"./react-BRgjg16M.js";var W={exports:{}},_={},j={exports:{}},z={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function g(){if(x)return z;x=1;var n=O();function h(e,r){return e===r&&(e!==0||1/e===1/r)||e!==e&&r!==r}var y=typeof Object.is=="function"?Object.is:h,E=n.useState,R=n.useEffect,b=n.useLayoutEffect,p=n.useDebugValue;function V(e,r){var u=r(),i=E({inst:{value:u,getSnapshot:r}}),t=i[0].inst,s=i[1];return b(function(){t.value=u,t.getSnapshot=r,c(t)&&s({inst:t})},[e,u,r]),R(function(){return c(t)&&s({inst:t}),e(function(){c(t)&&s({inst:t})})},[e]),p(u),u}function c(e){var r=e.getSnapshot;e=e.value;try{var u=r();return!y(e,u)}catch{return!0}}function o(e,r){return r()}var f=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?o:V;return z.useSyncExternalStore=n.useSyncExternalStore!==void 0?n.useSyncExternalStore:f,z}var U;function k(){return U||(U=1,j.exports=g()),j.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $;function C(){if($)return _;$=1;var n=O(),h=k();function y(o,f){return o===f&&(o!==0||1/o===1/f)||o!==o&&f!==f}var E=typeof Object.is=="function"?Object.is:y,R=h.useSyncExternalStore,b=n.useRef,p=n.useEffect,V=n.useMemo,c=n.useDebugValue;return _.useSyncExternalStoreWithSelector=function(o,f,e,r,u){var i=b(null);if(i.current===null){var t={hasValue:!1,value:null};i.current=t}else t=i.current;i=V(function(){function w(a){if(!S){if(S=!0,v=a,a=r(a),u!==void 0&&t.hasValue){var d=t.value;if(u(d,a))return m=d}return m=a}if(d=m,E(v,a))return d;var q=r(a);return u!==void 0&&u(d,q)?(v=a,d):(v=a,m=q)}var S=!1,v,m,l=e===void 0?null:e;return[function(){return w(f())},l===null?void 0:function(){return w(l())}]},[f,e,r,u]);var s=R(o,i[0],i[1]);return p(function(){t.hasValue=!0,t.value=s},[s]),c(s),s},_}var I;function A(){return I||(I=1,W.exports=C()),W.exports}var J=A(),D={exports:{}},M={};/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var G;function B(){if(G)return M;G=1;var n=O();function h(c,o){return c===o&&(c!==0||1/c===1/o)||c!==c&&o!==o}var y=typeof Object.is=="function"?Object.is:h,E=n.useSyncExternalStore,R=n.useRef,b=n.useEffect,p=n.useMemo,V=n.useDebugValue;return M.useSyncExternalStoreWithSelector=function(c,o,f,e,r){var u=R(null);if(u.current===null){var i={hasValue:!1,value:null};u.current=i}else i=u.current;u=p(function(){function s(l){if(!w){if(w=!0,S=l,l=e(l),r!==void 0&&i.hasValue){var a=i.value;if(r(a,l))return v=a}return v=l}if(a=v,y(S,l))return a;var d=e(l);return r!==void 0&&r(a,d)?(S=l,a):(S=l,v=d)}var w=!1,S,v,m=f===void 0?null:f;return[function(){return s(o())},m===null?void 0:function(){return s(m())}]},[o,f,e,r]);var t=E(c,u[0],u[1]);return b(function(){i.hasValue=!0,i.value=t},[t]),V(t),t},M}var L;function F(){return L||(L=1,D.exports=B()),D.exports}F();export{J as w};
