import {NavLink, useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/cloudflare";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { fetchAllUsers } from "~/repository/user"
import {D1Database} from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
}
// これがentity?

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.env as Env;
  const results = await fetchAllUsers(env);
  return json({
    users: results ?? [],
  });
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>UserRoute</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <NavLink
              className={({isActive, isPending}) => isActive ? "active" : isPending ? "pending" : ""}
              to={`/users/${user.id}`}>
              {user.first || user.last ? (
                <>
                  {user.first} {user.last}
                </>
              ) : (
                <i>No Name</i>
              )}{" "}
              {user.favorite ? (
                <span>★</span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}