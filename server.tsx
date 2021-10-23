import { listenAndServe } from "https://deno.land/std@0.111.0/http/server.ts";
// import { h, ssr, tw } from "https://crux.land/nanossr@0.0.1";
import { h, ssr, tw } from "./nanossr.ts";

// This is an example of server side rendering using https://nanojsx.github.io/
// and https://twind.dev for styling. Hosted on https://deno.com/deploy.

// components
import Comments from "./components/Comments.tsx";
import { HelloNano } from "./components/HelloNano.tsx";

const comments = ["server side comment one"];

const Hello = (props: { name: string }) => (
  <div class={tw`bg-blue-100 flex`}>
    <h1 class={tw`text-8xl text-blue-500 m-auto mt-20`}>Hi {props.name}!</h1>
    <HelloNano />
    <Comments comments={comments} />
    <div id="comments"></div>
    <script type="module" src="/bundle.js"></script>
  </div>
);

const { files } = await Deno.emit("./client.tsx", {
  bundle: "module",
  compilerOptions: {
    jsxFactory: "h",
    target: "es2015",
    module: "es2015",
  },
});

console.log(`Listening on: http://localhost:8080`);
await listenAndServe(":8080", (req: Request) => {
  const url = new URL(req.url);
  console.log("Hi request to", url.href);
  if (url.href === "http://localhost:8080/bundle.js") {
    const body = files["deno:///bundle.js"];
    return new Response(body, {
      headers: { "content-type": "text/javascript" },
    });
  }
  console.log("1");
  const name = url.searchParams.get("name") ?? "Deno";
  console.log("2");
  try {
    const resp = ssr(() => <Hello name={name} />);
    console.log("3");
    return resp;
  } catch (e) {
    console.error(e);
  }
});
