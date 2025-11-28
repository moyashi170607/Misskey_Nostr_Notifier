import { SimplePool } from "nostr-tools";
import { PK_HEX, RELAYS } from "./config.ts";
import { port, sendMessage } from "./serial.ts";
import type { SubCloser } from "nostr-tools/abstract-pool";


const pool = new SimplePool()

/**
 * Nostrのイベントを取得するためのオブジェクトを生成し、取得を開始
 * 対応しているイベント
 * - 1 投稿内のメンション
 * - 4 旧仕様DM
 * - 6 リポスト
 * - 7 リアクション
 * - 8 バッジの授与
 * - 16 汎用リポスト
 * - 42 チャンネルメッセージ
 * - 1059 新DM
 * - 9735 Zap
 * - 30023 長文投稿
 * @returns {SubCloser} 
 */
export function openNostrReceiver(): SubCloser {
    const sub: SubCloser = pool.subscribe(
        RELAYS,
        {
            kinds: [1, 4, 6, 7, 8, 16, 42, 1059, 9735, 30023],
            limit: 0,
            "#p": [PK_HEX] //自分がメンションされているものを取得
        },
        {
            // 新しいイベントが届くたびに実行
            async onevent(event) {
                if (event.pubkey != PK_HEX) {
                    sendMessage(port, "nostr\n");
                    console.log(event)
                }
            },
            // リレーが既存のイベントをすべて送信し終えたときに実行
            oneose() {
                console.log('End of stored events.');
                // 購読を終了したい場合はここで sub.close() を呼び出す
                // sub.close();
            },
        }
    );

    console.log("Nostrに接続")

    return sub;
}

