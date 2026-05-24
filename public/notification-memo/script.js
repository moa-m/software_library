document.documentElement.classList.add('js-enabled');

const STORAGE_KEY = 'notification-memo-language';
const SUPPORTED_LANGUAGES = new Set(['ja', 'en']);

const translations = {
    ja: {
        pageTitle: '通知にメモ。 | 思い出す場所を、通知にする。',
        metaDescription:
            '通知にメモ。は、忘れたくないことを通知領域に残せるAndroidメモアプリです。買い物、連絡、予定の控えをスマホを見るたび自然に思い出せます。',
        text: {
            'header.brandAria': 'Moa Lab.トップへ戻る',
            'header.navAria': 'ページ内ナビゲーション',
            'header.navConcept': 'Concept',
            'header.navFlow': 'Flow',
            'header.navScreens': 'Screens',
            'header.languageLabel': 'Language',
            'header.languageAria': 'Language switcher',
            'header.back': 'トップへ戻る',
            'hero.eyebrow': 'Notification Memo',
            'hero.title': '<span class="hero-title-line">思い出す場所を、</span><span class="hero-title-line">通知にする。</span>',
            'hero.lead':
                'メモは書いただけでは、まだ少し遠い。<br />通知にメモ。は、忘れたくない一言を<br />いつもの通知画面に置いて、<br />スマホを見るたび自然に思い出せます。',
            'hero.actionsAria': '通知にメモ。の入手方法',
            'hero.storeAria': '通知にメモ。をGoogle Playで見る',
            'hero.storeAlt': 'Google Play で手に入れよう',
            'hero.cta': '手順を見る',
            'hero.visualAria': '通知にメモ。の画面イメージ',
            'hero.noteLabel': '通知にメモ。',
            'hero.noteText': '帰りにシャンプー',
            'hero.listAlt': '通知にメモ。の一覧画面',
            'hero.notificationAlt': '通知にメモ。の通知画面',
            'hero.createAlt': '通知にメモ。の入力画面',
            'concept.eyebrow': 'Concept',
            'concept.title': '見返すためのメモから、目に入るメモへ。',
            'concept.body1':
                'やること、買うもの、あとで返す連絡。小さな用事ほど、<br />メモ帳の奥にしまうと忘れやすくなります。',
            'concept.body2':
                '通知にメモ。は、整理するためのノートではなく、<br />思い出すための置き場所です。<br />いつもの通知欄に残るから、特別に見返そうとしなくても気づけます。',
            'marquee.aria': '通知にメモ。のコンセプト',
            'marquee.text': 'WRITE IT. PLACE IT. NOTICE IT.',
            'flow.eyebrow': 'Flow',
            'flow.title': '思いついたら、3つの流れで。',
            'flow.item1.title': '書く',
            'flow.item1.body': 'タイトルだけでも、本文だけでも。<br />忘れたくないことを短く残します。',
            'flow.item2.title': '置く',
            'flow.item2.body': '通知メモとして作成すると、いつもの通知領域にそのまま表示されます。',
            'flow.item3.title': '気づく',
            'flow.item3.body': 'スマホを見たタイミングで自然に目に入り、終わったら消すだけです。',
            'scenes.eyebrow': 'Scenes',
            'scenes.title': '日常の、少しだけ忘れたくないことに。',
            'scenes.item1.kicker': 'Morning',
            'scenes.item1.title': '明日のごみ出し',
            'scenes.item1.body': '朝に見たい用事を、夜のうちに通知へ置いておけます。',
            'scenes.item2.kicker': 'Move',
            'scenes.item2.title': '折り返し連絡',
            'scenes.item2.body': '移動中に思い出した用件を、落ち着くまで一時置きできます。',
            'scenes.item3.kicker': 'Shop',
            'scenes.item3.title': '買い物の一言',
            'scenes.item3.body': 'シャンプー、電球、封筒。短い買い忘れ防止に向いています。',
            'scenes.item4.kicker': 'Before',
            'scenes.item4.title': '外出前の持ちもの',
            'scenes.item4.body': '鍵、書類、充電器など、家を出る前に見たいことを残せます。',
            'screens.eyebrow': 'Screens',
            'screens.title': '入力、通知、一覧。<br />必要な画面だけ。',
            'screens.body':
                '複雑に管理するより、すぐに書いて、通知で気づくことを優先した画面構成です。残したメモは一覧からも確認できます。',
            'screens.galleryAria': '通知にメモ。画面ギャラリー',
            'screens.item1.alt': '通知メモの作成画面',
            'screens.item2.alt': '通知メモが通知領域に表示された画面',
            'screens.item3.alt': '通知メモの一覧画面',
            'screens.item1.caption': 'Write',
            'screens.item2.caption': 'Notify',
            'screens.item3.caption': 'List',
            'faq.eyebrow': 'FAQ',
            'faq.title': '使う前に気になること。',
            'faq.item1.q': 'どんなメモに向いていますか？',
            'faq.item1.a':
                '買い物、折り返し連絡、持ち物、明日の用事など、短く残してあとで思い出したいメモに向いています。',
            'faq.item2.q': '長い文章の管理にも使えますか？',
            'faq.item2.a': '長文整理よりも、通知領域で自然に思い出すための一言メモに向いています。',
            'faq.item3.q': '残したメモはあとで確認できますか？',
            'faq.item3.a': '通知だけでなく、アプリ内の一覧画面から残したメモを見返せます。',
            'faq.item4.q': '安心して使うための情報はありますか？',
            'faq.item4.a': 'フッターからプライバシーポリシーと利用規約を確認できます。',
            'cta.eyebrow': 'Download',
            'cta.title': '忘れないための一言を、通知へ。',
            'cta.body': '思い出したいことを、思い出せる場所に。通知にメモ。をAndroidで使えます。',
            'cta.storeAria': '通知にメモ。をGoogle Playで見る',
            'cta.storeAlt': 'Google Play で手に入れよう',
            'footer.title': '通知にメモ。',
            'footer.privacy': 'プライバシーポリシー',
            'footer.terms': '利用規約',
            'footer.commercial': '特定商取引法に基づく表記',
            'footer.copyright': 'Copyright © 2026 @Moa Lab. All rights reserved.'
        }
    },
    en: {
        pageTitle: 'Notification Memo | Turn something worth remembering into a notification.',
        metaDescription:
            'Notification Memo is an Android memo app that keeps important notes in your notification area. Reminders for shopping, calls, and plans stay visible every time you check your phone.',
        text: {
            'header.brandAria': 'Back to Moa Lab. home',
            'header.navAria': 'In-page navigation',
            'header.navConcept': 'Concept',
            'header.navFlow': 'Flow',
            'header.navScreens': 'Screens',
            'header.languageLabel': 'Language',
            'header.languageAria': 'Language switcher',
            'header.back': 'Back to top',
            'hero.eyebrow': 'Notification Memo',
            'hero.title':
                '<span class="hero-title-line">A place you remember</span><span class="hero-title-line">becomes a notification.</span>',
            'hero.lead':
                'A note is still a little far away when it stays in a notebook. <br />Notification Memo places the one line you do not want to forget <br />inside your regular notification screen, <br />so it comes back to mind naturally every time you check your phone.',
            'hero.actionsAria': 'How to get Notification Memo',
            'hero.storeAria': 'View Notification Memo on Google Play',
            'hero.storeAlt': 'Get it on Google Play',
            'hero.cta': 'See how it works',
            'hero.visualAria': 'Screen preview of Notification Memo',
            'hero.noteLabel': 'Notification Memo',
            'hero.noteText': 'Buy shampoo on the way home',
            'hero.listAlt': 'Notification Memo list screen',
            'hero.notificationAlt': 'Notification Memo notification screen',
            'hero.createAlt': 'Notification Memo input screen',
            'concept.eyebrow': 'Concept',
            'concept.title': 'From notes you revisit later to notes you cannot miss.',
            'concept.body1':
                'Things to do, things to buy, calls to return later. The smaller the task, the easier it is to forget when it is buried in a notebook.',
            'concept.body2':
                'Notification Memo is not a notebook for organizing details. <br />It is a place to keep something in view so it comes back to you naturally. <br />Because it stays in the notification area, you notice it without making a special effort to look for it.',
            'marquee.aria': 'Notification Memo concept',
            'marquee.text': 'WRITE IT. PLACE IT. NOTICE IT.',
            'flow.eyebrow': 'Flow',
            'flow.title': 'When an idea comes up, follow three simple steps.',
            'flow.item1.title': 'Write',
            'flow.item1.body': 'Just a title or a full note. <br />Keep the thing you do not want to forget short and clear.',
            'flow.item2.title': 'Place',
            'flow.item2.body': 'Create it as a notification memo and it appears in your regular notification area.',
            'flow.item3.title': 'Notice',
            'flow.item3.body': 'It catches your eye naturally when you check your phone, and you can clear it when you are done.',
            'scenes.eyebrow': 'Scenes',
            'scenes.title': 'For the everyday things you only want to miss by a little.',
            'scenes.item1.kicker': 'Morning',
            'scenes.item1.title': 'Trash pickup tomorrow',
            'scenes.item1.body': 'Put something you want to see in the morning into notifications the night before.',
            'scenes.item2.kicker': 'Move',
            'scenes.item2.title': 'Call back later',
            'scenes.item2.body': 'When a task comes to mind while you are out, keep it in place until things settle down.',
            'scenes.item3.kicker': 'Shop',
            'scenes.item3.title': 'A quick shopping note',
            'scenes.item3.body': 'Shampoo, a lightbulb, envelopes. It works well as a short shopping reminder.',
            'scenes.item4.kicker': 'Before',
            'scenes.item4.title': 'Things to bring before leaving',
            'scenes.item4.body': 'Keys, documents, chargers, and anything else you want to check before heading out.',
            'screens.eyebrow': 'Screens',
            'screens.title': 'Input, notifications, and a list. <br />Only the screens you need.',
            'screens.body':
                'Instead of complex management, the interface prioritizes writing quickly and noticing reminders through notifications. You can also review saved notes from the list view.',
            'screens.galleryAria': 'Notification Memo screen gallery',
            'screens.item1.alt': 'Notification Memo create screen',
            'screens.item2.alt': 'Notification Memo shown in the notification area',
            'screens.item3.alt': 'Notification Memo list screen',
            'screens.item1.caption': 'Write',
            'screens.item2.caption': 'Notify',
            'screens.item3.caption': 'List',
            'faq.eyebrow': 'FAQ',
            'faq.title': 'Questions before you start.',
            'faq.item1.q': 'What kind of notes is it good for?',
            'faq.item1.a':
                'It is a fit for short reminders you want to keep and remember later, such as shopping, callbacks, items to bring, or tomorrow’s tasks.',
            'faq.item2.q': 'Can I use it for long text too?',
            'faq.item2.a': 'It is better for a short line that you want to remember naturally through the notification area than for long-form organization.',
            'faq.item3.q': 'Can I check saved notes later?',
            'faq.item3.a': 'Yes. You can review saved notes not only in notifications but also in the app’s list view.',
            'faq.item4.q': 'Where can I check the legal info?',
            'faq.item4.a': 'You can find the privacy policy and terms of service in the footer.',
            'cta.eyebrow': 'Download',
            'cta.title': 'Put the one line you do not want to forget into notifications.',
            'cta.body': 'Keep what you want to remember in a place you can actually remember. Notification Memo is available on Android.',
            'cta.storeAria': 'View Notification Memo on Google Play',
            'cta.storeAlt': 'Get it on Google Play',
            'footer.title': 'Notification Memo',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms of Service',
            'footer.commercial': 'Legal Notice',
            'footer.copyright': 'Copyright © 2026 @Moa Lab. All rights reserved.'
        }
    }
};

