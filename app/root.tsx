import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import { json, redirect } from "@remix-run/cloudflare";
import appStylesHref from "./app.css";

import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { createEmptyContact,getContacts } from "./data";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
}

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <Meta />
      <Links />
    </head>
    <body>
    <div id="sidebar">
      <h1>Remix Contacts</h1>
      <div>
        <Form id="search-form" role="search">
          <input
            aria-label="Search contacts"
            id="q"
            name="q"
            placeholder="Search"
            type="search"
          />
          <div
            aria-hidden
            hidden={true}
            id="search-spinner"
          />
        </Form>
        <Form method="post">
          <button type="submit">New</button>
        </Form>
      </div>
      <nav>
        {contacts.length ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <Link to={`contacts/${contact.id}`}>
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <i>No Name</i>
                  )}{" "}
                  {contact.favorite ? (
                    <span>★</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No contacts</i>
          </p>
        )}
      </nav>
    </div>
    <div id="detail">
      <Outlet />
    </div>
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  );
}