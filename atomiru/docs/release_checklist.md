# リリースチェックリスト

## バージョン

- [ ] `pubspec.yaml` の `version` を更新した
- [ ] 必要なら `--build-name` / `--build-number` の値を決めた

## 見た目

- [ ] アプリアイコンを正式素材へ差し替えた
- [ ] スプラッシュ画像を正式素材へ差し替えた
- [ ] `dart run flutter_launcher_icons`
- [ ] `dart run flutter_native_splash:create`

## 導線確認

- [ ] 初回オンボーディングを確認した
- [ ] Empty State が分かりやすく表示される
- [ ] 通知権限導線を確認した
- [ ] Share 受信を確認した
- [ ] Inbox / Detail / ShareSave / Settings / Paywall が開く

## 実機確認

- [ ] Android 実機で通知権限と通知表示を確認した
- [ ] Android 実機で Share Intent を確認した
- [ ] iPhone 実機で通知権限と通知表示を確認した
- [ ] iPhone 実機で Share Extension を確認した
- [ ] 詳細は `docs/device_test_checklist.md` と `docs/ios_share_extension_checklist.md` を参照した

## 品質確認

- [ ] `flutter analyze`
- [ ] `flutter test`
- [ ] `flutter test integration_test/app_smoke_test.dart -d macos`
- [ ] Android integration test は通るか、環境依存の差異を確認して回避手順を残した
- [ ] Pro 導線を確認した
- [ ] Pro の種別ごとのデフォルト通知設定で、既存カードへの反映確認が正しく出る
- [ ] 再通知間隔が `1時間後 / 3時間後 / 6時間後 / 12時間後 / 24時間後` と表示される
- [ ] デバッグ補助 UI がリリースで出ないことを確認した

## ストア提出前

- [ ] App Store Connect / Google Play Console の情報を確認した
- [ ] ストア用メタデータを最終確認した
- [ ] Privacy Policy を用意した
- [ ] Terms を用意した
- [ ] 未整備なら TODO を残した
- [ ] release signing を確認した
- [ ] Pro 判定がストア同期ベースで動くことを実機で確認した
- [ ] Play Console の App access に Pro 機能の確認手順を書いた
- [ ] リリース記念価格を掲載する場合、固定金額ではなく期間限定価格の表現にした

## iOS / Android 手動 TODO

- [ ] Android package name を正式値へ変更した
- [ ] Android release signing を設定した
- [ ] iOS Bundle Identifier を正式値へ変更した
- [ ] iOS Share Extension target / App Groups を確認した
- [ ] iOS Signing & Capabilities を確認した
