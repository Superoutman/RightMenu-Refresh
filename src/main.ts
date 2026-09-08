import type { JSONValue } from "../types/rightmenu-plugin-api-v1.2.js";

globalThis.rightMenuPlugin = Object.freeze({
  run(actionID: string, _input: JSONValue): JSONValue {
    if (actionID !== "refresh") throw new Error(`unsupported action: ${actionID}`);
    return RightMenu.call("ui.flashScreen", {});
  }
});
