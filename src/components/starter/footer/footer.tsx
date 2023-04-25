import { component$ } from '@builder.io/qwik';
import { useServerTimeLoader } from '~/routes/layout';
import styles from './footer.module.css';

export default component$(() => {
  const serverTime = useServerTimeLoader();

  return (
    <footer>
      <a href="https://www.builder.io/" target="_blank" class={styles.anchor}>
        Built with ♡ in Qwik & Turso
        <span class={styles.spacer}>|</span>
        <span>{serverTime.value.date}</span>
      </a>
    </footer>
  );
});
