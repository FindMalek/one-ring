import yaml from "js-yaml";
import type { Profile } from "./lib/schemas";
import { profileSchema } from "./lib/schemas";

export type WizardState = {
  machine: string;
  modules: NonNullable<Profile["modules"]>;
  selected_apps: string[];
};

export function defaultWizardState(machine: string): WizardState {
  return {
    machine,
    modules: {
      core: true,
      terminal: true,
      keyboard: true,
      ide: true,
      apps: true,
      browser: false,
    },
    selected_apps: [],
  };
}

export function defaultProfileYaml(state: WizardState): string {
  const profile: Profile = {
    machine: state.machine,
    name: state.machine,
    modules: state.modules,
    selected_apps: state.selected_apps,
  };
  return yaml.dump(profile, { lineWidth: 120, noRefs: true });
}

export function profileFromWizardState(state: WizardState): Profile {
  return profileSchema.parse({
    machine: state.machine,
    name: state.machine,
    modules: state.modules,
    selected_apps: state.selected_apps,
  });
}
