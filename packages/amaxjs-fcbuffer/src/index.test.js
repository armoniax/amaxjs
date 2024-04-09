/* eslint-env mocha */
const assert = require("assert");
const ByteBuffer = require("bytebuffer");
const data = require("./test.json");

const Fcbuffer = require(".");
const Types = require("./types");
const Struct = require("./struct");
const { create } = require("./fcbuffer");

// const override = {
//   "recover_target_type.fromObject": (value) => {
//     const [amount, symbol] = value.split(" ");
//     return { amount, symbol };
//   },
//   "recover_target_type.toObject": (value) => {
//     const { amount, symbol } = value;
//     return `${amount} ${symbol}`;
//   },
//   "recover_target_type.fromByteBuffer": (value) => {
//     const [amount, symbol] = value.split(" ");
//     return { amount, symbol };
//   },
//   "recover_target_type.appendByteBuffer": (value) => {
//     const { amount, symbol } = value;
//     return `${amount} ${symbol}`;
//   },
// };

// const { structs, errors } = create(
//   {
//     recover_target_type: "string",
//   },
//   Types({ override })
// );
// // const { recover_target_type } = Types({ override });
// // const type = recover_target_type();
// console.log("errors", errors);
// console.log("structs", structs);

const definitions = {
  asset: {
    fields: {
      amount: "string", // another definition (like transfer)
      symbol: "string",
    },
  },
};
const override = {
  "asset.fromObject": (value) => {
    const [amount, symbol] = value.split(" ");
    return { amount, symbol };
  },
  "asset.toObject": (value) => {
    const { amount, symbol } = value;
    return `${amount} ${symbol}`;
  },
};
const { structs, errors } = create(definitions, Types({ override }));

console.log(structs);

// describe("API", function () {
//   it("bytes", function () {
//     const { bytes } = Types();
//     const type = bytes();
//     assertSerializer(type, "00aaeeff");
//     assertSerializer(type, Array.from([2, 1]), "020201", "0201");
//     assertSerializer(type, new Uint8Array([2, 1]), "020201", "0201");
//     assertRequired(type);
//   });

//   it("string", function () {
//     const { string } = Types();
//     const type = string();
//     assertSerializer(type, "爱");
//     assertRequired(type);
//   });

//   it("vector", function () {
//     const { vector, string } = Types();
//     throws(() => vector("string"), /vector type should be a serializer/);
//     const unsortedVector = vector(string(), false);

//     assert.deepEqual(unsortedVector.fromObject(["z", "z"]), ["z", "z"]); // allows duplicates
//     assert.deepEqual(unsortedVector.fromObject(["z", "a"]), ["z", "a"]); // does not sort
//     assertSerializer(unsortedVector, ["z", "a"]);

//     const sortedVector = vector(string(), true);
//     assert.deepEqual(sortedVector.fromObject(["z", "a"]), ["a", "z"]); //sorts
//     assertSerializer(sortedVector, ["a", "z"]);

//     // null object converts to an empty vector
//     const stringVector = vector(string());
//     const b = new ByteBuffer(
//       ByteBuffer.DEFAULT_CAPACITY,
//       ByteBuffer.LITTLE_ENDIAN
//     );
//     stringVector.appendByteBuffer(b, null);
//     assert.deepEqual(stringVector.fromObject(null), []);
//     assert.deepEqual(stringVector.toObject(null), []);
//   });

//   it("FixedBytes", function () {
//     const { fixed_bytes16 } = Types();
//     const type = fixed_bytes16();
//     assertSerializer(type, Array(16 + 1).join("ff")); // hex string
//     throws(
//       () => assertSerializer(type, Array(17 + 1).join("ff")),
//       /fixed_bytes16 length 17 does not equal 16/
//     );
//     assertRequired(type);
//   });

//   it("FixedString", function () {
//     const { fixed_string16 } = Types();
//     const type = fixed_string16();
//     assertSerializer(type, "1234567890123456");
//     throws(
//       () => assertSerializer(type, "12345678901234567"),
//       /exceeds maxLen 16/
//     );
//     assertRequired(type);
//   });

//   it("TypesAll", function () {
//     const types = Types({ defaults: true });
//     for (let typeName of Object.keys(types)) {
//       if (typeName === "config") {
//         continue;
//       }
//       const fn = types[typeName];
//       let type = null;
//       if (typeName === "map") {
//         type = fn([types.string(), types.string()]);
//         assertSerializer(type, { abc: "def" });
//       } else if (typeName === "static_variant") {
//         type = fn([types.string(), types.string()]);
//         assertSerializer(type, [0, "abc"]);
//       } else if (typeof fn === "function") {
//         type = fn(types.string());
//         assertSerializer(type, type.toObject());
//       }
//       if (type === null) {
//         assert(false, "Skipped type " + typeName);
//       }
//     }
//   });

