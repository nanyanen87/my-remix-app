import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs,ActionFunctionArgs } from "@remix-run/cloudflare";
import type { FunctionComponent } from "react";
import invariant from "tiny-invariant";
import type { ContactRecord } from "~/data";
import { getContact,updateContact } from "~/data";
import { D1Database } from "@cloudflare/workers-types";
import {fetchAllUsers, fetchOneUser} from "~/repository/user"


interface Env {
  DB: D1Database;
}
export const loader = async ({
  context,
  params,
}: LoaderFunctionArgs ) => {
  const env = context.env as Env;
  console.log('params', params.userId)
  invariant(params.userId, "Missing userId param");
  const result = await fetchOneUser(env, Number(params.userId));
  if (!result) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user: result });
}

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.userId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.userId, {
    favorite: formData.get("favorite") === "true",
  });
}


export default function User() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div id="contact">
      <div>
        <img
          alt={`${user.first} ${user.last} avatar`}
          key={user.avatar}
          src={user.avatar}
        />
      </div>

      <div>
        <h1>
          {user.first || user.last ? (
            <>
              {user.first} {user.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite user={user} />
        </h1>

        {user.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${user.twitter}`}
            >
              {user.twitter}
            </a>
          </p>
        ) : null}

        {user.notes ? <p>{user.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  user: Pick<ContactRecord, "favorite">;
}> = ({ user }) => {
  const favorite = user.favorite;

  return (
    <Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
