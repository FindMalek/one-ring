import React, { useMemo, useState } from "react";
import { Box, Text, useInput } from "ink";
import { detect } from "./detect";
import { loadPackageList } from "./lib/config-load";
import { hasInstallForOs, mergeCatalog } from "../modules/apps";
import {
  defaultWizardState,
  profileFromWizardState,
  type WizardState,
} from "./wizard-state";

type Step = "machine" | "modules" | "apps" | "done";

export type WizardAppProps = {
  configDir: string;
  dryRun: boolean;
  onDone: (state: WizardState) => void | Promise<void>;
  onCancel: () => void;
};

export function WizardApp({ configDir, dryRun, onDone, onCancel }: WizardAppProps) {
  const d = useMemo(() => detect(), []);
  const catalog = useMemo(() => {
    const mac = loadPackageList(configDir, "apps-mac.yaml");
    const linux = loadPackageList(configDir, "apps-linux.yaml");
    return mergeCatalog(mac, linux);
  }, [configDir]);

  const [step, setStep] = useState<Step>("machine");
  const [machine, setMachine] = useState("");
  const [machineBuffer, setMachineBuffer] = useState("");
  const [modIdx, setModIdx] = useState(0);
  const [mods, setMods] = useState(defaultWizardState("").modules);
  const [appIdx, setAppIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const modKeys = ["core", "terminal", "keyboard", "ide", "apps", "browser"] as const;

  useInput((input, key) => {
    if (key.ctrl && input === "c") {
      onCancel();
      return;
    }

    if (step === "machine") {
      if (key.return) {
        const name = machineBuffer.trim() || "default";
        setMachine(name);
        setMods(defaultWizardState(name).modules);
        setStep("modules");
        setModIdx(0);
        return;
      }
      if (key.backspace || key.delete) {
        setMachineBuffer((b) => b.slice(0, -1));
        return;
      }
      if (input && !key.ctrl && !key.meta) {
        setMachineBuffer((b) => b + input);
      }
      return;
    }

    if (step === "modules") {
      if (key.upArrow) {
        setModIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (key.downArrow) {
        setModIdx((i) => Math.min(modKeys.length - 1, i + 1));
        return;
      }
      if (input === " ") {
        const k = modKeys[modIdx];
        setMods((m) => ({ ...m, [k]: !m[k] }));
        return;
      }
      if (key.return) {
        setStep("apps");
        const init: Record<string, boolean> = {};
        for (const e of catalog) {
          init[e.name] = hasInstallForOs(e, d);
        }
        setSelected(init);
        setAppIdx(0);
        return;
      }
      return;
    }

    if (step === "apps") {
      if (key.upArrow) {
        setAppIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (key.downArrow) {
        setAppIdx((i) => Math.min(catalog.length - 1, i + 1));
        return;
      }
      if (input === " ") {
        const name = catalog[appIdx]?.name;
        if (name) setSelected((s) => ({ ...s, [name]: !s[name] }));
        return;
      }
      if (key.return) {
        const selected_apps = Object.entries(selected)
          .filter(([, v]) => v)
          .map(([k]) => k);
        const state: WizardState = {
          machine,
          modules: mods,
          selected_apps,
        };
        void onDone(state);
        setStep("done");
        return;
      }
      return;
    }
  });

  if (step === "machine") {
    return (
      <Box flexDirection="column">
        <Text bold>OneRing wizard</Text>
        <Text>Machine / profile name, then Enter:</Text>
        <Text color="cyan">{machineBuffer.length ? machineBuffer : " "}_</Text>
        <Text dimColor>Enter confirm · Ctrl+C cancel</Text>
      </Box>
    );
  }

  if (step === "modules") {
    return (
      <Box flexDirection="column">
        <Text bold>Modules for “{machine}”</Text>
        <Text dimColor>Space toggle · ↑↓ move · Enter continue</Text>
        {modKeys.map((k, i) => (
          <Text key={k} color={i === modIdx ? "cyan" : undefined}>
            {i === modIdx ? "› " : "  "}
            [{mods[k] ? "x" : " "}] {k}
          </Text>
        ))}
      </Box>
    );
  }

  if (step === "apps") {
    return (
      <Box flexDirection="column">
        <Text bold>Select apps</Text>
        <Text dimColor>Space toggle · ↑↓ move · Enter apply</Text>
        {catalog.map((e, i) => (
          <Text key={e.name} color={i === appIdx ? "cyan" : undefined}>
            {i === appIdx ? "› " : "  "}
            [{selected[e.name] ? "x" : " "}] {e.name}
            {dryRun ? " (dry-run)" : ""}
          </Text>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Text>Applying…</Text>
    </Box>
  );
}
