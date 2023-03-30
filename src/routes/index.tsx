import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, globalAction$, Form } from "@builder.io/qwik-city";
import { LoadingAnimation } from "~/components/loading/loading";
import { Noty } from "~/components/notification/notification";
import { createClient } from "@libsql/client";
import { responseDataAdapter } from "./utils";

export const useFormAction = globalAction$(async (form) => {
  const db = createClient({
    url: import.meta.env.VITE_TURSO_DB_URL,
    authToken: import.meta.env.VITE_TURSO_DB_AUTH_TOKEN,
  });

  // check if atleast one link was added
  if (
    !(form.twitter as string).includes("twitter.com/") &&
    !(form.linkedin as string).includes("linkedin.com/") &&
    !(form.facebook as string).includes("facebook.com/") &&
    !(form.github as string).includes("github.com/") &&
    !(form.youtube as string).includes("youtube.com/")
  ) {
    return {
      success: false,
      message: "Add at least one link!",
    };
  }

  // add account
  await db.execute(
    "insert into users(email, username, full_name) values(?, ?, ?)",
    [form.email as string, form.username as string, form.fullname as string]
  );

  const response = await db.execute("select * from users where email = ?", [
    form.email as string,
  ]);
  const userData = responseDataAdapter(response);
  const { id, username } = userData[0];

  // add links
  if ((form.twitter as string).includes("twitter.com/"))
    await db.execute(
      "insert into links(user_id, website, link) values(?, ?, ?)",
      [id, "Twitter", form.twitter]
    );
  if ((form.linkedin as string).includes("linkedin.com/"))
    await db.execute(
      "insert into links(user_id, website, link) values(?, ?, ?)",
      [id, "Linkedin", form.linkedin]
    );
  if ((form.facebook as string).includes("facebook.com/"))
    await db.execute(
      "insert into links(user_id, website, link) values(?, ?, ?)",
      [id, "Facebook", form.facebook]
    );
  if ((form.github as string).includes("github.com/"))
    await db.execute(
      "insert into links(user_id, website, link) values(?, ?, ?)",
      [id, "GitHub", form.github]
    );
  if ((form.youtube as string).includes("youtube.com/"))
    await db.execute(
      "insert into links(user_id, website, link) values(?, ?, ?)",
      [id, "Youtube", form.youtube]
    );

  return {
    success: true,
    message: "Links added!",
    username: username,
  };
});

export default component$(() => {
  const formAction = useFormAction();
  const baseUrl = useSignal("");

  useVisibleTask$(() => {
    baseUrl.value = window.location.href;
  });

  return (
    <div class="p-8 mx-auto max-w-xl">
      <h1 class="p-2 text-center font-bold text-xl text-teal-700">FindMeOn</h1>

      <div>
        {formAction.isRunning && (
          <div class="flex justify-center w-full">
            <LoadingAnimation />
          </div>
        )}
        {formAction.value?.success && (
          <div class="flex flex-col justify-center space-y-2">
            <Noty
              message={formAction.value?.message || "Links added!"}
              type="success"
            ></Noty>
            <p class="p-2 text-center">
              You social links are now available at{" "}
              <a
                href={`${baseUrl}/u/${formAction.value?.username}`}
                target="_blank"
              >{`${baseUrl}/u/${formAction.value?.username}`}</a>
            </p>
          </div>
        )}
        {formAction.formData &&
          !formAction.isRunning &&
          !formAction.value?.success && (
            <Noty
              message={formAction.value?.message || "Failed to add you links!"}
              type="error"
            ></Noty>
          )}
      </div>

      <Form class="p-4 flex flex-col space-y-2" action={formAction} spaReset>
        <div class="p-2 font-semibold text-teal-600">User Details</div>
        <div>
          <input type="text" name="fullname" placeholder="Full Name" required />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="someone@mail.com"
            required
          />
        </div>
        <div>
          <input type="text" name="username" placeholder="username" required />
        </div>
        <div class="p-2 font-semibold text-teal-600">Social Links</div>
        <div>
          <input type="text" name="twitter" placeholder="Twitter" />
        </div>
        <div>
          <input type="text" name="linkedin" placeholder="Linkedin" />
        </div>
        <div>
          <input type="text" name="facebook" placeholder="Facebook" />
        </div>
        <div>
          <input type="text" name="github" placeholder="GitHub" />
        </div>
        <div>
          <input type="text" name="youtube" placeholder="Youtube" />
        </div>
        <div class="pt-2">
          <button type="submit">Add Links</button>
        </div>
      </Form>
      <p class="text-center text-gray-400 italic">
        ~ This little app works even when JavaScript is disabled. ~
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "FindMeOn",
  meta: [
    {
      name: "description",
      content: "All your social links in one place.",
    },
  ],
};
