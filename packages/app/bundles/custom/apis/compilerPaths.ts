import path from "path";

/**
 * Computes the ESPHome build_path for a device compilation.
 * - Legacy (no projectId): "build/{device}-{sessionId}"
 * - With projectId: "build/{projectId}/{device}" (enables incremental PlatformIO builds)
 */
export function buildPath(
  targetDevice: string,
  compileSessionId: string,
  projectId?: string
): string {
  if (projectId) {
    return `build/${projectId}/${targetDevice}`;
  }
  return `build/${targetDevice}-${compileSessionId}`;
}

/**
 * Resolves the PlatformIO build directory where compiled artifacts live.
 * Must match the build_path written into the YAML — ESPHome creates the
 * PlatformIO project at {cwd}/{build_path}/, and firmware ends up in
 * {build_path}/.pioenvs/{device}/.
 */
export function buildDir(
  esphomeDataDir: string,
  targetDevice: string,
  compileSessionId: string,
  projectId?: string
): string {
  if (projectId) {
    return path.join(
      esphomeDataDir,
      ".esphome",
      "build",
      projectId,
      targetDevice,
      ".pioenvs",
      targetDevice
    );
  }
  return path.join(
    esphomeDataDir,
    ".esphome",
    "build",
    `${targetDevice}-${compileSessionId}`,
    ".pioenvs",
    targetDevice
  );
}

/**
 * Artifact file name — always {device}-{sessionId}, independent of projectId.
 * This ensures download URLs remain stable.
 */
export function artifactName(
  targetDevice: string,
  compileSessionId: string
): string {
  return `${targetDevice}-${compileSessionId}`;
}

/**
 * Builds an MQTT message payload for compilation events.
 * Includes `network` only when provided (retrocompatibility with older Ventos).
 */
export function compileMessage(
  base: {
    message?: string;
    event?: string;
    code?: number;
    deviceName: string;
  },
  network?: string
): Record<string, unknown> {
  const msg: Record<string, unknown> = { ...base };
  if (network !== undefined) {
    msg.network = network;
  }
  return msg;
}
