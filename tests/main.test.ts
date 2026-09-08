import assert from "node:assert/strict";
import test from "node:test";
import type { JSONValue, RightMenuHostV1_2 } from "../types/rightmenu-plugin-api-v1.2.js";

test("Refresh delegates the effect to the host capability", async () => {
  let receivedCapability = "";
  let receivedRequest: JSONValue = null;
  Object.assign(globalThis, {
    RightMenu: {
      apiVersion: "1.2",
      call(capability: string, request: JSONValue) {
        receivedCapability = capability;
        receivedRequest = request;
        return { displayed: true };
      }
    } satisfies RightMenuHostV1_2
  });
  await import(`../src/main.ts?test=${Date.now()}`);
  assert.deepEqual(globalThis.rightMenuPlugin.run("refresh", null), { displayed: true });
  assert.equal(receivedCapability, "ui.flashScreen");
  assert.deepEqual(receivedRequest, {});
});

test("unknown actions fail closed", async () => {
  await assert.rejects(async () => globalThis.rightMenuPlugin.run("unknown", null), /unsupported action/);
});
