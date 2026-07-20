interface StorageSerializer<T> {
    read: (raw: string) => T;
    write: (value: T) => string;
}
interface StorageOptions<T = any> {
    /**
     * `Storage` interface for persistence
     * @default localStorage
     */
    storage?: Storage;
    /**
     * Watch data value changes to reactively update {@link storage the storage}
     * @default true
     */
    watch?: boolean;
    /**
     * Custom serializer to read/write data from/to {@link storage the storage}
     * @default {@link StorageSerializers.object}
     */
    serializer?: StorageSerializer<T>;
}

declare const StorageSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date', StorageSerializer<any>>;

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
declare function Storage$1<T = any>(storageKey: string, options?: StorageOptions<T>): PropertyDecorator;

export { Storage$1 as Storage, StorageOptions, StorageSerializer, StorageSerializers };
