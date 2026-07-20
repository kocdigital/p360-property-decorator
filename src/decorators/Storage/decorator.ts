import {createDecorator} from 'vue-class-component';

import {StorageSerializers} from './constants';

import type {StorageOptions} from './types';

/**
 * Storage decorator to bind reactive data into `Storage` interface
 * @param storageKey storage `key`, by default `localStorage` key
 * @param options
 *
 * @example
 * ```ts
 * ＠Component({
 *     name: 'some-component'
 * })
 * export default SomeComponent extends Vue {
 *     ＠Storage(config.STORAGE.LAYOUT_SCALE_KEY)
 *     scale = 0.8;
 *
 *     scaleUp() {
 *         // Also update `config.STORAGE.LAYOUT_SCALE_KEY` key in `localStorage` reactively
 *         this.scale += 0.1;
 *     }
 * }
 * ```
 *
 * When `scale` data change, automatically update `config.STORAGE.LAYOUT_SCALE_KEY` key in `localStorage` reactively.
 * And when set, it assigns the inital value of the `scale` data to `config.STORAGE.LAYOUT_SCALE_KEY` key in `localStorage`.
 */
export default function Storage<T = any>(storageKey: string, options: StorageOptions<T> = {}): PropertyDecorator {
    const {
        storage = localStorage,
        watch = true,
        serializer = StorageSerializers.object,
    } = options;

    return createDecorator((componentOptions, propertyKey) => {
        const originalMounted = componentOptions.mounted || function() {};
        const originalBeforeDestroy = componentOptions.beforeDestroy || function() {};

        function onStorage(event: StorageEvent) {
            if (event.key !== storageKey) {
                return;
            }

            try {
                if (event.newValue === 'undefined' || event.newValue === 'null') {
                    this[propertyKey] = null;
                } else {
                    this[propertyKey] = serializer.read(event.newValue);
                }
            } catch {
                this[propertyKey] = event.newValue;
            }
        }

        componentOptions.mounted = function() {
            const storedValue = storage.getItem(storageKey);

            if (storedValue !== null) {
                try {
                    if (storedValue === 'undefined' || storedValue === 'null') {
                        this[propertyKey] = null;
                    } else {
                        this[propertyKey] = serializer.read(storedValue);
                    }
                } catch (error) {
                    this[propertyKey] = storedValue;
                }
            }

            window.addEventListener('storage', onStorage.bind(this));

            originalMounted.call(this);
        };

        componentOptions.beforeDestroy = function() {
            window.removeEventListener('storage', onStorage.bind(this));

            originalBeforeDestroy.call(this);
        };

        if (watch) {
            const originalWatch = componentOptions.watch || {};

            originalWatch[propertyKey] = {
                handler(value: any) {
                    if (value === undefined || value === null) {
                        storage.removeItem(storageKey);
                    } else {
                        storage.setItem(storageKey, serializer.write(value));
                    }
                },
                deep: true,
            };

            componentOptions.watch = originalWatch;
        }
    });
}
