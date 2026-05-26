# Hissatsu Mod

`H` キーで必殺技を発動する Fabric MOD のひな形です。

動作:
- クライアントでキー入力を検知
- サーバーへパケット送信
- クールダウンを判定
- 前方への突進、周囲へのダメージ、ノックバック、演出を実行

## 先にやること
`gradle.properties` のバージョンを、Fabric のテンプレートジェネレーターで選んだ Minecraft / Loader / Fabric API に合わせて調整してください。
Fabric のドキュメントでは、キー設定はクライアント側で登録し、入力反応もクライアント側で行うこと、サーバーとの同期が必要ならネットワークを使うことが案内されています。citeturn194097view0turn865391view0

## ビルド
```bash
./gradlew build
```

## 参考
Fabric の公式ドキュメントでは、カスタムキー割り当ての登録と `ClientTickEvents.END_CLIENT_TICK` での反応、ならびに `ClientPlayNetworking.send` / `ServerPlayNetworking.registerGlobalReceiver` を使ったクライアント→サーバー通信が紹介されています。citeturn376390view0turn865391view0
