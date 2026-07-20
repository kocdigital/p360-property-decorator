
export interface StorageSerializer<T> {
  read: (raw: string) => T;
  write: (value: T) => string;
}

export interface StorageOptions<T = any> {
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
