# 実機確認チェックリスト

MVP の主要導線を iOS / Android 実機で確認するためのメモです。

## 共通

- [ ] 初回起動でオンボーディングが 1 回だけ出る
- [ ] オンボーディング完了後に Inbox へ入れる
- [ ] Empty State の説明が分かる
- [ ] デバッグ補助 UI が debug ビルドでだけ見える
- [ ] Empty Inbox と Share 保存画面の debug 表示が本番導線と混ざっていない
- [ ] release ビルドではデバッグ補助 UI が出ない

## Share

- [ ] ブラウザから URL 共有で Share 保存画面が開く
- [ ] テキスト共有で Share 保存画面が開く
- [ ] kind が自動判定される
- [ ] scheduled_at が自動決定される
- [ ] 保存後に Inbox へ戻り、item が見える
- [ ] 保存後に同じ shared data が残留しない

## Notification / Permission

- [ ] 通知権限が未許可でも保存自体はできる
- [ ] 未許可時に Inbox と Settings に案内が出る
- [ ] 通常通知が表示される
- [ ] Pro の再通知が設定間隔後に 1 回だけ表示される
- [ ] 通知タップで詳細画面へ遷移する
- [ ] 完了で通知がキャンセルされる
- [ ] Snooze で通知が再予約される

## Inbox / Detail

- [ ] pending 一覧が scheduled_at 昇順で出る
- [ ] item タップで詳細へ行ける
- [ ] URL を開ける
- [ ] item が見つからない場合でも落ちない

## Pro / Purchase

- [ ] 無料ユーザーは Pro 機能で Paywall に誘導される
- [ ] 商品未取得でも Paywall が落ちない
- [ ] 購入導線が開く
- [ ] 復元導線が開く
- [ ] 購入成功または復元成功後に Pro 状態が UI に反映される
- [ ] アプリ再起動後も Pro 状態が維持される

## Settings / Search / History

- [ ] 初期値が `システムデフォルト` になっている
- [ ] システム言語が英語の端末で主要画面が英語になる
- [ ] システム言語が日本語の端末で主要画面が日本語になる
- [ ] 無料では時間設定変更がロックされる
- [ ] Pro では時刻変更できる
- [ ] Pro では通知タイミングを当日 / 翌日 / 曜日指定で変更できる
- [ ] デフォルト通知変更時、対象カードがある場合は既存カードへ反映するか確認が出る
- [ ] デフォルト通知変更時、対象カードがない場合は既存カード反映確認が出ない
- [ ] 再通知 ON/OFF が保存される
- [ ] 再通知間隔が 1時間後 / 3時間後 / 6時間後 / 12時間後 / 24時間後で表示される
- [ ] 検索 UI は現リリースでは表示されない
- [ ] Pro なら履歴が見られる

## アプリ情報 / サポート

- [ ] 公式サイトが開く
- [ ] プライバシーポリシーが開く
- [ ] 利用規約が開く
- [ ] `mailto:support@moa-lab.com` が開く
- [ ] mailto が開けなくてもアプリが落ちない

## Android 専用

- [ ] Android 13+ で通知権限を確認した
- [ ] 端末言語が英語のとき、ホーム画面名が `Catch Up Later` になる
- [ ] 端末言語が日本語のとき、ホーム画面名が `あとみる` になる
- [ ] Share Intent から英語端末では `Catch Up Later`、日本語端末では `あとみる` が候補に出る
- [ ] `atomiru_pro` の商品取得を確認した
- [ ] integration test が不安定な場合は `flutter clean` と `./gradlew clean` を実施した
- [ ] integration test は環境依存差異が残る前提で、実機で主要導線も確認した

## iOS 専用

- [ ] 通知権限ダイアログを確認した
- [ ] Share Extension が共有先に出る
- [ ] 端末言語が英語のとき、ホーム画面名が `Catch Up Later` になる
- [ ] 端末言語が日本語のとき、ホーム画面名が `あとみる` になる
- [ ] App Groups が正しく効いている
- [ ] Share Extension の詳細は [ios_share_extension_checklist.md](/Users/moa/Project/Mobile_Project/atomiru/docs/ios_share_extension_checklist.md) で確認した
