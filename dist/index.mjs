// src/decorators/Storage/constants.ts
var StorageSerializers = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v)
  },
  any: {
    read: (v) => v,
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => String(v)
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v))
  },
  date: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString()
  }
};

// src/decorators/Storage/decorator.ts
import { createDecorator } from "vue-class-component";
function Storage(storageKey, options = {}) {
  const {
    storage = localStorage,
    watch = true,
    serializer = StorageSerializers.object
  } = options;
  return createDecorator((componentOptions, propertyKey) => {
    const originalMounted = componentOptions.mounted || function() {
    };
    const originalBeforeDestroy = componentOptions.beforeDestroy || function() {
    };
    function onStorage(event) {
      if (event.key !== storageKey) {
        return;
      }
      try {
        if (event.newValue === "undefined" || event.newValue === "null") {
          this[propertyKey] = null;
        } else {
          this[propertyKey] = serializer.read(event.newValue);
        }
      } catch (e) {
        this[propertyKey] = event.newValue;
      }
    }
    componentOptions.mounted = function() {
      const storedValue = storage.getItem(storageKey);
      if (storedValue !== null) {
        try {
          if (storedValue === "undefined" || storedValue === "null") {
            this[propertyKey] = null;
          } else {
            this[propertyKey] = serializer.read(storedValue);
          }
        } catch (error) {
          this[propertyKey] = storedValue;
        }
      }
      window.addEventListener("storage", onStorage.bind(this));
      originalMounted.call(this);
    };
    componentOptions.beforeDestroy = function() {
      window.removeEventListener("storage", onStorage.bind(this));
      originalBeforeDestroy.call(this);
    };
    if (watch) {
      const originalWatch = componentOptions.watch || {};
      originalWatch[propertyKey] = {
        handler(value) {
          if (value === void 0 || value === null) {
            storage.removeItem(storageKey);
          } else {
            storage.setItem(storageKey, serializer.write(value));
          }
        },
        deep: true
      };
      componentOptions.watch = originalWatch;
    }
  });
}
export {
  Storage,
  StorageSerializers
};
