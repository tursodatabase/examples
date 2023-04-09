import { createClient } from '@libsql/client/web';

export default function () {
  const vars = useRuntimeConfig();

  const config = {
    url: vars.tursoDbUrl,
    authToken: vars.tursoDbToken,
  };

  return createClient(config);
}