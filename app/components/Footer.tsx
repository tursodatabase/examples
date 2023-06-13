import styles from "~/styles/footer.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const Footer = () => {
  return (
    <footer className="flex justify-center py-12">
      <span>
        Built with ♡ in{" "}
        <a
          href="https://remix.run/"
          target="_blank"
          className=""
          rel="noreferrer"
        >
          Remix
        </a>{" "}
        &{" "}
        <a
          href="https://turso.tech/"
          target="_blank"
          className="text-secondary-500"
          rel="noreferrer"
        >
          Turso
        </a>
        {". Hosted on "}
        <a
          href="https://developers.cloudflare.com/workers/"
          target="_blank"
          className="text-orange-500"
          rel="noreferrer"
        >
          Cloudflare Workers
        </a>
      </span>
    </footer>
  );
};
