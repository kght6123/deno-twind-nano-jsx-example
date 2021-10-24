export * from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
export { tw } from "https://cdn.skypack.dev/twind";

import {
  Helmet,
  renderSSR as nanoRender,
} from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
import { setup } from "https://cdn.skypack.dev/twind";
import {
  getStyleTag,
  virtualSheet,
} from "https://cdn.skypack.dev/twind/sheets";
import typography from "https://cdn.skypack.dev/@twind/typography";

// deno-lint-ignore no-explicit-any
let SHEET_SINGLETON: any = null;
function sheet(twOptions = {}) {
  return SHEET_SINGLETON ?? (SHEET_SINGLETON = setupSheet(twOptions));
}

// Setup TW sheet singleton
// deno-lint-ignore no-explicit-any
function setupSheet(twOptions: Record<string, any>) {
  const sheet = virtualSheet();
  setup({ ...twOptions, sheet, plugins: { ...typography() } });
  return sheet;
}

const html = ({
  body,
  head,
  footer,
  styleTag,
}: {
  body: string;
  head: string[];
  footer: string[];
  styleTag: string;
}) => `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head}
    ${styleTag}
    <link href="https://cdn.jsdelivr.net/npm/daisyui@1.16.0/dist/full.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    ${body}
    ${footer.join("\n")}
  </body>
<html>
`;

// deno-lint-ignore no-explicit-any
export function ssr(render: CallableFunction, options?: any) {
  sheet(options?.tw ?? {}).reset();
  const app = nanoRender(render());
  const { body, head, footer } = Helmet.SSR(app);
  const styleTag = getStyleTag(sheet());
  return new Response(html({ body, head, footer, styleTag }), {
    headers: { "content-type": "text/html" },
  });
}
