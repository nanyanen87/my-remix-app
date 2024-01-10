import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import type { D1Database } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
}

type User = {
  id: number;
  avatar: string;
  first: string;
  last: string;
  twitter: string;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.env as Env;

  const { results } = await env.DB.prepare("SELECT * FROM users").all<User>();

  return json({
    users: results ?? [],
  });
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
        {users.map((user) => (
          <li key={user.id}>{user.last + ' ' + user.first}</li>
        ))}
      </ul>
    </div>
  );
}
