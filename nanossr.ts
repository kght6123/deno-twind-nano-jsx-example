export * from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

import {
  Helmet,
  renderSSR as nanoRender,
} from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

const html = async ({
  body,
  head,
  footer,
}: {
  body: string;
  head: string[];
  footer: string[];
}) => {
  let appHtml = await Deno.readTextFile("./app.html");
  appHtml = appHtml.replaceAll("{{ HTML_ATTRS }}", 'lang="ja"');
  appHtml = appHtml.replaceAll("{{ HEAD_ATTRS }}", "");
  appHtml = appHtml.replaceAll(
    "{{ HEAD }}",
    `
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${head}
<link href="/tailwind.css" rel="stylesheet" type="text/css" />
`
  );
  appHtml = appHtml.replaceAll("{{ BODY_ATTRS }}", "");
  appHtml = appHtml.replaceAll(
    "{{ APP }}",
    `
${body}
${footer.join("\n")}
`
  );
  return appHtml;
};

export async function ssr(render: CallableFunction) {
  const app = nanoRender(render());
  const { body, head, footer } = Helmet.SSR(app);
  return new Response(await html({ body, head, footer }), {
    headers: { "content-type": "text/html" },
  });
}
