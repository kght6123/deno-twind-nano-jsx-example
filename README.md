# deno-twind-nano-jsx-example

## tsconfig.json のエラー回避

https://github.com/denoland/vscode_deno/issues/326

## インポートエラー

An import path cannot end with a '.ts' extension. Consider importing <file-path> instead. ts(2691)

https://qiita.com/access3151fq/items/338c8841212710c6e277#%E5%9B%9E%E9%81%BF%E7%AD%96

## Resolved Dependency

Code: https​://deno.land/x/nano_jsx/mod.ts

Implicitly using latest version (v0.0.20) for https://deno.land/x/nano_jsx/mod.tsdeno(deno-warn)

## Tailwind CSS CLI

```sh
npx tailwindcss@next init
npm install -D daisyui
```

## 参考文献

https://crux.land/nanossr@0.0.1

https://dash.deno.com/playground/nanossr

https://github.com/nanojsx/nano-jsx-deno-example

## つまづき集

### カスタムコンポーネントが型エラーになる

```log
TypeError: Class constructor CommentsClass cannot be invoked without 'new'
    at renderFunctionalComponent (https://deno.land/x/nano_jsx@v0.0.20/core.ts:165:18)
    at _render (https://deno.land/x/nano_jsx@v0.0.20/core.ts:139:70)
    at https://deno.land/x/nano_jsx@v0.0.20/core.ts:48:17
    at Array.forEach (<anonymous>)
    at appendChildren (https://deno.land/x/nano_jsx@v0.0.20/core.ts:43:12)
    at h (https://deno.land/x/nano_jsx@v0.0.20/core.ts:256:3)
    at App (file:///home/kght6123/develop/deno-twind-nano-jsx-example/server.tsx:14:37)
    at renderFunctionalComponent (https://deno.land/x/nano_jsx@v0.0.20/core.ts:165:18)
    at _render (https://deno.land/x/nano_jsx@v0.0.20/core.ts:139:70)
    at render (https://deno.land/x/nano_jsx@v0.0.20/core.ts:82:12)
```

一部の import のパージョンに差異があった

```ts
import { Component } from "https://deno.land/x/nano_jsx@v0.0.20/component.ts";

import { Component } from "https://deno.land/x/nano_jsx@v0.0.16/component.ts";
```
