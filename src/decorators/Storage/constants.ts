import type {StorageSerializer} from './types';

export const StorageSerializers: Record<
'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date',
StorageSerializer<any>
> = {
    boolean: {
        read: (v: string) => v === 'true',
        write: (v: boolean) => String(v),
    },
    object: {
        read: (v: string) => JSON.parse(v),
        write: (v: any) => JSON.stringify(v),
    },
    number: {
        read: (v: string) => Number.parseFloat(v),
        write: (v: number) => String(v),
    },
    any: {
        read: (v: string) => v,
        write: (v: any) => String(v),
    },
    string: {
        read: (v: string) => v,
        write: (v: string) => String(v),
    },
    map: {
        read: (v: any) => new Map(JSON.parse(v)),
        write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
    },
    set: {
        read: (v: any) => new Set(JSON.parse(v)),
        write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
    },
    date: {
        read: (v: string) => new Date(v),
        write: (v: Date) => v.toISOString(),
    },
};
