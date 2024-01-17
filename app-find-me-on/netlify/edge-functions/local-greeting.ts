import type { Context, Config } from "https://edge.netlify.com/";

const translations = {
  UNKNOWN: "Hello!",
  US: "Howdy!",
  GB: "How do you do?",
  AU: "G'day, mate!",
  BR: "Olá",
  FI: "Hei",
  IN: "नमस्कार",
  HR: "Pozdrav",
  CZ: "Dobrý den",
  CA: "How's it goin', eh?",
  PT: "Olá;",
  ES: "Hola",
  TZ: "Habari!",
  ZA: "Hallo!",
};

export default async (context: Context) => {
  const countryCode = context.geo?.country?.code;
  const translation = translations[countryCode] || translations["UNKNOWN"];

  return Response.json({
    greeting: `${translation}`,
  });
};

export const config: Config = { path: "/get-local-greeting" };
