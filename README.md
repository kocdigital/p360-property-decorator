# Platform360 Property Decorator

## Overview

`@kocdigital/p360-property-decorator` provides Vue 2 property decorators built on top of [`vue-class-component`](https://github.com/vuejs/vue-class-component).

## Getting Started

### Prerequisites

- Install [Node.js 16.x](https://nodejs.org/dist/latest-v16.x/)
- Install [Yarn](https://yarnpkg.com/) if you have not already.
	- Enable `yarn` with `corepack enable` if you are using Node.js 16.10 or later.
- Use Vue 2.6 or 2.7 with `vue-class-component` v7.

### Installation

Install the package in your Vue project:

```bash
yarn add @kocdigital/p360-property-decorator vue-class-component
```

Or clone this repository for local development:

```bash
git clone https://github.com/kocdigital/p360-property-decorator.git
cd p360-property-decorator
yarn install
```

### Building the Library

To build the library, use the following commands:

- **One-time build:**

	```bash
	yarn build
	```

- **Continuous build:**

	```bash
	yarn dev
	```

The `yarn build` command runs `tsup` once to create the distributable files under `dist/`, while `yarn dev` runs `tsup` in watch mode.

### Linking with Yarn

To link this package with another local application using Yarn:

1. In the root directory of this library, run:

	 ```bash
	 yarn link
	 ```

2. Navigate to your main application directory:

	 ```bash
	 cd path/to/your/main/application
	 ```

3. Link the package into your application:

	 ```bash
	 yarn link "@kocdigital/p360-property-decorator"
	 ```

## Usage

### Importing the Decorator

```typescript
import Component from 'vue-class-component';
import {Storage} from '@kocdigital/p360-property-decorator';

import BasePage from '@/core/BasePage';
import config from '@/config';

@Component
export default class PreferencesPanelPage extends BasePage {
	@Storage(config.STORAGE_KEYS.ZOOM_SCALE) // Use a constant for the storage key
	scale = 1.0;
}
```

When the component is mounted, the decorator reads the stored value and assigns it to the property. When the property changes, the decorator writes the new value back to storage.

### Using a Different Storage Target

By default, `@Storage` uses `localStorage`. You can switch to another `Storage` implementation with the `storage` option:

```typescript
import Vue from 'vue';
import Component from 'vue-class-component';
import {Storage} from '@kocdigital/p360-property-decorator';

import BasePage from '@/core/BasePage';
import config from '@/config';

@Component({
  name: 'kd-search-filters-page',
})
export default class SearchFiltersPage extends BasePage {
	@Storage(config.STORAGE_KEYS.SEARCH_FILTERS, {
		storage: sessionStorage,
	})
	filters = {
		search: '',
		onlyActive: true,
	};
}
```

### Using Built-in Serializers

The package exports `StorageSerializers` for common value types:

```typescript
import {Storage, StorageSerializers} from '@kocdigital/p360-property-decorator';
import Component from 'vue-class-component';

import BasePage from '@/core/BasePage';
import config from '@/config';

@Component({
  name: 'kd-user-settings-page',
})
export default class UserSettingsPage extends BasePage {
	@Storage(config.STORAGE_KEYS.SIDEBAR_COLLAPSED, {
		serializer: StorageSerializers.boolean,
	})
	isSidebarCollapsed = false;

	@Storage(config.STORAGE_KEYS.REFRESH_INTERVAL, {
		serializer: StorageSerializers.number,
	})
	refreshInterval = 30;

	@Storage(config.STORAGE_KEYS.LAST_VISITED_AT, {
		serializer: StorageSerializers.date,
	})
	lastVisitedAt = new Date();
}
```

Available built-in serializers:

- `StorageSerializers.any`
- `StorageSerializers.boolean`
- `StorageSerializers.date`
- `StorageSerializers.map`
- `StorageSerializers.number`
- `StorageSerializers.object`
- `StorageSerializers.set`
- `StorageSerializers.string`

### Using a Custom Serializer

If you need a custom serialization strategy, pass your own `serializer`:

```typescript
import Component from 'vue-class-component';
import {Storage, type StorageSerializer} from '@kocdigital/p360-property-decorator';

import BasePage from '@/core/BasePage';
import config from '@/config';

const csvSerializer: StorageSerializer<string[]> = {
	read: (raw) => raw.split(',').filter(Boolean),
	write: (value) => value.join(','),
};

@Component({
  name: 'kd-tag-editor-page',
})
export default class TagEditorPage extends BasePage {
	@Storage(config.STORAGE_KEYS.FAVORITE_TAGS, {
		serializer: csvSerializer,
	})
	tags: string[] = [];
}
```

### Disabling Reactive Writes

Set `watch: false` if you only want to read the initial stored value without automatically persisting subsequent changes:

```typescript
import Component from 'vue-class-component';
import {Storage} from '@kocdigital/p360-property-decorator';

import BasePage from '@/core/BasePage';
import config from '@/config';

@Component({
  name: 'kd-snapshot-page',
})
export default class SnapshotPage extends BasePage {
	@Storage(config.STORAGE_KEYS.SNAPSHOT_STATE, {
		watch: false,
	})
	state: Record<string, unknown> = {};
}
```

### API

#### `Storage(storageKey: string, options?: { storage?: Storage; watch?: boolean; serializer?: StorageSerializer }): PropertyDecorator`

Creates a property decorator that synchronizes a class property with a storage key.

Parameters:

- `storageKey`: The storage key to read from and write to, required.
- `options.storage`: The storage target. Defaults to `localStorage`.
- `options.watch`: Whether value changes should be written back reactively. Defaults to `true`.
- `options.serializer`: Serializer used to read and write values. Defaults to `StorageSerializers.object`.

## Contributing

If you want to contribute, fork the repository, make your changes, and open a pull request.
