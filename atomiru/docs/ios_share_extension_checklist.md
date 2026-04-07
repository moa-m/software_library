# iOS Share Extension チェックリスト

`receive_sharing_intent` を使った iOS Share Extension は、Flutter 側のコードだけでは完結しません。`ios/Runner.xcworkspace` を Xcode で開き、次を確認してください。

## Target / Signing

- [ ] `Share Extension` target が作成されている
- [ ] `Runner` と `Share Extension` の deployment target が揃っている
- [ ] `Runner` と `Share Extension` の Bundle Identifier が期待値どおり
- [ ] `Signing & Capabilities` で両 target の signing team が正しい

## App Groups

- [ ] `Runner` に App Groups が追加されている
- [ ] `Share Extension` に同じ App Group が追加されている
- [ ] `CUSTOM_GROUP_ID` または entitlements 内の group 値が一致している
- [ ] [Runner.entitlements](/Users/moa/Project/Mobile_Project/atomiru/ios/Runner/Runner.entitlements) が target に設定されている
- [ ] [Share Extension.entitlements](/Users/moa/Project/Mobile_Project/atomiru/ios/Share%20Extension/Share%20Extension.entitlements) が target に設定されている

## Pod / Build

- [ ] [Podfile](/Users/moa/Project/Mobile_Project/atomiru/ios/Podfile) の `target 'Share Extension'` ブロックを有効化した
- [ ] `cd ios && pod install && cd ..` を実行した
- [ ] `Embed Foundation Extension` が `Thin Binary` より上にある

## Info.plist / Controller

- [ ] [ios/Share Extension/Info.plist](/Users/moa/Project/Mobile_Project/atomiru/ios/Share%20Extension/Info.plist) が target に紐づいている
- [ ] `InfoPlist.strings` の `en` / `ja` が target resources に含まれている
- [ ] text / web URL を扱う `NSExtensionActivationRule` が入っている
- [ ] [ios/Share Extension/ShareViewController.swift](/Users/moa/Project/Mobile_Project/atomiru/ios/Share%20Extension/ShareViewController.swift) が `RSIShareViewController` 継承になっている
- [ ] [ios/Runner/Info.plist](/Users/moa/Project/Mobile_Project/atomiru/ios/Runner/Info.plist) の `AppGroupId` と URL scheme が正しい

## 実機確認

- [ ] 英語端末で Safari から URL を共有して `Catch Up Later` が候補に出る
- [ ] 日本語端末で Safari から URL を共有して `あとみる` が候補に出る
- [ ] 英語端末でメモや他アプリからテキスト共有して `Catch Up Later` が候補に出る
- [ ] 日本語端末でメモや他アプリからテキスト共有して `あとみる` が候補に出る
- [ ] 共有後にホストアプリで Share 保存画面が開く
- [ ] 保存後に Inbox に item が増える
- [ ] 共有後に同じ shared data が残留しない

## 詰まったとき

- まず Xcode で target / entitlements / App Groups を確認する
- 次に `pod install` をやり直す
- 共有候補に出ない場合は `Info.plist` の activation rule を見直す
- ホストアプリは起動するのに共有データが来ない場合は App Group 不一致を疑う
- Flutter 側だけでは完結しないため、最終保証は iPhone 実機確認を前提にする
