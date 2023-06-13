// import type { LinksFunction } from "@remix-run/cloudflare";
import { Cart } from "./Cart";
import { AccountIcon } from "./Icon";

export const Header = () => {
  return (
    <header className={`header`}>
      <ul className="flex justify-start">
        <li>
          <a href="/mugs" className="text-white font-thin">
            {" "}
            All Mugs{" "}
          </a>
        </li>
      </ul>
      <div className={`logo`}>
        <a
          href="/"
          title="Turix Store"
          className="font-semibold text-center text-white no-decoration"
        >
          <span className="text-secondary-300 font-semibold text-center text-xl">
            The M🍵g Store
          </span>
        </a>
      </div>
      <ul className="space-x-1">
        <li>
          <Cart />
        </li>
        <li>
          <a href="/account/dashboard" title="account">
            <AccountIcon color="#4ff8d2" />
          </a>
        </li>
      </ul>
    </header>
  );
};
