> アプリ側仕様の2026-11-04時点の写し。本文中の開発用パスはアプリ側リポジトリ基準。LP用画像は本パッケージの `branding/` と `screenshots/` を使う。

# ファイルアクセス・文字コード・外部起動

2026-11-03時点のAndroid / iOSの実装を記載する。ファイル操作は両OSとも読み取り専用で、元ファイルの変更や本文の永続コピーを行わない。

## 1. Android SAF

- Kotlinの`Intent.ACTION_OPEN_DOCUMENT`に`CATEGORY_OPENABLE`を付け、1件を選択する。MIMEは`*/*`とし、提供者によるMarkdownのMIME差を許容する。
- 選択後と読み込み時にファイル名の拡張子を検査する。MIMEは参考情報として保持するが、形式の判定条件には使わない。
- `content://`かつauthorityを持つURIだけを受け入れ、`ContentResolver.openInputStream`で読む。URIをローカルパスへ変換しない。
- ピッカーでは`FLAG_GRANT_READ_URI_PERMISSION`と`FLAG_GRANT_PERSISTABLE_URI_PERMISSION`を要求する。戻りIntentに読み取り・永続化の両フラグがある場合に、読み取り権限だけを`takePersistableUriPermission`で取得する。書き込みgrantは要求しない。
- 永続化を提供者が拒否しても、そのセッションで読める場合は閲覧を継続する。取得済みの永続読み取り権限を再確認し、`persisted`へ記録する。
- ストレージの広域権限、ファイルツリー選択、バックグラウンドサービスは使用しない。
- ファイル名・宣言サイズ等の取得と読み込みは専用ワーカースレッドで行う。サイズ情報だけに依存せず、ストリームも8 MiBで制限する。

## 2. iOS Files / bookmark

- Swiftの`UIDocumentPickerViewController(forOpeningContentTypes: [.item], asCopy: false)`で1件を選択し、元ファイルをその場で開く。選択後と読み込み時に拡張子を検査する。
- OSから得たfile URLはネイティブ側だけで扱う。Dartへは`mojilta-document://document/<UUID>`という不透明なIDを返し、任意のファイルパスを指定させない。
- security-scoped resourceへのアクセスを読み込み時に開始・終了する。読み取りは`NSFileCoordinator`の`.withoutChanges`と`FileHandle(forReadingFrom:)`で行い、通常ファイルとサイズを検査する。
- `.minimalBookmark`を作成・解決できた場合だけ`persisted=true`とする。bookmarkはUserDefaultsの`mojilta.documentBookmarks.v1`へ保存し、本文は保存しない。
- bookmark作成失敗時はセッション内URLだけを保持する。期限切れbookmarkは解決時に更新する。解決不能なら永続化記録を除去し、セッション内URLがあれば再利用し、なければ権限・欠損エラーを返す。
- Mojilta自身のDocumentsをFilesへ公開する`UIFileSharingEnabled`は有効にしない。`LSSupportsOpeningDocumentsInPlace`は有効とする。

## 3. OSの「このアプリで開く」

- Androidは`ACTION_VIEW`、`content` schemeと`text/plain` / `text/markdown` / `text/x-markdown` / `application/markdown`をManifestへ登録する。初回Intentと`onNewIntent`を扱い、処理済みactionを消費して重複受信を防ぐ。`ACTION_SEND`は登録しない。
- Androidの外部起動では新たな永続権限取得を試みず、既存の読み取り権限を確認する。外部ファイルが一時URIなら`persisted=false`になる。
- iOSはTXT / MarkdownのViewerとして登録し、AppDelegate / SceneDelegateから初回・起動中のOS提供file URLを受信する。通常の選択と同じbookmark登録を試みる。
- 起動前の受信は`takeIncoming`、起動後は`incomingDocument`で共通UIへ渡し、`/reader/incoming`を開く。無効・消失ファイルはエラーと再選択導線を表示する。
- デコード成功した一時ファイルも履歴へ記録するが、永続URIとして扱わない。一時履歴のタップはファイル再選択を開き、「前回の続きから」の対象にはしない。
- 永続アクセスを記録したファイルでも、削除・移動・提供元の変更で読めなくなる場合がある。履歴から開くたびに実際のアクセスエラーを処理する。

