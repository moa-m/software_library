"use client";

import Image from "next/image";
import { useEffect } from "react";

export function LandingPage() {
  useEffect(() => {
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (revealTargets.length === 0) {
      return;
    }

    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!("IntersectionObserver" in window) || isReducedMotion) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <a href="#main-content" className="skip-link">
        メインコンテンツへ移動
      </a>

      <header className="bg-primary sticky top-0 z-50 p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center text-xl font-bold">
            <span className="mr-2 rounded-lg bg-white p-1" aria-hidden="true">
              🔔
            </span>
            通知にメモ。
          </a>
          <nav
            className="hidden items-center gap-6 text-sm font-medium md:flex"
            aria-label="セクションナビゲーション"
          >
            <a href="#concept" className="transition hover:opacity-70">
              コンセプト
            </a>
            <a href="#features" className="transition hover:opacity-70">
              特徴
            </a>
            <a href="#use-cases" className="transition hover:opacity-70">
              活用例
            </a>
          </nav>
          <a
            href="#download"
            className="inline-flex items-center rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition hover:opacity-80 md:text-sm"
          >
            今すぐ試す
          </a>
        </div>
      </header>

      <main id="main-content">
        <section
          id="hero"
          className="hero-gradient section-anchor px-4 pb-12 pt-20"
          aria-labelledby="hero-title"
          data-reveal
        >
          <div className="container mx-auto text-center">
            <h1
              id="hero-title"
              className="mb-6 text-3xl font-bold leading-tight md:text-5xl"
            >
              とにかく手軽に
              <br className="md:hidden" />
              メモしたいあなたへ。
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-700 md:text-xl">
              「あ、そうだ」と思い出したこと。
              <br className="hidden md:inline" />
              忘れる前に、いつもの通知画面に貼っておきませんか？
              <br className="hidden md:inline" />
              <span className="mt-2 block md:mt-0 md:inline">
                シンプルで、頼れる、新しいメモ習慣です。
              </span>
            </p>

            <div className="relative mx-auto mb-12 max-w-xs" data-reveal>
              <div className="rounded-[3rem] border-4 border-gray-800 bg-black p-3 shadow-2xl">
                <div className="phone-mockup-screen relative overflow-hidden rounded-[2.5rem] bg-white">
                  <div
                    className="flex h-6 w-full items-center justify-between bg-gray-100 px-6 text-[10px]"
                    aria-hidden="true"
                  >
                    <span>12:00</span>
                    <span>📶 🔋</span>
                  </div>

                  <div className="p-6" aria-hidden="true">
                    <div className="mb-8 h-4 w-1/3 rounded bg-gray-200" />
                    <div className="space-y-4">
                      <div className="h-10 w-full rounded border-2 border-gray-300" />
                      <div className="h-32 w-full rounded border-2 border-gray-300" />
                      <div className="bg-primary flex h-12 w-full items-center justify-center rounded-full text-sm font-bold">
                        通知メモの作成
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute inset-x-2 top-10"
                    role="note"
                    aria-label="通知メモの表示例"
                  >
                    <div className="notification-shadow rounded-2xl border-l-8 border-yellow-400 bg-white/95 p-4 backdrop-blur">
                      <div className="mb-1 flex items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          通知にメモ。
                        </span>
                        <span className="ml-auto text-[10px] text-gray-400">今</span>
                      </div>
                      <p className="text-left text-sm font-bold">明日ごみ出し</p>
                    </div>
                  </div>

                  <div
                    className="absolute inset-x-0 bottom-4 flex justify-center"
                    aria-hidden="true"
                  >
                    <div className="h-1 w-20 rounded-full bg-gray-300" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <a
                  href="https://play.google.com/store/apps/details?id=moa.more.wiser.instant_notification&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition hover:opacity-80"
                  aria-label="Google Playで通知にメモ。をダウンロード"
                >
                  <Image
                    src="https://play.google.com/intl/ja/badges/static/images/badges/ja_badge_web_generic.png"
                    alt="Google Play で手に入れよう"
                    width={646}
                    height={250}
                    priority
                    sizes="160px"
                    className="h-16 w-auto"
                  />
                </a>
                <div className="hidden rounded-lg border border-gray-100 bg-white p-2 shadow-sm md:block">
                  <Image
                    src="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dmoa.more.wiser.instant_notification%26pli%3D1"
                    alt="ダウンロード用QRコード"
                    width={64}
                    height={64}
                    sizes="64px"
                    className="h-16 w-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="concept"
          className="section-anchor bg-white px-4 py-20"
          aria-labelledby="concept-title"
          data-reveal
        >
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center md:flex-row md:space-x-12">
              <div className="mb-10 text-center md:mb-0 md:w-1/2 md:text-left">
                <h2
                  id="concept-title"
                  className="mb-6 text-2xl font-bold italic leading-snug text-gray-700 md:text-3xl"
                >
                  メモしたこと自体を、
                  <br className="md:hidden" />
                  忘れてしまった経験はありませんか？
                </h2>
                <div className="bg-primary mx-auto mb-8 h-1 w-16 md:mx-0" aria-hidden="true" />
                <p className="text-base leading-relaxed text-gray-600 md:text-lg">
                  大事なのは「どこに書くか」よりも、「どこなら目に入るか」でした。
                  忘れたくないことは、毎日何度も見る「通知領域」に貼っておきましょう。
                  たったそれだけで、「うっかり」は驚くほど減らせます。
                </p>
              </div>

              <div className="flex justify-center md:w-1/2" data-reveal>
                <Image
                  src="/images/instant_notification/image_illustration.png"
                  alt="通知を見て思い出すイラスト"
                  width={1024}
                  height={1024}
                  sizes="(max-width: 768px) 20rem, 24rem"
                  className="h-auto w-full max-w-xs object-contain md:max-w-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="section-anchor bg-gray-50 px-4 py-24"
          aria-labelledby="features-title"
          data-reveal
        >
          <div className="container mx-auto">
            <div className="mb-16 text-center">
              <h2 id="features-title" className="mb-4 text-2xl font-bold md:text-3xl">
                シンプルだから、続けられる。
              </h2>
              <p className="text-sm text-gray-600 md:text-base">
                「思い出したことを忘れない」ために必要なものだけを揃えました。
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:gap-12">
              <article
                className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm md:p-10"
                data-reveal
              >
                <div
                  className="bg-primary absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full opacity-10"
                  aria-hidden="true"
                />
                <div className="mb-6 flex items-center space-x-4 md:mb-8 md:space-x-6">
                  <div
                    className="border-primary flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-4 bg-white text-2xl shadow-sm md:h-16 md:w-16 md:text-3xl"
                    aria-hidden="true"
                  >
                    🚀
                  </div>
                  <h3 className="text-xl font-bold md:text-2xl">忘れる前に、サッと書く</h3>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
                  アイデアや用事は、一瞬で消えてしまいますよね。
                  だから、起動してすぐに入力画面。タイトルの入力すら省けます。
                  思考を止めず、指先ひとつで通知へ飛ばしましょう。
                </p>
                <ul className="space-y-3 md:space-y-4">
                  <li className="flex items-center text-sm font-medium text-gray-700 md:text-base">
                    <span
                      className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[10px] text-yellow-600 md:h-6 md:w-6 md:text-xs"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    起動即、入力フォーカス
                  </li>
                  <li className="flex items-center text-sm font-medium text-gray-700 md:text-base">
                    <span
                      className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[10px] text-yellow-600 md:h-6 md:w-6 md:text-xs"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    タイトルなしでOK
                  </li>
                  <li className="flex items-center text-sm font-medium text-gray-700 md:text-base">
                    <span
                      className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[10px] text-yellow-600 md:h-6 md:w-6 md:text-xs"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    ボタンひとつで通知完了
                  </li>
                </ul>
              </article>

              <article
                className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm md:p-10"
                data-reveal
              >
                <div
                  className="bg-primary absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full opacity-10"
                  aria-hidden="true"
                />
                <div className="mb-6 flex items-center space-x-4 md:mb-8 md:space-x-6">
                  <div
                    className="border-primary flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-4 bg-white text-2xl shadow-sm md:h-16 md:w-16 md:text-3xl"
                    aria-hidden="true"
                  >
                    💡
                  </div>
                  <h3 className="text-xl font-bold md:text-2xl">
                    ふとした瞬間に、思い出す
                  </h3>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
                  通知領域なら、スマホを使うたびに自然と視界に入ります。
                  「あ、そうだった」と気づく瞬間が、一日に何度もある。
                  この安心感を、ぜひ体験してください。
                </p>
                <ul className="space-y-3 md:space-y-4">
                  <li className="flex items-center text-sm font-medium text-gray-700 md:text-base">
                    <span
                      className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[10px] text-yellow-600 md:h-6 md:w-6 md:text-xs"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    通知領域にずっと残る
                  </li>
                  <li className="flex items-center text-sm font-medium text-gray-700 md:text-base">
                    <span
                      className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[10px] text-yellow-600 md:h-6 md:w-6 md:text-xs"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    自然にリマインド
                  </li>
                  <li className="flex items-center text-sm font-medium text-gray-700 md:text-base">
                    <span
                      className="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[10px] text-yellow-600 md:h-6 md:w-6 md:text-xs"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    「あ、そうだ」を作る
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section
          id="use-cases"
          className="bg-primary section-anchor px-4 py-24"
          aria-labelledby="use-cases-title"
          data-reveal
        >
          <div className="container mx-auto text-center">
            <h2 id="use-cases-title" className="mb-4 text-2xl font-bold md:text-3xl">
              例えば、こんな時に。
            </h2>
            <p className="mb-12 text-sm text-gray-800 opacity-80 md:text-base">
              日常のふとした瞬間の「あ、そうだ」を逃しません。
            </p>

            <div className="mx-auto grid max-w-5xl gap-6 text-left md:grid-cols-3 md:gap-8">
              <article className="rounded-[2rem] bg-white p-6 shadow-xl md:p-8" data-reveal>
                <div className="mb-6 flex items-center space-x-4">
                  <div className="text-3xl md:text-4xl" aria-hidden="true">
                    🗑️
                  </div>
                  <h3 className="text-lg font-bold md:text-xl">明日ごみ出し</h3>
                </div>
                <div
                  className="mb-6 rounded-2xl border-l-4 border-yellow-400 bg-gray-50 p-4 shadow-sm"
                  role="note"
                  aria-label="通知メモ例: 明日ごみ出し"
                >
                  <div className="mb-1 flex items-center">
                    <span className="text-[10px] font-bold tracking-wider text-gray-500">
                      通知にメモ。
                    </span>
                    <span className="ml-auto text-[10px] text-gray-400">今</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">明日ごみ出し</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  「あ、明日は燃えるゴミだ」夜寝る前にふと思い出しても大丈夫。
                  翌朝スマホを見た瞬間、一番にお知らせします。
                </p>
              </article>

              <article className="rounded-[2rem] bg-white p-6 shadow-xl md:p-8" data-reveal>
                <div className="mb-6 flex items-center space-x-4">
                  <div className="text-3xl md:text-4xl" aria-hidden="true">
                    📞
                  </div>
                  <h3 className="text-lg font-bold md:text-xl">折り返し連絡</h3>
                </div>
                <div
                  className="mb-6 rounded-2xl border-l-4 border-yellow-400 bg-gray-50 p-4 shadow-sm"
                  role="note"
                  aria-label="通知メモ例: 折り返し連絡"
                >
                  <div className="mb-1 flex items-center">
                    <span className="text-[10px] font-bold tracking-wider text-gray-500">
                      通知にメモ。
                    </span>
                    <span className="ml-auto text-[10px] text-gray-400">10分前</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">折り返し連絡</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  移動中にかかってきた電話。「着いたら掛け直そう」と思っても、つい忘れがち。
                  一言メモしておけば、到着した時に気づけます。
                </p>
              </article>

              <article className="rounded-[2rem] bg-white p-6 shadow-xl md:p-8" data-reveal>
                <div className="mb-6 flex items-center space-x-4">
                  <div className="text-3xl md:text-4xl" aria-hidden="true">
                    🛒
                  </div>
                  <h3 className="text-lg font-bold md:text-xl">電球買う</h3>
                </div>
                <div
                  className="mb-6 rounded-2xl border-l-4 border-yellow-400 bg-gray-50 p-4 shadow-sm"
                  role="note"
                  aria-label="通知メモ例: 電球買う"
                >
                  <div className="mb-1 flex items-center">
                    <span className="text-[10px] font-bold tracking-wider text-gray-500">
                      通知にメモ。
                    </span>
                    <span className="ml-auto text-[10px] text-gray-400">1時間前</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">電球買う</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  家を出る時に「切れてるな」と気づいた電球。買い物中に別のものに気を取られても、
                  通知がそっと教えてくれます。
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="download"
          className="section-anchor bg-white px-4 py-20 text-center"
          aria-labelledby="download-title"
          data-reveal
        >
          <div className="container mx-auto max-w-2xl">
            <h2
              id="download-title"
              className="mb-6 text-3xl font-bold leading-tight md:text-4xl"
            >
              「あ、そうだ」を、
              <br className="md:hidden" />
              これからの習慣に。
            </h2>
            <p className="mb-6 text-base leading-relaxed text-gray-600 md:text-lg">
              通知画面を見るたび、ふと思い出す。
              <br />
              そんな新しい習慣を、今日から始めてみませんか？
            </p>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-6 md:space-y-0">
              <a
                href="https://play.google.com/store/apps/details?id=moa.more.wiser.instant_notification&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition hover:opacity-80"
                aria-label="Google Playで通知にメモ。をダウンロード"
              >
                <Image
                  src="https://play.google.com/intl/ja/badges/static/images/badges/ja_badge_web_generic.png"
                  alt="Google Play で手に入れよう"
                  width={646}
                  height={250}
                  sizes="200px"
                  className="h-20 w-auto"
                />
              </a>
              <div className="hidden rounded-lg border border-gray-100 bg-white p-2 shadow-sm md:block">
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dmoa.more.wiser.instant_notification%26pli%3D1"
                  alt="ダウンロード用QRコード"
                  width={80}
                  height={80}
                  sizes="80px"
                  className="h-20 w-20"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 px-4 py-12 text-white">
        <div className="container mx-auto text-center">
          <p className="mb-4 text-lg font-bold">通知にメモ。</p>
          <p className="mb-8 text-sm text-gray-400">とにかく手軽にメモしたいあなたへ。</p>
          <nav
            className="mb-8 flex justify-center space-x-6 text-sm text-gray-500"
            aria-label="フッターナビゲーション"
          >
            <a href="#" className="transition hover:text-white">
              プライバシーポリシー
            </a>
            <a href="#" className="transition hover:text-white">
              利用規約
            </a>
          </nav>
          <small className="text-[10px] text-gray-600">
            &copy; {currentYear} instant_notification All Rights Reserved.
          </small>
        </div>
      </footer>
    </>
  );
}
