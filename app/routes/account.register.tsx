import { type ActionArgs, json, redirect, type ActionFunction, V2_MetaFunction } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import { register } from "~/lib/session.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Register - The Mug Store" },
    { name: "description", content: "Create an account" },
  ];
};

export const action: ActionFunction = async ({ request, context }: ActionArgs) => {
  const formData = await request.formData();
  const { ...values } = Object.fromEntries(formData);

  if (
    !values.email ||
    !values.password ||
    !values.password_repeat ||
    !values.first_name ||
    !values.last_name ||
    !values.phone ||
    typeof values.email !== "string" ||
    typeof values.password != "string" ||
    typeof values.password_repeat != "string" ||
    typeof values.first_name != "string" ||
    typeof values.last_name != "string" ||
    typeof values.phone != "string"
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

  const accountCreation = await register({
    firstName: values.first_name,
    lastName: values.last_name,
    email: values.email,
    password: values.password,
    phone: values.phone,
  }, context);

  if (accountCreation.user) {
    return redirect("/account/login");
  }

  return json(
    { fields: values },
    { status: 500, statusText: accountCreation.message }
  );
}

export default function Register() {
  const registerFetcher = useFetcher();

  return (
    <div className="flex justify-center my-24 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl">Create an Account.</h1>
        <code>
          {JSON.stringify(registerFetcher.data)}
        </code>
        {registerFetcher.state === "idle" && registerFetcher.data && (
          <div className="flex items-center justify-center my-3 bg-red-100">
            <p className="p-2 text-red-700">{registerFetcher.data.message}</p>
          </div>
        )}

        <registerFetcher.Form
          method="post"
          className="pt-6 pb-8 mt-4 mb-4 space-y-3"
        >
          <div>
            <div>
              <input
                id="first-name"
                name="first_name"
                type="text"
                required
                placeholder="First Name"
                aria-label="First Name"
                className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-primary/20"
              />
            </div>
          </div>
          <div>
            <input
              id="last-name"
              name="last_name"
              type="text"
              required
              placeholder="Last Name"
              aria-label="Last Name"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-primary/20"
            />
          </div>
          <div>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="Phone Number"
              aria-label="Phone Number"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-primary/20"
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
            <input
              id="password-repeat"
              name="password_repeat"
              type="password"
              autoComplete="current-password"
              placeholder="Repeat Password"
              aria-label="Repeat Password"
              className="mb-1 appearance-none rounded dark:bg-transparent border focus:border-primary/50 focus:ring-0 w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline border-primary/20"
              minLength={8}
              required
            />
          </div>
          <div>
            <div>
              <button
                className="bg-primary text-white text-contrast rounded py-2 px-4 focus:shadow-outline block w-full"
                type="submit"
              >
                Sign in
              </button>
            </div>
          </div>
          <div className="py-2 font-thin">
            Have an account? <a href="/account/login">Log in</a>.
          </div>
        </registerFetcher.Form>
      </div>
    </div>
  );
}
