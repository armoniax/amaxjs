const assert = require("assert");
const Structs = require("./structs");

module.exports = AbiCache;
// global
const cache = {};

function AbiCache(network, config) {
  config.abiCache = {
    abiAsync,
    abi,
  };

  // Help (or "usage") needs {defaults: true}
  const abiCacheConfig = Object.assign({}, { defaults: true }, config);

  /**
    Asynchronously fetch and cache an ABI from the blockchain.

    @arg {string} account - blockchain account with deployed contract
    @arg {boolean} [force = true] false when ABI is immutable.
  */
  function abiAsync(account, force = true) {
    assert.equal(typeof account, "string", "account string required");

    if (force == false && cache[account] != null) {
      return Promise.resolve(cache[account]);
    }

    if (network == null) {
      const abi = cache[account];
      assert(
        abi,
        `Missing ABI for account: ${account}, provide httpEndpoint or add to abiCache`
      );
      return Promise.resolve(abi);
    }

    return network.getAbi(account).then((code) => {
      assert(code.abi, `Missing ABI for account: ${account}`);
      return abi(account, code.abi);
    });
  }

  /**
    Synchronously set or fetch an ABI from local cache.

    @arg {string} account - blockchain account with deployed contract
    @arg {string} [abi] - blockchain ABI json data.  Null to fetch or non-null to cache
  */
  function abi(account, abi) {
    assert.equal(typeof account, "string", "account string required");

    if (abi) {
      assert.equal(typeof abi, "object", "abi");

      function filterEos2(abi) {
        const filterTypes = [];
        const filterActions = [];
        if (abi.types && abi.types.length) {
          abi.types = abi.types.filter(({ type, new_type_name }) => {
            if (abi.variants && abi.variants.length) {
              const item = abi.variants.find((item) => item.name === type);
              if (item) {
                filterTypes.push(new_type_name);
                return false;
              }
            }
            return true;
          });
          abi.variants = [];

          if (filterTypes.length) {
            function findStructsIncludeIlterTypes(filterTypes) {
              const _filterTypes = [];
              abi.structs = abi.structs.filter(({ name, fields }) => {
                const item = fields.find(({ type }) => {
                  if (type.endsWith("[]")) {
                    type = type.slice(0, -2);
                  }
                  if (type.endsWith("$")) {
                    type = type.slice(0, -1);
                  }
                  return filterTypes.includes(type);
                });
                if (item) {
                  filterActions.push(name);
                  _filterTypes.push(name);
                  filterTypes.push(name);
                  return false;
                }
                return true;
              });

              if (_filterTypes.length) {
                findStructsIncludeIlterTypes(filterTypes);
              }
            }
            findStructsIncludeIlterTypes(filterTypes);
          }

          if (filterActions.length) {
            abi.actions = abi.actions.filter(
              ({ type }) => !filterActions.includes(type)
            );
          }
          // console.log(filterTypes, filterActions);
        }

        // 去掉变种$结尾
        for (const { fields } of abi.structs) {
          for (const item of fields) {
            if (item.type && item.type.endsWith("$")) {
              item.type = item.type.slice(0, -1);
            }
          }
        }
      }

      filterEos2(abi);
      if (Buffer.isBuffer(abi)) {
        abi = JSON.parse(abi);
      }
      const fcSchema = abiToFcSchema(abi, account);
      const structs = Structs(abiCacheConfig, fcSchema); // returns {structs, types}

      return (cache[account] = Object.assign(
        { abi, schema: fcSchema },
        structs
      ));
    }
    const c = cache[account];

    if (c == null) {
      throw new Error(`Abi '${account}' is not cached`);
    }
    return c;
  }

  return config.abiCache;
}

function abiToFcSchema(abi, account) {
  // customTypes
  // For FcBuffer
  const abiSchema = {};

  // convert abi types to Fcbuffer schema
  if (abi.types) {
    // aliases
    abi.types.forEach((e) => {
      // "account_name" = "name"
      let item = null;
      if (abi.variants) {
        item = abi.variants.find((item) => item.name === e.type);
      }
      if (item) {
        abiSchema[e.new_type_name] = {
          fields: item.types.map((s) => ({
            name: s,
            typeName: s,
            type: null,
          })),
        };
      } else {
        abiSchema[e.new_type_name] = e.type;
      }
    });
  }

  if (abi.structs) {
    // transaction_header = fields[actor, permission] extends base "transaction"
    abi.structs.forEach((e) => {
      const fields = {};
      for (const field of e.fields) {
        fields[field.name] = field.type;
      }
      abiSchema[e.name] = { base: e.base, fields };
      if (e.base === "") {
        delete abiSchema[e.name].base;
      }
    });
  }

  if (abi.actions) {
    // setprods = set_producers
    abi.actions.forEach((action) => {
      // @example action = {name: 'setprods', type: 'set_producers'}
      const type = abiSchema[action.type];
      if (!type) {
        console.error("Missing abiSchema type", action.type, account); //, abi, abiSchema)
      } else {
        type.action = {
          name: action.name,
          account,
        };
      }
    });
    // console.log('abiSchema', abiSchema);
  }

  return abiSchema;
}
