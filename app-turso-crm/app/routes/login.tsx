import { type ActionFunctionArgs, json, type ActionFunction, type MetaFunction } from "@vercel/remix";
import { useFetcher } from "@remix-run/react";

import { type LoginCredentials, createOrganizationSession, login } from "~/lib/session.server";
import { LoaderIcon } from '~/components/icons';

export const meta: MetaFunction = () => {
  return [
    { title: "Log in - Turso Author" },
    { name: "description", content: "Sign into your Turso Author account" },
  ];
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
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

  const user = await login(values as unknown as LoginCredentials);
  if (!user) {
    return json(
      { ok: false, message: "Wrong credentials!" },
      { status: 400, statusText: "Wrong credentials!" }
    );
  }

  // assign session
  return createOrganizationSession(user.id, `/dash`);
}

export default function Login() {
  const loginFetcher = useFetcher();

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center pb-12 text-3xl font-bold">
          <span className='text-teal-600'>TURSO</span><span className=' text-cyan-600 font-sans underline'>CRM</span>
        </div>

        <h1 className="text-xl text-center text-accent-800">Sign In.</h1>

        {loginFetcher.state === "idle" && loginFetcher.data && (
          <div className="flex items-center justify-center my-3 bg-red-100">
            <p className="p-2 text-red-700">{(loginFetcher.data as unknown as { message: string }).message}</p>
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
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
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
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
              minLength={8}
              required
            />
          </div>
          <div>
            <button
              className="bg-primary text-white bg-gray-700 hover:bg-gray-900 rounded py-2 px-4 focus:shadow-outline flex justify-center items-center gap-3 w-full"
              type="submit"
            >
              {loginFetcher.state === "submitting" && !loginFetcher.data && <LoaderIcon styles="h-4 w-4 animate-spin fill-white" />}
              <span>Sign in</span>
            </button>
          </div>
          <div className="py-2 font-thin">
            Don't have an account? <a href="/register">Register</a>.
          </div>
        </loginFetcher.Form>
      </div>
    </div>
  );
}