function getStoredLanguage() {
    try {
        const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
        if (SUPPORTED_LANGUAGES.has(storedLanguage)) {
            return storedLanguage;
        }
    } catch {
        // Ignore storage failures.
    }

    const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return browserLanguage.toLowerCase().startsWith('en') ? 'en' : 'ja';
}

function applyLanguage(language) {
    const translation = translations[language] || translations.ja;

    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
    document.title = translation.pageTitle;

    const metaDescription = document.getElementById('meta-description');
    if (metaDescription) {
        metaDescription.setAttribute('content', translation.metaDescription);
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const value = translation.text[element.dataset.i18n];
        if (typeof value === 'string') {
            element.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
        const value = translation.text[element.dataset.i18nHtml];
        if (typeof value === 'string') {
            element.innerHTML = value;
        }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
        const value = translation.text[element.dataset.i18nAria];
        if (typeof value === 'string') {
            element.setAttribute('aria-label', value);
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
        const value = translation.text[element.dataset.i18nAlt];
        if (typeof value === 'string') {
            element.setAttribute('alt', value);
        }
    });

    document.querySelectorAll('[data-lang-switch]').forEach((button) => {
        const isActive = button.dataset.langSwitch === language;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    try {
        window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
        // Ignore storage failures.
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const languageButtons = document.querySelectorAll('[data-lang-switch]');

    languageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextLanguage = button.dataset.langSwitch;
            if (SUPPORTED_LANGUAGES.has(nextLanguage)) {
                applyLanguage(nextLanguage);
            }
        });
    });

    applyLanguage(getStoredLanguage());

    if (!('IntersectionObserver' in window)) {
        fadeElements.forEach((element) => {
            element.classList.add('is-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        }
    );

    fadeElements.forEach((element) => {
        observer.observe(element);
    });
});
