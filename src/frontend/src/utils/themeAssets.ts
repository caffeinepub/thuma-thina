import { publicAssetUrl } from './publicAssetUrl';

/**
 * Centralized theme asset paths for Thuma Thina.
 * All theme images use deployment-safe URLs via publicAssetUrl helper.
 */
export const THEME_ASSETS = {
  logo: publicAssetUrl('/assets/generated/thuma-thina-logo.dim_512x512.png'),
  hero: publicAssetUrl('/assets/generated/thuma-thina-hero.dim_1200x600.png'),
} as const;

export type ThemeAssetKey = keyof typeof THEME_ASSETS;
