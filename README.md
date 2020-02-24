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
| `data-icon-show`     | `string`           | Path of your "show" icon (local path or url)	
| `data-icon-hide`     | `string`           | Path of your "hide" icon (local path or url)	

## Styles

Input is encapsulate in shadow dom container. You can override some css var in order to apply your style.
You can change css variable for `.toggle-password-container`

| Css var                                  | Type     | Default value | Description                                                  |
|------------------------------------------|----------|---------------|--------------------------------------------------------------|
| `--toggle-password-background-color`     | `color`  | `transparent` | Change color of background for toggle element	               |
| `--toggle-password-color`                | `color`  | `#000`        | Change color of text or icon                                 |
| `--toggle-password-width`                | `unit`   | `40px`        | Set width of toggle element       	                       |
| `--toggle-password-padding`              | `unit`   | `5px`         | Set horizontal padding of toggle element	                   |
| `--toggle-password-icon-width`           | `unit`   | `24px`        | Height of	toggle icon                                        |
| `--toggle-password-icon-height`          | `unit`   | `24px`        | Width of toggle icon	                                       |   
