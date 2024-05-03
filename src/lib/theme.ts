import {
  CSSVariablesResolver,
  MantineColorsTuple,
  createTheme,
  Title,
} from "@mantine/core";

import localFont from "next/font/local";

const acuminVariableFont = localFont({
  src: "../../public/fonts/acumin-variable.ttf",
});

const richMastFont = localFont({
  src: "../../public/fonts/richu-mast-regular.ttf",
});

const primaryColor: MantineColorsTuple = [
  "#f2f7f4",
  "#dfece3",
  "#c2d8ca",
  "#99bca7",
  "#6c9b81",
  "#4c7d64",
  "#37614c",
  "#2d4f3f",
  "#254033",
  "#1f352b",
  "#111d18",
];
const greenColor: MantineColorsTuple = [
  "#e5ffe8",
  "#ceffd3",
  "#9cffa7",
  "#66ff78",
  "#3cff51",
  "#24ff38",
  "#14ff28",
  "#00e31b",
  "#00c912",
  "#00ae01",
];

export const theme = createTheme({
  /* Put your mantine theme override here */
  primaryColor: "teal",
  components: {
    Title: Title.extend({
      styles: {
        root: {
          color: "#37614c",
        },
      },
    }),
  },
  colors: {
    teal: primaryColor,
    green: greenColor,
  },
  fontFamily: acuminVariableFont.style.fontFamily,
  headings: {
    fontFamily: richMastFont.style.fontFamily,
  },
  other: {
    brandGreen: "#37614c",
    brandLightGreen: "#92ff9f",
  },
});

export const cssResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    "--mantine-brand-green": theme.other.brandGreen,
    "--mantine-brand-light-green": theme.other.brandLightGreen,
  },
  light: {},
  dark: {},
});