//   it("time", function () {
//     const { time } = Types();
//     const type = time();

//     throws(() => type.fromObject({}), /Unknown date type/);
//     type.fromObject(new Date());
//     type.fromObject(1000);
//     type.fromObject("1970-01-01T00:00:00");

//     assertSerializer(type, "1970-01-01T00:00:00");
//     assertSerializer(type, "2106-02-07T06:28:15");
//     throws(() => assertSerializer(type, "1969-12-31T23:59:59Z"), /format/); // becomes -1
//     throws(() => assertSerializer(type, "2106-02-07T06:28:16Z"), /Overflow/);
//     assertRequired(type);
//   });

//   it("optional", function () {
//     const { optional, string } = Types();
//     const type = optional(string());
//     throws(
//       () => optional("string"),
//       /optional parameter should be a serializer/
//     );
//     assertSerializer(type, "str");
//     assertSerializer(type, null);
//     assertSerializer(type, undefined);
//   });

//   describe("uint", function () {
//     const { uint8, vector } = Types();
//     const type = uint8();

//     it("serializes", function () {
//       assertSerializer(type, 0, "00");
//       assertSerializer(type, 255, "ff");
//       throws(() => assertSerializer(type, 256), /Overflow/);
//       throws(() => assertSerializer(type, -1), /format/);
//       assertRequired(type);
//     });

//     it("sorts", function () {
//       const typeVector = vector(type);
//       const unsortedValue = [1, 0];
//       const sortedValue = [0, 1];
//       assertSerializerSort(typeVector, unsortedValue, sortedValue);
//     });
//   });

//   it("uint64", function () {
//     const { uint64 } = Types();
//     const type = uint64();

//     assertSerializer(type, "18446744073709551615", "ffffffffffffffff");
//     assertSerializer(type, "0", "0000000000000000");
//     throws(() => assertSerializer(type, "18446744073709551616"), /Overflow/);
//     throws(() => assertSerializer(type, "-1"), /format/);
//     assertRequired(type);
//   });

//   it("uint128", function () {
//     const { uint128 } = Types();
//     const type = uint128();

//     assertSerializer(
//       type,
//       "340282366920938463463374607431768211455", // (2^128)-1
//       "ffffffffffffffffffffffffffffffff"
//     );
//     assertSerializer(type, "0", "00000000000000000000000000000000");
//     throws(
//       () => assertSerializer(type, "340282366920938463463374607431768211456"),
//       /Overflow/
//     );
//     throws(() => assertSerializer(type, "-1"), /format/);
//     assertRequired(type);
//   });

//   it("int", function () {
//     const { int8 } = Types();
//     const type = int8();

//     assertSerializer(type, -128, "80");
//     assertSerializer(type, 127, "7f");

//     const serializerType = typeof assertSerializer(type, 0);
//     assert.equal(
//       serializerType,
//       "number",
//       "expecting number type when bits <= 53"
//     );

//     throws(() => assertSerializer(type, -129), /Overflow/);
//     throws(() => assertSerializer(type, 128), /Overflow/);
//     assertRequired(type);
//   });

//   it("int64", function () {
//     const { int64 } = Types();
//     const type = int64();

//     assertSerializer(type, "9223372036854775807", "ffffffffffffff7f");
//     assertSerializer(type, "-9223372036854775808", "0000000000000080");

//     const serializerType = typeof assertSerializer(type, "0");
//     assert.equal(
//       serializerType,
//       "string",
//       "expecting string type when bits > 53"
//     );

//     throws(() => assertSerializer(type, "9223372036854775808"), /Overflow/);
//     throws(() => assertSerializer(type, "-9223372036854775809"), /Overflow/);
//     assertRequired(type);
//   });

//   it("int128", function () {
//     const { int128 } = Types();
//     const type = int128();

