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
  <div>
    <div class={tw`bg-blue-100 flex text-blue-800`}>
      <h1 class={tw`text-8xl text-blue-500 m-auto mt-20`}>Hi {props.name}!</h1>
      <HelloNano />
      <Comments comments={comments} />
      <div id="comments"></div>
      <script type="module" src="/bundle.js"></script>
    </div>
    <div class={[tw`min-h-screen`, `hero bg-base-200`].join(" ")}>
      <div class={[tw`flex-col lg:flex-row-reverse`, `hero-content`].join(" ")}>
        <img
          src="https://picsum.photos/id/1005/600/600"
          class={tw`max-w-sm rounded-lg shadow-2xl`}
        />
        <div>
          <h1 class={tw`mb-5 text-5xl font-bold`}>Hello there</h1>
          <p class={tw`mb-5`}>
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

console.log(`Listening on: http://localhost:8080`);
await listenAndServe(":8080", async (req: Request) => {
  const url = new URL(req.url);
  console.log("Hi request to", url.href);
  if (url.href === "http://localhost:8080/bundle.js") {
    const body = files["deno:///bundle.js"];
    return new Response(body, {
      headers: { "content-type": "text/javascript" },
    });
  } else if (url.href === "http://localhost:8080/tailwind.css") {
    // TODO: 未検証
    const body = await Deno.readTextFile("./tailwind.dist.css");
    return new Response(body, {
      headers: { "content-type": "text/css" },
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
