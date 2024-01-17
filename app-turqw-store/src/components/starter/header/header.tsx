import { component$ } from '@builder.io/qwik';
import { QwikLogo } from '../icons/qwik';
import styles from './header.module.css';
import { Cart } from '~/components/cart/Cart';

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={styles.logo}>
        <a href="/" title="qwik">
          <QwikLogo />
        </a>
      </div>
      <ul>
        <li>
          <Cart/>
        </li>
      </ul>
    </header>
  );
});
