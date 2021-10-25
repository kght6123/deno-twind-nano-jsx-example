export * from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

import {
  Helmet,
  renderSSR as nanoRender,
} from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

const html = ({
  body,
  head,
  footer,
}: {
  body: string;
  head: string[];
  footer: string[];
}) => `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head}
    <link href="/tailwind.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    ${body}
    ${footer.join("\n")}
  </body>
<html>
`;

export function ssr(render: CallableFunction) {
  const app = nanoRender(render());
  const { body, head, footer } = Helmet.SSR(app);
  return new Response(html({ body, head, footer }), {
    headers: { "content-type": "text/html" },
  });
}
