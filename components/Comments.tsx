import { h } from "https://deno.land/x/nano_jsx@v0.0.20/core.ts";

const Comments = (props: { comments: string[] }) => {
  return (
    <ul>
      {props.comments.map((comment: string) => {
        return <li>{comment}</li>;
      })}
    </ul>
  );
};

export default Comments;
