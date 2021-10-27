import { Server } from "https://deno.land/std@0.111.0/http/server.ts";
import { h, ssr } from "./nanossr.ts";

// This is an example of server side rendering using https://nanojsx.github.io/
// and https://twind.dev for styling. Hosted on https://deno.com/deploy.

// components
import Comments from "./components/Comments.tsx";
import { HelloNano } from "./components/HelloNano.tsx";

const comments = ["server side comment one"];

const App = (props: { name: string }) => (
  <div>
    <div class={`bg-blue-100 flex text-blue-800`}>
      <h1 class={`text-8xl text-blue-500 m-auto mt-20`}>Hi {props.name}!</h1>
      <HelloNano />
      <Comments comments={comments} />
      <div id="comments"></div>
      <script type="module" src="/bundle.js"></script>
    </div>
    <div class={[`min-h-screen`, `hero bg-base-200`].join(" ")}>
      <div class={[`flex-col lg:flex-row-reverse`, `hero-content`].join(" ")}>
        <img
          src="https://picsum.photos/id/1005/600/600"
          class={`max-w-sm rounded-lg shadow-2xl`}
        />
        <div>
          <h1 class={`mb-5 text-5xl font-bold`}>Hello there</h1>
          <p class={`mb-5`}>
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button class="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
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

// TODO: これを見て、書き直せるところは書き直す https://github.com/denoland/deno_std/blob/main/http/server.ts

const addr = ":8080";
const handler = async (request: Request) => {
  // Nuxt.js ライクな Router 仕様の案
  // /pages/AAA.tsx -> SSR
  // /pages/AAA.ssr.tsx -> SSR
  // /pages/BBB.csr.tsx -> CSR
  // /pages/CCC.isr.tsx -> ISR
  // /pages/DDD.ssg.tsx -> SSG
  // /pages/aaa/bbb/ccc.tsx -> /aaa/bbb/ccc
  // /pages/aaa/bbb/ccc.ssr.tsx -> /aaa/bbb/ccc
  // /pages/aaa-bbb-ccc.tsx -> /aaa/bbb/ccc
  // /pages/aaa_bbb_ccc.tsx -> /aaa/bbb/ccc
  // /pages/aaa_{hoge}_ccc.tsx -> /aaa/{hoge}/ccc
  // Nuxt.js ライクな Components の自動インポートの案
  // /components/atoms/Comments.tsx -> <atoms-comments />
  const url = new URL(request.url);
  console.log("Hi request to", url.href);
  if (url.href === "http://localhost:8080/bundle.js") {
    const body = files["deno:///bundle.js"];
    return new Response(body, {
      headers: { "content-type": "text/javascript" },
    });
  } else if (url.href === "http://localhost:8080/tailwind.css") {
    const body = await Deno.readTextFile("./dist/tailwind.css");
    return new Response(body, {
      headers: { "content-type": "text/css" },
    });
  }
  console.log("1");
  const name = url.searchParams.get("name") ?? "Deno";
  console.log("2");
  try {
    const resp = await ssr(() => <App name={name} />);
    console.log("3");
    return resp;
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error.", { status: 500 });
  }
};
const server = new Server({ addr, handler });
console.log("server listening on http://localhost:8080");
await server.listenAndServe();
