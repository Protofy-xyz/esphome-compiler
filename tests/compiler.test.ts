import path from "path";
import {
  buildPath,
  buildDir,
  artifactName,
  compileMessage,
} from "../packages/app/bundles/custom/apis/compilerPaths";

describe("build path resolution", () => {
  it("returns legacy path when no projectId", () => {
    expect(buildPath("mydevice", "abc123")).toBe("build/mydevice-abc123");
  });

  it("returns legacy path when projectId is undefined", () => {
    expect(buildPath("mydevice", "abc123", undefined)).toBe(
      "build/mydevice-abc123"
    );
  });

  it("returns project-scoped path when projectId present", () => {
    expect(buildPath("mydevice", "abc123", "p1d2f3")).toBe(
      "build/p1d2f3/mydevice"
    );
  });
});

describe("build dir resolution", () => {
  it("returns legacy buildDir when no projectId", () => {
    const result = buildDir("/data/esphome", "mydevice", "abc123");
    expect(result).toBe(
      path.join("/data/esphome", ".esphome", "build", "mydevice-abc123", ".pioenvs", "mydevice")
    );
  });

  it("returns project-scoped buildDir when projectId present", () => {
    const result = buildDir("/data/esphome", "mydevice", "abc123", "p1d2f3");
    expect(result).toBe(
      path.join("/data/esphome", ".esphome", "build", "p1d2f3", "mydevice", ".pioenvs", "mydevice")
    );
  });
});

describe("compile message factory", () => {
  it("includes network when provided", () => {
    const msg = compileMessage(
      { message: "compiling", deviceName: "mydevice" },
      "default"
    );
    expect(msg).toHaveProperty("network", "default");
    expect(msg).toHaveProperty("message", "compiling");
    expect(msg).toHaveProperty("deviceName", "mydevice");
  });

  it("omits network when not provided (retrocompat)", () => {
    const msg = compileMessage({ message: "compiling", deviceName: "mydevice" });
    expect(msg).not.toHaveProperty("network");
  });

  it("omits network when undefined", () => {
    const msg = compileMessage(
      { message: "compiling", deviceName: "mydevice" },
      undefined
    );
    expect(msg).not.toHaveProperty("network");
  });

  it("always includes deviceName", () => {
    const msg = compileMessage({ deviceName: "mydevice" });
    expect(msg).toHaveProperty("deviceName", "mydevice");
  });

  it("includes event and code when provided", () => {
    const msg = compileMessage(
      { event: "exit", code: 0, deviceName: "mydevice" },
      "default"
    );
    expect(msg).toHaveProperty("event", "exit");
    expect(msg).toHaveProperty("code", 0);
    expect(msg).toHaveProperty("network", "default");
    expect(msg).toHaveProperty("deviceName", "mydevice");
  });
});

describe("artifact file name", () => {
  it("always uses device-sessionId regardless of projectId", () => {
    expect(artifactName("mydevice", "abc123")).toBe("mydevice-abc123");
  });

  it("produces consistent names for same inputs", () => {
    const name1 = artifactName("sensor", "deadbeef");
    const name2 = artifactName("sensor", "deadbeef");
    expect(name1).toBe(name2);
    expect(name1).toBe("sensor-deadbeef");
  });
});