//     assertSerializer(type, "0", "00000000000000000000000000000000");
//     assertSerializer(
//       type,
//       "170141183460469231731687303715884105727",
//       "ffffffffffffffffffffffffffffff7f"
//     );
//     assertSerializer(
//       type,
//       "-170141183460469231731687303715884105728",
//       "00000000000000000000000000000080"
//     );
//     throws(
//       () => assertSerializer(type, "170141183460469231731687303715884105728"),
//       /Overflow/
//     );
//     throws(
//       () => assertSerializer(type, "-170141183460469231731687303715884105729"),
//       /Overflow/
//     );
//     assertRequired(type);
//   });

//   describe("struct", function () {
//     const { vector, uint16, fixed_bytes33 } = Types();

//     const KeyPermissionWeight = Struct("KeyPermissionWeight");
//     KeyPermissionWeight.add("key", fixed_bytes33());
//     KeyPermissionWeight.add("weight", uint16());

//     const type = vector(KeyPermissionWeight);

//     it("serializes", function () {
//       assertSerializer(type, [
//         { key: Array(33 + 1).join("00"), weight: 1 },
//         { key: Array(33 + 1).join("00"), weight: 1 },
//       ]);
//     });

//     it("sorts", function () {
//       const unsortedValue = [
//         { key: Array(33 + 1).join("11"), weight: 1 },
//         { key: Array(33 + 1).join("00"), weight: 1 },
//       ];

//       const sortedValue = [unsortedValue[1], unsortedValue[0]];
//       assertSerializerSort(type, unsortedValue, sortedValue);
//     });
//   });
// });

// describe("JSON", function () {
//   it("Structure", function () {
//     assertCompile({ Struct: { fields: { checksum32: "fixed_bytes32" } } });
//     throws(
//       () => assertCompile({ Struct: {} }),
//       /Expecting Struct.fields or Struct.base/
//     );
//     throws(
//       () => assertCompile({ Struct: { base: { obj: "val" } } }),
//       /Expecting string/
//     );
//     throws(
//       () => assertCompile({ Struct: { fields: "string" } }),
//       /Expecting object/
//     );
//     throws(
//       () => assertCompile({ Struct: { fields: { name: { obj: "val" } } } }),
//       /Expecting string in/
//     );
//     throws(() => assertCompile({ Struct: 0 }), /Expecting object or string/);
//   });

//   it("Debug", function () {
//     assertCompile(data, { defaults: true, debug: true });
//   });

//   it("typedef", function () {
//     throws(() => assertCompile({ Type: "UnknownType" }), /Unrecognized type/);
//     assertCompile({ name: "string", Person: { fields: { name: "name" } } });
//     assertCompile({
//       name: "string",
//       MyName: "name",
//       Person: { fields: { name: "MyName" } },
//     });
//   });

//   it("typedef", function () {
//     assertCompile({ Event: { fields: { time: "time" } } });
//   });

//   it("Inherit", function () {
//     throws(
//       () => assertCompile({ Struct: { fields: { name: "name" } } }),
//       /Missing name/
//     );
//     throws(
//       () => assertCompile({ Struct: { base: "string" } }),
//       /Missing string in Struct.base/
//     );
//     throws(
//       () =>
//         assertCompile({
//           Person: { base: "Human", fields: { name: "string" } },
//         }),
//       /Missing Human/
//     );

//     throws(
//       () =>
//         assertCompile({
//           Human: "string", // Human needs to be struct not a type
//           Person: { base: "Human", fields: { name: "string" } },
//         }),
//       /Missing Human/
//     );

//     const schema = assertCompile({
//       Boolean: "uint8",
//       Human: { fields: { Alive: "Boolean", Gender: "string" } },
//       Person: { base: "Human", fields: { name: "string" } },
//     });
//     const person = { Alive: 1, Gender: "f", name: "jim" };
//     assert.deepEqual(schema.Person.toObject(person), person);
//   });

//   it("optional", function () {
//     const { Person } = assertCompile(
//       { Person: { fields: { name: "string?" } } },
//       { defaults: false }
//     );
//     assertSerializer(Person, { name: "Jane" });
//     assertSerializer(Person, { name: null });
//     assertSerializer(Person, { name: undefined });
//     // assertSerializer(Person, {})  {"name": [null]} // TODO ???
//   });

//   it("Vectors", function () {
//     throws(
//       () => assertCompile({ Person: { fields: { name: "vector[TypeArg]" } } }),
//       /Missing TypeArg/
//     );
//     throws(
//       () => assertCompile({ Person: { fields: { name: "BaseType[]" } } }),
//       /Missing BaseType/
//     );
//     throws(
//       () => assertCompile({ Person: { fields: { name: "BaseType[string]" } } }),
//       /Missing BaseType/
//     );
//     assertCompile({ Person: { fields: { name: "vector[string]" } } });
//     assertCompile({
//       Person: { fields: { name: "string" } },
//       Conference: { fields: { attendees: "Person[]" } },
//     });

