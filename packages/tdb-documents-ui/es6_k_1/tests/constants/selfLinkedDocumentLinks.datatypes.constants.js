"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VIEW_CONFIG = exports.EDIT_CONFIG = exports.DOCUMENT_UNLINKED_DATA = exports.DOCUMENT_LINK_DATA_TYPE_FRAME = exports.DOCUMENT_LINK_DATA_TYPE_EDIT_DATA_ORIGINAL = exports.DOCUMENT_LINK_DATA_TYPE_EDIT_DATA = exports.DOCUMENT_LINK_DATA_TYPE_CREATE_DATA = exports.CREATE_CONFIG = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// simple frame with Person who is friend_with Person
var DOCUMENT_LINK_DATA_TYPE_FRAME = {
  "@context": {
    "@base": "terminusdb:///data/",
    "@schema": "terminusdb:///schema#",
    "@type": "Context",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "Person": {
    "@key": {
      "@type": "Random"
    },
    "@unfoldable": [],
    "@type": "Class",
    "friends_with": {
      "@class": "Person",
      "@type": "Optional"
    },
    "name": "xsd:string",
    "age": "xsd:integer"
  }
};

// expected data on Create 
exports.DOCUMENT_LINK_DATA_TYPE_FRAME = DOCUMENT_LINK_DATA_TYPE_FRAME;
var DOCUMENT_LINK_DATA_TYPE_CREATE_DATA = _defineProperty({
  "@type": "Person",
  "friends_with": {
    "@type": "Person",
    "name": "Hermione Granger",
    "age": "15",
    "friends_with": {
      "@type": "Person",
      "name": "Ronald Weasely",
      "age": "13"
    }
  },
  "name": "Harry Potter",
  "age": "18"
}, "@type", "Person");

// expected data on Create 
exports.DOCUMENT_LINK_DATA_TYPE_CREATE_DATA = DOCUMENT_LINK_DATA_TYPE_CREATE_DATA;
var DOCUMENT_LINK_DATA_TYPE_EDIT_DATA_ORIGINAL = _defineProperty({
  "@id": "Person/13123123",
  "@type": "Person",
  "friends_with": {
    "@id": "Person/13123123/friends_with/HermioneGranger",
    "@type": "Person",
    "name": "Hermione Granger",
    "age": "15",
    "friends_with": {
      "@id": "Person/13123123/friends_with/HermioneGranger/friends_with/RonaldWeasely",
      "@type": "Person",
      "name": "Ronald Weasely",
      "age": "13"
    }
  },
  "name": "Harry Potter",
  "age": "18"
}, "@type", "Person");

// expected data on Edit 
exports.DOCUMENT_LINK_DATA_TYPE_EDIT_DATA_ORIGINAL = DOCUMENT_LINK_DATA_TYPE_EDIT_DATA_ORIGINAL;
var DOCUMENT_LINK_DATA_TYPE_EDIT_DATA = _defineProperty({
  "@id": "Person/13123123",
  "@type": "Person",
  "friends_with": {
    "@id": "Person/13123123/friends_with/HermioneGranger",
    "@type": "Person",
    "name": "Hermione Granger",
    "age": "19",
    "friends_with": {
      "@id": "Person/13123123/friends_with/HermioneGranger/friends_with/RonaldWeasely",
      "@type": "Person",
      "name": "Ronald Bilius Weasely",
      "age": "16"
    }
  },
  "name": "Harry Potter",
  "age": "18"
}, "@type", "Person");
exports.DOCUMENT_LINK_DATA_TYPE_EDIT_DATA = DOCUMENT_LINK_DATA_TYPE_EDIT_DATA;
var DOCUMENT_UNLINKED_DATA = _defineProperty({
  "@id": "Person/13123123",
  "@type": "Person",
  "friends_with": {
    "@id": "Person/13123123/friends_with/HermioneGranger",
    "@type": "Person",
    "name": "Hermione Granger",
    "age": "15",
    "friends_with": {
      // this will be new data to be created
      "@type": "Person",
      "name": "Luna Lovegood",
      "age": "11"
    }
  },
  "name": "Harry Potter",
  "age": "18"
}, "@type", "Person");

// create config 
exports.DOCUMENT_UNLINKED_DATA = DOCUMENT_UNLINKED_DATA;
var CREATE_CONFIG = {
  frame: DOCUMENT_LINK_DATA_TYPE_FRAME,
  uiFrame: {},
  type: "Person",
  formData: {},
  input: DOCUMENT_LINK_DATA_TYPE_CREATE_DATA,
  mode: "Create"
};

// edit config 
exports.CREATE_CONFIG = CREATE_CONFIG;
var EDIT_CONFIG = {
  frame: DOCUMENT_LINK_DATA_TYPE_FRAME,
  uiFrame: {},
  type: "Person",
  formData: DOCUMENT_LINK_DATA_TYPE_EDIT_DATA_ORIGINAL,
  // pass created data here & we will modify with Edit data
  input: DOCUMENT_LINK_DATA_TYPE_EDIT_DATA,
  unLinkedInput: DOCUMENT_UNLINKED_DATA,
  mode: "Edit"
};

// view config 
exports.EDIT_CONFIG = EDIT_CONFIG;
var VIEW_CONFIG = {
  frame: DOCUMENT_LINK_DATA_TYPE_FRAME,
  uiFrame: {},
  type: "Person",
  formData: DOCUMENT_LINK_DATA_TYPE_EDIT_DATA,
  mode: "View"
};
exports.VIEW_CONFIG = VIEW_CONFIG;