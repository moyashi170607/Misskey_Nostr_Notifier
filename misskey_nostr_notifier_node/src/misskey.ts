import * as Misskey from "misskey-js";
import type { APIClient } from "misskey-js/api.js";
import { MISSKEY_API, MISSKEY_ORIGIN } from "./config.ts";
import { port, sendMessage } from "./serial.ts";




/**
 * MisskeyとのWebSocketでの通信を開始する関数
 *
 * @export
 * @async
 * @returns {Promise<void>} 
 */
export async function openMisskeyNotifier(): Promise<void> {
    const cli: APIClient = new Misskey.api.APIClient({
        origin: MISSKEY_ORIGIN,
        credential: MISSKEY_API
    })

    const meta = await cli.request('meta', { detail: true });

    const stream: Misskey.Stream = new Misskey.Stream(MISSKEY_ORIGIN, { token: MISSKEY_API });
    const mainChannel = stream.useChannel('main');
    stream.on('_connected_', () => {
        console.log(MISSKEY_ORIGIN + 'に接続しました');
    });
    mainChannel.on('notification', (notification: any) => {
        console.log('notification received', notification);
        sendMessage(port, "misskey\n")
    });
}

