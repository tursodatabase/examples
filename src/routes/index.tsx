import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, Form, routeAction$, type RequestEventAction } from "@builder.io/qwik-city";
import { LoadingAnimation } from "~/components/loading/loading";
import { Noty } from "~/components/notification/notification";
import { tursoClient } from "~/lib/turso";

export const useFormAction = routeAction$(async (data, requestEvent: RequestEventAction) => {
  const db = tursoClient(requestEvent);
  // check if atleast one link was added
  if (
    !(data.twitter as string).includes("twitter.com/") &&
    !(data.linkedin as string).includes("linkedin.com/") &&
    !(data.facebook as string).includes("facebook.com/") &&
    !(data.github as string).includes("github.com/") &&
    !(data.youtube as string).includes("youtube.com/")
  ) {
    return {
      success: false,
      message: "Add at least one link!",
    };
  }

  // add account
  await db.execute({
    sql: "insert into users(email, username, full_name) values(?, ?, ?)",
    args: [
      data.email as string,
      data.username as string,
      data.fullname as string,
    ],
  });

  const transaction = await db.transaction();
  const response = await transaction.execute({
    sql: "select * from users where email = ?",
    args: [data.email as string],
  });
  const { id, username } = response.rows[0];

  // add links
  if ((data.twitter as string).includes("twitter.com/"))
    await transaction.execute({
      sql: "insert into links(user_id, website, link) values(?, ?, ?)",
      args: [id, "Twitter", data.twitter as string],
    });
  if ((data.linkedin as string).includes("linkedin.com/"))
    await transaction.execute({
      sql: "insert into links(user_id, website, link) values(?, ?, ?)",
      args: [id, "Linkedin", data.linkedin as string],
    });
  if ((data.facebook as string).includes("facebook.com/"))
    await transaction.execute({
      sql: "insert into links(user_id, website, link) values(?, ?, ?)",
      args: [id, "Facebook", data.facebook as string],
    });
  if ((data.github as string).includes("github.com/"))
    await transaction.execute({
      sql: "insert into links(user_id, website, link) values(?, ?, ?)",
      args: [id, "GitHub", data.github as string],
    });
  if ((data.youtube as string).includes("youtube.com/"))
    await transaction.execute({
      sql: "insert into links(user_id, website, link) values(?, ?, ?)",
      args: [id, "Youtube", data.youtube as string],
    });
  await transaction.commit();

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
              message={formAction.value.message || "Links added!"}
              type="success"
            ></Noty>
            <p class="p-2 text-center">
              You social links are now available at{" "}
              <a
                href={`${baseUrl.value}/u/${formAction.value.username}`}
                target="_blank"
              >{`${baseUrl}/u/${formAction.value.username}`}</a>
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
