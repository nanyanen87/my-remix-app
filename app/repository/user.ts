// dbUtils.ts
import type { D1Database } from "@cloudflare/workers-types";
import {json} from "@remix-run/cloudflare";
import { D1QB } from "workers-qb";

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
// export const insertUser = async (env: Env, user: User): Promise<number> => {
//   const result = await env.DB.prepare(
//     "INSERT INTO users (first, last, avatar, twitter) VALUES (?, ?, ?, ?)"
//   ).run(
//     user.first,
//     user.last,
//     user.avatar,
//     user.twitter
//   );
//
//   return result.changes > 0 ? result.lastInsertRowid : -1;
// };

export const fetchAllUsers = async (env: Env): Promise<User[]> => {
  const { results } = await env.DB.prepare("SELECT * FROM users").all<User>();
  return results;
}

// export const fetchOneUser = async (env: Env, id: number): Promise<User> => {
//   const qb = new D1QB(env.DB);
//   const fetched = await qb.fetchOne({
//     tableName: 'users',
//     fields: '*',
//     where: {
//       conditions: 'id = ?1',
//       params: [id],
//     },
//   }).execute();
//   console.dir(fetched.results, {depth: null});
//   return fetched;
// }

export const fetchOneUser = async (env: Env, id: number): Promise<User> => {
  // const stmt = await env.DB.prepare(`select * from users where id = ?1`).bind(id);
  // const res = await stmt.all();
  // console.dir(res.results[0], {depth: null});
  const res = await env.DB.prepare(`select * from users where id = ?1`).bind(id).first() as User;
  const user = {
    id: res.id,
    avatar: res.avatar,
    first: res.first,
    last: res.last,
    twitter: res.twitter,
  };
  return user;
}