//     let { Person } = assertCompile({
//       Person: { fields: { friends: "string[]" } },
//     });
//     assertSerializer(Person, { friends: ["Jane", "Dan"] });
//     assertSerializer(Person, { friends: ["Dan", "Jane"] }); // un-sorted

//     Person = assertCompile(
//       { Person: { fields: { friends: "string[]" } } },
//       { sort: { "Person.friends": true } }
//     ).Person;
//     assertSerializer(Person, { friends: ["Dan", "Jane"] });
//     assert.throws(
//       () => assertSerializer(Person, { friends: ["Jane", "Dan"] }),
//       /serialize object/
//     );
//   });

//   it("Errors", function () {
//     const { structs } = create(
//       { Struct: { fields: { age: "string" } } },
//       Types({ defaults: true })
//     );
//     const type = structs.Struct;
//     throws(() => Fcbuffer.fromBuffer(type, Buffer.from("")), /Illegal offset/);
//   });
// });

// describe("Override", function () {
//   it("type", function () {
//     const definitions = {
//       asset: {
//         fields: {
//           amount: "string", // another definition (like transfer)
//           symbol: "string",
//         },
//       },
//     };
//     const override = {
//       "asset.fromObject": (value) => {
//         const [amount, symbol] = value.split(" ");
//         return { amount, symbol };
//       },
//       "asset.toObject": (value) => {
//         const { amount, symbol } = value;
//         return `${amount} ${symbol}`;
//       },
//     };
//     const { structs, errors } = create(definitions, Types({ override }));
//     assert.equal(errors.length, 0);
//     const asset = structs.asset.fromObject("1 EOS");
//     assert.deepEqual(asset, { amount: 1, symbol: "EOS" });
//     assert.deepEqual("1 EOS", structs.asset.toObject(asset));
//   });

//   it("field", function () {
//     const definitions = {
//       message: {
//         fields: {
//           type: "string", // another definition (like transfer)
//           data: "bytes",
//         },
//       },
//       transfer: {
//         fields: {
//           from: "string",
//           to: "string",
//         },
//       },
//     };
//     const override = {
//       "message.data.fromByteBuffer": ({ fields, object, b, config }) => {
//         const ser =
//           (object.type || "") == "" ? fields.data : structs[object.type];
//         b.readVarint32();
//         object.data = ser.fromByteBuffer(b, config);
//       },
//       "message.data.appendByteBuffer": ({ fields, object, b }) => {
//         const ser =
//           (object.type || "") == "" ? fields.data : structs[object.type];
//         const b2 = new ByteBuffer(
//           ByteBuffer.DEFAULT_CAPACITY,
//           ByteBuffer.LITTLE_ENDIAN
//         );
//         ser.appendByteBuffer(b2, object.data);
//         b.writeVarint32(b2.offset);
//         b.append(b2.copy(0, b2.offset), "binary");
//       },
//       "message.data.fromObject": ({ fields, object, result }) => {
//         const { data, type } = object;
//         const ser = (type || "") == "" ? fields.data : structs[type];
//         result.data = ser.fromObject(data);
//       },
//       "message.data.toObject": ({ fields, object, result, config }) => {
//         const { data, type } = object || {};
//         const ser = (type || "") == "" ? fields.data : structs[type];
//         result.data = ser.toObject(data, config);
//       },
//     };
//     const { structs, errors } = create(
//       definitions,
//       Types({ override, debug: true })
//     );
//     assert.equal(errors.length, 0);
//     assertSerializer(structs.message, {
//       type: "transfer",
//       data: {
//         from: "slim",
//         to: "luke",
//       },
//     });
//   });
// });

// describe("Custom Type", function () {
//   it("Implied Decimal", function () {
//     const customTypes = {
//       implied_decimal: () => [ImpliedDecimal, { decimals: 4 }],
//     };

//     const definitions = {
//       asset: {
//         fields: {
//           amount: "implied_decimal",
//           symbol: "string",
//         },
//       },
//     };

