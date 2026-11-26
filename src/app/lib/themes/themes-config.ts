export interface ThemeConfig {
  label: string;
  description: string;
  colors: {
    name: string;
    variable: string;
  }[];
}

export const THEME_CONFIG = {
  tokyonight: {
    label: "Tokyo Night",
    description: "Uma interface escura com tons azulados.",
    colors: [
      { name: "Background", variable: "--color-bg-primary-tokyonight" },
      {
        name: "Background secundário",
        variable: "--color-bg-secondary-tokyonight",
      },
      { name: "Texto principal", variable: "--color-txt-primary-tokyonight" },
      {
        name: "Texto secundário",
        variable: "--color-txt-secondary-tokyonight",
      },
      { name: "Borda", variable: "--color-border-button-tokyonight" },
      { name: "Accent", variable: "--color-accent-tokyonight" },
    ],
  },
  cafeteria: {
    label: "Cafeteria",
    description:
      "Tons quentes de creme, caramelo e café com destaque verde oliva.",
    colors: [
      { name: "Background", variable: "--color-bg-primary-cafeteria" },
      {
        name: "Background secundário",
        variable: "--color-bg-secondary-cafeteria",
      },
      { name: "Texto principal", variable: "--color-txt-primary-cafeteria" },
      {
        name: "Texto secundário",
        variable: "--color-txt-secondary-cafeteria",
      },
      { name: "Borda", variable: "--color-border-button-cafeteria" },
      { name: "Accent", variable: "--color-accent-cafeteria" },
    ],
  },
  savana: {
    label: "Savana",
    description:
      "Tons quentes de terra, marfim e ouro solar inspirados nas paisagens e tecidos africanos.",
    colors: [
      { name: "Background", variable: "--color-bg-primary-savana" },
      {
        name: "Background secundário",
        variable: "--color-bg-secondary-savana",
      },
      { name: "Texto principal", variable: "--color-txt-primary-savana" },
      {
        name: "Texto secundário",
        variable: "--color-txt-secondary-savana",
      },
      { name: "Borda", variable: "--color-border-button-savana" },
      { name: "Accent", variable: "--color-accent-savana" },
    ],
  },

  terracota: {
    label: "Terracotta Dawn",
    description:
      "Tema claro editorial com fundo marfim-areia, tipografia espresso e destaque em terracota queimada.",
    colors: [
      { name: "Background", variable: "--color-bg-primary-terracota" },
      {
        name: "Background secundário",
        variable: "--color-bg-secondary-terracota",
      },
      { name: "Texto principal", variable: "--color-txt-primary-terracota" },
      {
        name: "Texto secundário",
        variable: "--color-txt-secondary-terracota",
      },
      { name: "Borda", variable: "--color-border-button-terracota" },
      { name: "Accent", variable: "--color-accent-terracota" },
    ],
  },
} as const satisfies Record<string, ThemeConfig>;

export type OptionalTheme = keyof typeof THEME_CONFIG;

export const OPTIONAL_THEMES = Object.keys(THEME_CONFIG) as OptionalTheme[];
