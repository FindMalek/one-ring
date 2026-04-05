import { z } from "zod";

/** Single chord like cmd+c, super+space (lowercase segments). */
const chordSchema = z.string().min(1);

const intentEntrySchema = z.object({
  mac: chordSchema.optional(),
  linux: chordSchema.optional(),
});

export const mapYamlSchema = z.object({
  version: z.number().int().optional().default(1),
  /** Linux: generate a layer that maps Super to Command-like behavior */
  super_as_command: z.boolean().optional().default(false),
  /** Free-form intent → per-OS chords (documentation + compiler hooks) */
  intents: z.record(intentEntrySchema).optional().default({}),
  /** Extra keyd lines appended under [main] (advanced) */
  keyd_extra: z.array(z.string()).optional().default([]),
});

export type MapYaml = z.infer<typeof mapYamlSchema>;
