import { component$ } from "@builder.io/qwik";
import styles from "./header.module.css";
import { TursoLogo } from '~/components/icons';

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", "flex gap-8 items-center"]}>
        <div class={styles.logo}>
          <a href="/" title="qwik">
            <TursoLogo />
          </a>
        </div>
        <ul>
          <li>
            <a
              href="/all-notes"
              class="text-xl"
            >
              All Notes
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
