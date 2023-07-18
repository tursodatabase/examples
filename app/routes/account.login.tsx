import { type ActionArgs, json } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";

import { createUserSession, login } from "~/lib/session.server";

export async function action({ request }: ActionArgs) {
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Log in - The Mug Store" },
    { name: "description", content: "Log into your Mug Store account" },
  ];
};
  const formData = await request.formData();
  const { ...values } = Object.fromEntries(formData);

  if (
    !values.email ||
    !values.password ||
    typeof values.email !== "string" ||
    typeof values.password != "string"
  ) {
    return json(
      { ok: false, message: "email or password incorrect" },
      { status: 422, statusText: "Fields cannot be empty!" }
    );
  }

  const user = await login(values.email, values.password);
  if (!user)
    return json(
      { ok: false, message: "Wrong credentials!" },
      { status: 400, statusText: "Wrong credentials!" }
    );

  // assign session
  return createUserSession(user.id, "/account/dashboard");
}

export default function Login() {
  const loginFetcher = useFetcher();

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl">Sign in.</h1>
        {loginFetcher.state === "idle" && loginFetcher.data && (
          <div className="flex items-center justify-center my-3 bg-red-100">
            <p className="p-2 text-red-700">{loginFetcher.data.message}</p>
          </div>
        )}

        <loginFetcher.Form
          method="post"
          className="pt-6 pb-8 mt-4 mb-4 space-y-3"
        >
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-primary/20"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-primary/20"
              minLength={8}
              required
            />
          </div>
          <div>
            <button
              className="bg-primary text-white text-contrast rounded py-2 px-4 focus:shadow-outline block w-full"
              type="submit"
            >
              Sign in
            </button>
          </div>
          <div className="py-2">
            <a href="/account/register" className="font-thin">
              Create an account
            </a>
            .
          </div>
        </loginFetcher.Form>
      </div>
    </div>
  );
}
