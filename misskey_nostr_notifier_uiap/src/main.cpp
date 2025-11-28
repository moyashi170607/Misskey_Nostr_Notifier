#include <Arduino.h>

#include <queue>

#define BUILTIN_LED 2

#define LED_RED 9
#define LED_GREEN 8
#define LED_BLUE 7

#define BUZZ_PIN 5

std::queue<String> serial_queue;

// LED点灯状態の管理
bool is_led_on = false;
bool is_cooltime = false;

unsigned long led_on_time = 0;
unsigned long cooltime_on_time = 0;

const unsigned long LED_DURATION = 1000;  // 1秒点灯
const unsigned long COOLTIME_DURATION = 300;

void set_rgb_LED(bool r, bool g, bool b) {
    if (r) {
        digitalWrite(LED_RED, LOW);
    } else {
        digitalWrite(LED_RED, HIGH);
    }

    if (g) {
        digitalWrite(LED_GREEN, LOW);
    } else {
        digitalWrite(LED_GREEN, HIGH);
    }

    if (b) {
        digitalWrite(LED_BLUE, LOW);
    } else {
        digitalWrite(LED_BLUE, HIGH);
    }
}

// the setup function runs once when you press reset or power the board
void setup() {
    // initialize digital pin LED_BUILTIN as an output.
    pinMode(LED_RED, OUTPUT);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_BLUE, OUTPUT);
    pinMode(BUILTIN_LED, OUTPUT);
    pinMode(BUZZ_PIN, OUTPUT);
    set_rgb_LED(true, true, true);

    Serial.begin(9600);  // シリアル通信を初期化する。通信速度は9600bps
    delay(500);

    Serial.println("Start");
    set_rgb_LED(false, false, false);
}

// シリアル通信からデータを受け取る
void receive_serial() {
    char message_c = Serial.read();
    if (message_c != -1) {
        String message = message_c + Serial.readStringUntil('\n');

        Serial.print("Received: ");
        Serial.println(message);

        serial_queue.push(message);
    }
}

void pin_manager() {
    // LED点灯中の場合、時間チェック
    if (is_led_on) {
        unsigned long elapsed = millis() - led_on_time;
        if (elapsed >= LED_DURATION) {
            is_led_on = false;
            set_rgb_LED(false, false, false);
            digitalWrite(BUZZ_PIN, LOW);

            cooltime_on_time = millis();
            is_cooltime = true;
        }
    } else if (is_cooltime) {
        unsigned long elapsed = millis() - cooltime_on_time;
        if (elapsed >= COOLTIME_DURATION) {
            is_cooltime = false;
        }
    }
}

// キューから取り出して処理
void process_queue() {
    // キューにメッセージがあれば処理
    if (serial_queue.size() > 0 && !is_cooltime && !is_led_on) {
        String message = serial_queue.front();
        serial_queue.pop();

        if (message == "misskey") {
            set_rgb_LED(false, true, false);
            digitalWrite(BUZZ_PIN, HIGH);
            is_led_on = true;
            led_on_time = millis();
        } else if (message == "nostr") {
            set_rgb_LED(true, false, true);
            digitalWrite(BUZZ_PIN, HIGH);
            is_led_on = true;
            led_on_time = millis();
        }
    }
}

// the loop function runs over and over again forever
void loop() {
    receive_serial();
    pin_manager();
    process_queue();
}
