import { Buffer } from "buffer";
if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = Buffer;
}
if (typeof (window as any).global === "undefined") {
(window as any).global = globalThis;
}
import("./root");