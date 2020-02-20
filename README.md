# Custom element - Password Toggle

[![npm](https://img.shields.io/npm/v/@fredxd/passwordtoggle.svg)](http://npm.im/@fredxd/passwordtoggle)

Attach toogle password behavior with this custom element.

## Installation

With npm

```bash
npm i @fredxd/passwordtoggle
```

Or yarn 
```bash
yarn add @fredxd/passwordtoggle
```

## Usage
To attach toggle behavior to input, add `is="toggle-password"` to your password input

```html
<input type="password" is="toggle-password" />
```

## Attributes

You can pass some parameters via data attributes

| Attribute            | Type               | Description                                                  |
|----------------------|--------------------|--------------------------------------------------------------|
| `data-show-text`     | `string`           | Text rendered in input to show password	                     |
| `data-hide-text`     | `string`           | Text rendered in input to hide password                      |
| `data-display-icon`  | `string` or `bool` | You can display icon instead of text	                     |
		
				
```html
<input type="password" is="toggle-password" data-show-text="Voir" data-hide-text="Cacher" />
```

```html
<input type="password" is="toggle-password" data-display-icon="true" />
```
