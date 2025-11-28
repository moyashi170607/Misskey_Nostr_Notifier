import type { SerialPort } from "serialport";
import { openPort, sendMessage } from "./serial.ts";
import { BOUND_RATE, PORT } from "./config.ts";
import { openNostrReceiver } from "./nostr.ts";
import type { SubCloser } from "nostr-tools/abstract-pool";
import { openMisskeyNotifier } from "./misskey.ts";
import * as Misskey from "misskey-js";


await openMisskeyNotifier()
let nostr_subscribe: SubCloser = openNostrReceiver();