//     const ImpliedDecimal = ({ decimals }) => {
//       return {
//         fromByteBuffer: (b) => b.readVString(),
//         appendByteBuffer: (b, value) => {
//           b.writeVString(value.toString());
//         },
//         fromObject(value) {
//           let [num = "", dec = ""] = value.split(".");
//           // if(dec.length > decimals) { throw TypeError(`Adjust precision to only ${decimals} decimal places.`) }
//           dec += "0".repeat(decimals - dec.length);
//           return `${num}.${dec}`;
//         },
//         toObject: (value) => value,
//       };
//     };

//     const { structs, errors, fromBuffer, toBuffer } = Fcbuffer(definitions, {
//       customTypes,
//     });
//     assert.equal(errors.length, 0);
//     const asset = structs.asset.fromObject({ amount: "1", symbol: "EOS" });
//     assert.deepEqual(asset, { amount: "1.0000", symbol: "EOS" });

//     const buf = toBuffer("asset", asset);
//     assert.deepEqual(fromBuffer("asset", buf), asset);
//     assert.deepEqual(fromBuffer("asset", buf.toString("hex")), asset);

//     // toBuffer and fromBuffer for a simple type
//     // assert.equal(fromBuffer('uint8', toBuffer('uint8', 1)), 1)
//   });

//   it("Struct Typedef", function () {
//     const definitions = {
//       name: "string", // typedef based on a struct
//       names: "string[]", // typedef based on a struct
//       assets: "asset[]", // typedef based on a struct
//       asset: {
//         fields: {
//           amount: "uint64",
//           symbol: "string",
//         },
//       },
//     };

//     const { structs, types, errors } = Fcbuffer(definitions);
//     assert.equal(errors.length, 0, JSON.stringify(errors));

//     assertSerializer(types.name(), "annunaki");
//     assertSerializer(structs.names, ["annunaki"]);
//     assertSerializer(structs.assets, [{ amount: 1, symbol: "CUR" }]);
//   });
// });

// function assertCompile(definitions, config) {
//   config = Object.assign({ defaults: true, debug: false }, config);
//   console.log();
//   const { errors, structs } = create(definitions, Types(config));
//   assert.equal(errors.length, 0, errors[0]);
//   assert(Object.keys(structs).length > 0, "expecting struct(s)");
//   for (const struct in structs) {
//     const type = structs[struct];
//     // console.log(struct, JSON.stringify(structs[struct].toObject(), null, 0), '\n')
//     assertSerializer(type, type.toObject());
//   }
//   return structs;
// }

// function assertSerializer(type, value, bufferHex, internalValue = value) {
//   const obj = type.fromObject(value); // tests fromObject
//   const buf = Fcbuffer.toBuffer(type, obj); // tests appendByteBuffer
//   if (bufferHex != null) {
//     assert.equal(buf.toString("hex"), bufferHex);
//   }
//   const obj2 = Fcbuffer.fromBuffer(type, buf); // tests fromByteBuffer
//   const obj3 = type.toObject(obj); // tests toObject
//   deepEqual(internalValue, obj3, "serialize object");
//   deepEqual(obj3, obj2, "serialize buffer");
//   return value;
// }

// function assertSerializerSort(type, unsortedValue, sortedValue) {
//   const obj = type.fromObject(unsortedValue); // tests fromObject
//   const obj2 = type.toObject(obj); // tests toObject

//   deepEqual(obj2, sortedValue, "fromObject sorts");

//   const buf = Fcbuffer.toBuffer(type, obj2); // tests appendByteBuffer
//   const obj3 = Fcbuffer.fromBuffer(type, buf); // tests fromByteBuffer
//   deepEqual(obj3, obj3, "serialize buffer");
// }

// function assertRequired(type) {
//   throws(() => assertSerializer(type, null), /Required/);
//   throws(() => assertSerializer(type, undefined), /Required/);
// }

// /* istanbul ignore next */
// function deepEqual(arg1, arg2, message) {
//   try {
//     assert.deepEqual(arg1, arg2, message);
//     // console.log('deepEqual arg1', arg1, '\n', JSON.stringify(arg1))
//     // console.log('deepEqual arg2', arg2, '\n', JSON.stringify(arg2))
//   } catch (error) {
//     // console.error('deepEqual arg1', arg1, '\n', JSON.stringify(arg1))
//     // console.error('deepEqual arg2', arg2, '\n', JSON.stringify(arg2))
//     throw error;
//   }
// }

// /* istanbul ignore next */
// function throws(fn, match) {
//   try {
//     fn();
//     assert(false, "Expecting error");
//   } catch (error) {
//     if (!match.test(error)) {
//       error.message = `Error did not match ${match}\n${error.message}`;
//       throw error;
//     }
//   }
// }
