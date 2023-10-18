import { type ActionFunctionArgs, json, redirect, type ActionFunction, type MetaFunction } from "@vercel/remix";
import { useFetcher } from "@remix-run/react";
import { register } from "~/lib/session.server";
import { createOrganizationDatabase } from '~/lib/utils';
import { buildDbClient } from '~/lib/client';
import { organizations } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { LoaderIcon } from '~/components/icons';

export const meta: MetaFunction = () => {
  return [
    { title: "Register - The Mug Store" },
    { name: "description", content: "Create an account" },
  ];
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { ...values } = Object.fromEntries(formData);

  if (
    values.name === "" ||
    values.website === "" ||
    values.username === "" ||
    values.email === "" ||
    values.password === "" ||
    values.password_repeat === ""
  ) {
    return json(
      { ok: false, message: "Fields cannot be empty!" },
      { status: 422, statusText: "Incomplete form!" }
    );
  }

  // * Validate email
  const emailRgx =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  if (!emailRgx.test(values.email as string)) {
    return json(
      { ok: false, message: "Provide a valid email!" },
      { status: 422, statusText: "Provide a valid email!" }
    );
  }


  if (values.password !== values.password_repeat) {
    return json(
      { ok: false, message: "Passwords don't match!" },
      { status: 422, statusText: "Passwords don't match!" }
    );
  }

  if (/(\W)|(_)/g.test(values.username as string)) {
    return json(
      { ok: false, message: "username should only have letters and numbers!" },
      { status: 422, statusText: "Invalid username!" }
    );
  }


  const accountCreation = await register({
    name: values.name as string,
    website: values.website as string,
    username: values.username as string,
    email: values.email as string,
    password: values.password as string,
  });

  if (!accountCreation.ok || accountCreation.organization === null) {
    return json(
      { fields: values, message: accountCreation.message },
      { status: 500, statusText: accountCreation.message }
    );
  }


  // create organization database
  const newOrgDb = await createOrganizationDatabase(accountCreation.organization);

  if (!newOrgDb.ok) {
    // TODO: delete the organization added to apps database organizations table
  }

  if (newOrgDb.ok && newOrgDb.data !== null) {
    // add database credentials to organization record
    await buildDbClient().update(organizations).set({
      dbUrl: newOrgDb.data.url,
      dbToken: newOrgDb.data.authToken
    }).where(eq(organizations.id, accountCreation.organization.id)).run();

    return redirect("/login");
  }


  return json(
    { fields: values },
    { status: 500, statusText: newOrgDb.message }
  );
}

export default function Register() {
  const registerFetcher = useFetcher();

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl">Register your organization.</h1>

        {registerFetcher.state === "idle" && registerFetcher.data && (
          <div className="flex items-center justify-center my-3 bg-red-100">
            <p className="p-2 text-red-700">{(registerFetcher.data as unknown as { message: string }).message}</p>
          </div>
        )}

        <registerFetcher.Form
          method="post"
          className="pt-6 pb-8 mt-4 mb-4 space-y-3"
        >
          <div>
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Organization Name"
                aria-label="Organization Name"
                className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
              />
            </div>
          </div>
          <div>
            <input
              id="website"
              name="website"
              type="text"
              required
              placeholder="Website"
              aria-label="Website"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
            />
          </div>
          <div>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              aria-label="Username"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
            />
          </div>
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
            <input
              id="password-repeat"
              name="password_repeat"
              type="password"
              autoComplete="current-password"
              placeholder="Repeat Password"
              aria-label="Repeat Password"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-gray-500 focus-visible:outline-gray-600"
              minLength={8}
              required
            />
          </div>
          <div>
            <div>
              <button
                className="bg-primary text-white bg-gray-700 hover:bg-gray-900 rounded py-2 px-4 focus:shadow-outline flex justify-center items-center gap-3 w-full"
                type="submit"
              >
                {registerFetcher.state === "submitting" && !registerFetcher.data && <LoaderIcon styles="h-4 w-4 animate-spin fill-white" />}
                <span>Sign in</span>
              </button>
            </div>
          </div>
          <div className="py-2 font-thin">
            Have an account? <a href="/login">Log in</a>.
          </div>
        </registerFetcher.Form>
      </div>
    </div>
  );
}