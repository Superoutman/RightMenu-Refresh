export type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | { [key: string]: JSONValue };

export type RightMenuCapabilityV1_2 = "ui.flashScreen";

export interface RightMenuHostV1_2 {
  readonly apiVersion: "1.2";
  call(capability: "ui.flashScreen", request: Record<string, never>): { displayed: boolean };
  call(capability: string, request: JSONValue): JSONValue;
}

export interface RightMenuPluginV1 {
  run(actionID: string, input: JSONValue): JSONValue;
}

declare global {
  const RightMenu: RightMenuHostV1_2;
  var rightMenuPlugin: RightMenuPluginV1;
}
