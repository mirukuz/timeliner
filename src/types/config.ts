export interface TimelinerConfig {
  title: string;
  description: string;
  /** Built-in theme name (chalk | ocean | neon | parchment) or absolute URL path to a CSS file */
  theme: string;
  lang: {
    primary: string;
    /** Set to false to disable the secondary language page */
    secondary: string | false;
  };
  photos: {
    thumbWidth: number;
  };
}
