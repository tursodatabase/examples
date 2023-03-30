import { component$ } from "@builder.io/qwik";
import { type DocumentHead, globalAction$, Form } from "@builder.io/qwik-city";
import { LoadingAnimation } from "~/components/loading/loading";
import { Noty } from "~/components/notification/notification";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useFormAction = globalAction$(async (form) => {
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

  // populate user
  const {username, email, fullname} = form;
  const user = {username, email, fullname};
  const links: {website: string, url: string}[] = [];

  // populate links
  if ((form.twitter as string).includes("twitter.com/"))
    links.push({website: "Twitter", url: form.twitter as string});
  if ((form.linkedin as string).includes("linkedin.com/"))
    links.push({website: "Linkedin", url: form.linkedin as string});
  if ((form.facebook as string).includes("facebook.com/"))
    links.push({website: "Facebook", url: form.facebook as string});
  if ((form.github as string).includes("github.com/"))
    links.push({website: "GitHub", url: form.github as string});
  if ((form.youtube as string).includes("youtube.com/"))
    links.push({website: "Youtube", url: form.youtube as string});

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/submit-user-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user, links
    }, null, 2)
  });
  

  const dataSubmissionResponse = await response.json();

  if (!dataSubmissionResponse) {
    // status(404);
    return {
      user: null,
      links: null,
      greeting: null
    };
  }

  return dataSubmissionResponse;
});

export default component$(() => {
  const formAction = useFormAction();

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
                href={`${BASE_URL}/u/${formAction.value?.username}`}
                target="_blank"
              >{`${BASE_URL}/u/${formAction.value?.username}`}</a>
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
