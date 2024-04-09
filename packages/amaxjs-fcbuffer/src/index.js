const Types = require('./types')
const Fcbuffer = require('./fcbuffer')
const assert = require('assert')

const {create} = Fcbuffer

/**
  @typedef {object} SerializerConfig
  @property {boolean} [SerializerConfig.defaults = false] - Insert in defaults (like 0, false, '000...', or '') for any missing values.  This helps test and inspect what a definition should look like.  Do not enable in production.
  @property {boolean} [SerializerConfig.debug = false] - Prints lots of HEX and field-level information to help debug binary serialization.
  @property {object} [customTypes] - Add or overwrite low level types (see ./src/types.js `const types = {...}`).
*/

/**
  @typedef {object} CreateStruct
  @property {Array<String>} CreateStruct.errors - If any errors exists, no struts will be created.
  @property {Object} CreateStruct.struct - Struct objects keyed by definition name.
  @property {String} CreateStruct.struct.structName - Struct object that will serialize this type.
  @property {Struct} CreateStruct.struct.struct - Struct object that will serialize this type (see ./src/struct.js).
*/

/**
  @arg {object} definitions - examples https://github.com/EOSIO/eosjs-json/blob/master/schema
  @arg {SerializerConfig} config
  @return {CreateStruct}
*/
module.exports = (definitions, config = {}) => {
  if(typeof definitions !== 'object') {
    throw new TypeError('definitions is a required parameter')
  }

  if(config.customTypes) {
    definitions = Object.assign({}, definitions) //clone
    for(const key in config.customTypes) { // custom types overwrite definitions
      delete definitions[key]
    }
  }

  const types = Types(config)
  const {errors, structs} = create(definitions, types)

  /** Extend with more JSON schema and type definitions */
  const extend = (parent, child) => {
    const combined = Object.assign({}, parent, child)
    const {structs, errors} = create(combined, types)
    return {
      errors,
      structs,
      extend: child => extend(combined, child),
      fromBuffer: fromBuffer(types, structs),
      toBuffer: toBuffer(types, structs)
    }
  }

  return {
    errors,
    structs,
    types,
    extend: child => extend(definitions, child),

    /**
      @arg {string} typeName lookup struct or type by name
      @arg {Buffer} buf serialized data to be parsed
      @return {object} deserialized object
    */
    fromBuffer: fromBuffer(types, structs),

    /**
      @arg {string} typeName lookup struct or type by name
      @arg {Object} object for serialization
      @return {Buffer} serialized object
    */
    toBuffer: toBuffer(types, structs)
  }
}

const fromBuffer = (types, structs) => (typeName, buf) => {
  assert.equal(typeof typeName, 'string', 'typeName (type or struct name)')
  if(typeof buf === 'string') {
    buf = Buffer.from(buf, 'hex')
  }
  assert(Buffer.isBuffer(buf), 'expecting buf<hex|Buffer>')

  let type = types[typeName]
  if(type) {
    type = type()
  } else {
    type = structs[typeName]
  }
  assert(type, 'missing type or struct: ' + typeName)
  return Fcbuffer.fromBuffer(type, buf)
}

const toBuffer = (types, structs) => (typeName, value) => {
  assert.equal(typeof typeName, 'string', 'typeName (type or struct name)')
  assert(value != null, 'value is required')

  let type = types[typeName]
  if(type) {
    type = type()
  } else {
    type = structs[typeName]
  }
  assert(type, 'missing type or struct: ' + typeName)
  return Fcbuffer.toBuffer(type, value)
}

module.exports.fromBuffer = Fcbuffer.fromBuffer
module.exports.toBuffer = Fcbuffer.toBuffer
