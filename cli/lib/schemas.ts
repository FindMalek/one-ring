import { z } from "zod";

export const packageEntrySchema = z.object({
  name: z.string(),
  mac: z.string().nullable().optional(),
  linux: z.string().nullable().optional(),
  category: z.string().optional(),
});

export type PackageEntry = z.infer<typeof packageEntrySchema>;

export const profileSchema = z.object({
  name: z.string().optional(),
  machine: z.string().optional(),
  modules: z
    .object({
      core: z.boolean().optional().default(true),
      terminal: z.boolean().optional().default(true),
      keyboard: z.boolean().optional().default(true),
      ide: z.boolean().optional().default(true),
      apps: z.boolean().optional().default(true),
      browser: z.boolean().optional().default(false),
    })
    .optional()
    .default({}),
  /** Selected package names from apps-*.yaml */
  selected_apps: z.array(z.string()).optional().default([]),
});

export type Profile = z.infer<typeof profileSchema>;

export const extensionEntrySchema = z.object({
  name: z.string(),
  chrome_id: z.string(),
  firefox_id: z.string(),
  platforms: z.array(z.enum(["mac", "linux"])).optional().default(["mac", "linux"]),
});

export type ExtensionEntry = z.infer<typeof extensionEntrySchema>;