## 4. サポートするファイルとサイズ

| 拡張子 | 表示形式 | 注記 |
|---|---|---|
| `.txt` | プレーンテキスト | 改行・空白を保持 |
| `.md` | Markdown | 整形表示と読み取り専用原文表示 |
| `.markdown` | Markdown | `.md`と同じ扱い |

拡張子は大文字・小文字を区別しない。両OSとDartデコーダーで**8 MiB（8 × 1024 × 1024 bytes）**を上限とし、超過時はエラーを表示する。空ファイルは読み込み可能。NUL等の制御文字を含む本文は非対応形式として拒否する。

MarkdownのHTMLをブラウザのHTMLとして実行しない。画像はローカル・リモートとも代替アイコンとし、自動取得しない。リンクはhttp / httpsかつhostがあるURLだけを、明示タップ時に外部アプリへ渡す。

## 5. 文字コード

- 初回の選択はUTF-8。UTF-8 BOMは除去し、BOM付きUTF-16 LE / BEもこの選択で自動判定する。BOMなしUTF-16の自動判定は行わない。
- UTF-8は不正なバイト列を置換せず失敗させる。UTF-16では奇数バイトや不正なサロゲートを拒否する。
- 手動選択はUTF-8 / Shift_JIS（Windows-31J）。Androidは`Charset.forName("windows-31j")`の厳格なdecoder、iOSはCore FoundationのDOS Japanese（CP932）を使う。`charset_converter`パッケージは使用しない。
- デコード失敗時は文字コード選択を表示する。閲覧成功後は「文字コードを表示」をオンにし、タイトル右の文字コードボタンから再選択できる。UTF-16 BOMを読み込んだ場合もこの表示はUTF-8選択を示す。
- 再デコードはメモリ上の元バイトを使い、成功した選択をファイル単位で履歴へ保存する。次回は同じ選択で再読み込みする。
- CRLF / LF / CR、空行、全角空白をデコード後に正規化・トリミングしない。元ファイルへの変換結果の書き戻しは行わない。
- 許可するU+0020未満の制御文字はTAB / LF / FF / CRだけとし、NUL等は拒否する。

## 6. エラー・データの扱い

- ネイティブ境界は`INVALID_URI` / `UNSUPPORTED_TYPE` / `TOO_LARGE` / `PERMISSION_DENIED` / `NOT_FOUND` / `DECODE_FAILED` / `READ_FAILED`等のコードを共通UIへ返す。提供者の例外メッセージや原稿パスは転送しない。
- ファイルが読めない場合は再選択・再試行を案内する。選び直しは通常のファイル選択であり、古いURIの履歴行を新しいURIへ自動統合する処理はない。
- URI・本文・クリップボードを外部サーバーへ送信しない。読み取り、検索、コピー、表示変更で元ファイルを変更しない。
- 履歴削除はDBのメタデータ行だけを消す。OS権限 / bookmarkの解放APIは実装済みだが、現在の履歴削除UIからは呼び出さない。
- オフラインで利用できるかは元ファイルの提供元にも依存する。端末内のファイルはネットワーク不要で閲覧でき、クラウド提供元の未取得ファイルは提供元の取得が必要な場合がある。

## 参考資料

実装の正本は`lib/core/file_access/`、Androidの`MainActivity.kt` / `DocumentAccess.kt`、iOSの`FileAccessBridge.swift`。過去の実機検証は`10_IMPLEMENTATION_NOTES.md`を参照する。

- Android SAF: https://developer.android.com/guide/topics/providers/document-provider
- Android Intent: https://developer.android.com/reference/android/content/Intent
- Flutter platform communication: https://docs.flutter.dev/platform-integration/platform-channels
