import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, type RequestEventLoader } from "@builder.io/qwik-city";
import { Facebook } from "~/components/icons/facebook";
import { GitHub } from "~/components/icons/github";
import { LinkedIn } from "~/components/icons/linkedin";
import { Twitter } from "~/components/icons/twitter";
import { User } from "~/components/icons/user";
import { Youtube } from "~/components/icons/youtube";
import { tursoClient } from "~/lib/turso";

interface SocialLinks {
  website: string;
  link: string;
  id: number;
}

interface UserData {
  full_name: string;
  username: string;
}

interface UserLinksResponse {
  user: UserData | null;
  links: SocialLinks[] | null;
  greeting: string | null;
}

export const ICON_COLOR_STYLE = "fill-teal-700";

export const SocialLink = (props: SocialLinks) => {
  const getIcon = () => {
    if (props.website === "GitHub")
      return <GitHub colorStyle={ICON_COLOR_STYLE} />;
    if (props.website === "Twitter")
      return <Twitter colorStyle={ICON_COLOR_STYLE} />;
    if (props.website === "Youtube")
      return <Youtube colorStyle={ICON_COLOR_STYLE} />;
    if (props.website === "Linkedin")
      return <LinkedIn colorStyle={ICON_COLOR_STYLE} />;
    if (props.website === "Facebook")
      return <Facebook colorStyle={ICON_COLOR_STYLE} />;
  };
  const url = () => {
    if (!props.link.includes("http")) {
      return "https://" + props.link.replace(/^(http(s)?:\/\/)/gi, "https://");
    }
    return props.link;
  };
  return (
    <a class="flex space-x-3" href={url()} target="_blank">
      <div
        id="social-link"
        class="w-full p-2 text-gray-600 bg-teal-200 hover:bg-teal-300 rounded-md flex space-x-3"
      >
        {getIcon()} <span>{props.website}</span>
      </div>
    </a>
  );
};

export const useLinksLoader = routeLoader$(
  async (requestEvent: RequestEventLoader): Promise<UserLinksResponse> => {
    const { params, status, url } = requestEvent;
    // get local greeting
    const response = await fetch(`${url.origin}/get-local-greeting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let { greeting } = await response.json();
    greeting = greeting || "Hello";

    const db = tursoClient(requestEvent)
    const userResponse = await db.execute({
      sql: "select users.full_name, links.id, links.website, links.link from users left join links on users.id = links.user_id where users.username = ?;",
      args: [params.username],
    });
    const userData = userResponse.rows;
    if (!userResponse.rows.length) {
      status(404);
      return {
        user: null,
        links: null,
        greeting,
      };
    }
    const { full_name, username } = userData[0] as unknown as UserData;
    const links: SocialLinks[] = userData.map((link) => ({
      id: link.id as number,
      link: link.link as string,
      website: link.website as string,
    }));

    return {
      user: { full_name, username },
      links,
      greeting,
    };
  }
);

export default component$(() => {
  const links = useLinksLoader();

  if (!links.value.user) {
    return (
      <div class="flex flex-col justify-center items-center p-8">
        <div class="text-2xl p-4 text-teal-700">User doesn't exist!</div>
      </div>
    );
  }

  return (
    <div class="p-8 mx-auto max-w-xl">
      <h1 class="p-2 text-center font-bold text-xl text-teal-700 flex justify-center space-x-3">
        {" "}
        <User /> <span>{links.value.user.full_name}</span>
      </h1>
      {links.value.greeting && (
        <p class="text-center text-gray-400">
          <i>{links.value.greeting}</i>
        </p>
      )}
      <div class="p-4 flex flex-col space-y-3">
        {links.value.links!.map((item: SocialLinks) => (
          <div key={item.id}>
            <SocialLink {...item}></SocialLink>
          </div>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => {
  return {
    title: params.username + " - FindMeOn",
  };
};
