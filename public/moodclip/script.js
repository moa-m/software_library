document.documentElement.classList.add('js-enabled');

const STORAGE_KEY = 'moodclip-language';
const SUPPORTED_LANGUAGES = new Set(['ja', 'en']);

const translations = {
    ja: {
        pageTitle: 'MoodClip | URL・画像・メモを集めるAndroidムードボードアプリ',
        metaDescription:
            'MoodClipは、気になったWebページ、画像、短いメモ、音楽や場所へのリンクを雰囲気ごと残し、画像シェアできるAndroid向けムードボードアプリです。',
        ogLocale: 'ja_JP',
        ogTitle: 'MoodClip | URL・画像・メモを集めるAndroidムードボードアプリ',
        ogDescription:
            '気になったWebページ、画像、短いメモ、音楽や場所へのリンクをボードに集めて、1枚の画像としてシェアできます。',
        twitterTitle: 'MoodClip | URL・画像・メモを集めるAndroidムードボードアプリ',
        twitterDescription:
            '気になったWebページ、画像、短いメモ、音楽や場所へのリンクをボードに集めて、1枚の画像としてシェアできます。',
        text: {
            'header.brandAria': 'Moa Lab.トップへ戻る',
            'header.navAria': 'ページ内ナビゲーション',
            'header.navConcept': 'Concept',
            'header.navFeatures': 'Features',
            'header.navScreens': 'Screens',
            'header.languageLabel': 'Language',
            'header.languageAria': 'Language switcher',
            'header.back': 'トップへ戻る',
            'hero.eyebrow': 'MoodClip for Android',
            'hero.title': '<span>保存したものが、</span><span>雑誌みたいなボードに。</span>',
            'hero.lead':
                '気になったページ、画像、短いメモ、音楽や場所へのリンク。MoodClipは、集めた素材を世界観ごと眺めて、1枚の画像としてシェアできるムードボードアプリです。',
            'hero.storeAria': 'MoodClipをGoogle Playで見る',
            'hero.storeAlt': 'Google Play で手に入れよう',
            'hero.viewScreens': '画面を見る',
            'hero.imageAlt': 'MoodClipのボード画面を紹介するビジュアル',
            'hero.visualAria': 'MoodClipの紹介ビジュアル',
            'hero.actionsAria': 'MoodClipの入手方法',
            'concept.eyebrow': 'Concept',
            'concept.title': '<span>URL管理より、</span><span>気分ごと残したい。</span>',
            'concept.body1':
                'あとで見たいWebページ、好きな写真、ふと思いついた一言。それぞれ別々に保存すると、残したかった雰囲気はすぐに散らばってしまいます。',
            'concept.body2':
                'MoodClipは、情報をきれいに分類するためだけのアプリではありません。気になったものをひとつのボードに集めて、見返す時間まで心地よく整えます。',
            'features.eyebrow': 'Features',
            'features.title': '集める、眺める、仕上げる。',
            'features.item1.title': '共有からすぐ保存',
            'features.item1.body': 'ブラウザやSNSから共有して、気になった瞬間のままボードへ残せます。',
            'features.item2.title': 'ボードでまとめて眺める',
            'features.item2.body': 'URL、画像、メモ、音楽や場所へのリンクを、ひとつの世界観として見返せます。',
            'features.item3.title': '気分でテーマを選ぶ',
            'features.item3.body': 'レトロ、ポップ、ネオ、夢片など、保存した素材に合う見た目へ切り替えられます。',
            'features.item4.title': '画像にしてシェア',
            'features.item4.body': 'できあがったボードを1枚の画像として書き出し、SNSやメッセージへ共有できます。',
            'story.eyebrow': 'How to Use',
            'story.title': '気になった瞬間から、投稿できる形まで。',
            'story.step1.kicker': 'Share',
            'story.step1.title': 'アプリから共有',
            'story.step1.body': '残したい素材を見つけたら、Androidの共有メニューからMoodClipへ。',
            'story.step2.kicker': 'Board',
            'story.step2.title': 'ボードに集める',
            'story.step2.body': 'テーマや並びを整えながら、自分だけのムードボードとして眺めます。',
            'story.step3.kicker': 'Post',
            'story.step3.title': '画像でシェア',
            'story.step3.body': '仕上がったボードを画像にして、そのままSNSや友だちへ共有できます。',
            'showcase.eyebrow': 'Mood Details',
            'showcase.title': '保存の動きも、見た目の調整も、ボードの一部。',
            'showcase.body':
                '保存入口、テーマ選択、画像シェアまで、MoodClipらしい誌面感を保ったまま操作できます。',
            'showcase.galleryAria': 'MoodClipの機能紹介画像',
            'showcase.poster1Alt': '共有からMoodClipへ保存する流れ',
            'showcase.poster2Alt': 'MoodClipのテーマ選択画面',
            'showcase.poster3Alt': 'MoodClipのボードを画像として共有する画面',
            'showcase.poster1Caption': '共有からすぐ保存',
            'showcase.poster2Caption': 'テーマで雰囲気を変える',
            'showcase.poster3Caption': '画像にしてシェア',
            'screens.eyebrow': 'Screens',
            'screens.title': '<span>ボードが主役の、</span><span>余白のある画面。</span>',
            'screens.body':
                '保存した素材がただ並ぶだけではなく、見返したくなるまとまりとして表示されます。編集画面では、サイズや順番もボードに合わせて調整できます。',
            'screens.galleryAria': 'MoodClip画面ギャラリー',
            'screens.boardAlt': 'MoodClipのボード一覧画面',
            'screens.editAlt': 'MoodClipのレイアウト編集画面',
            'screens.themeAlt': 'MoodClipのテーマ選択画面',
            'screens.boardCaption': 'Board',
            'screens.editCaption': 'Edit',
            'screens.themeCaption': 'Theme',
            'faq.eyebrow': 'FAQ',
            'faq.title': '使う前に気になること。',
            'faq.item1.q': 'どこからインストールできますか？',
            'faq.item1.a':
                'Google Playからインストールできます。ページ上部と下部のバッジからストアページへ移動できます。',
            'faq.item2.q': 'どんな素材を保存できますか？',
            'faq.item2.a':
                'Webページ、画像、短いテキスト、音楽や位置情報へのリンクなど、気になった素材をボードに残す想定です。',
            'faq.item3.q': '保存したボードは共有できますか？',
            'faq.item3.a': '仕上げたボードを1枚の画像として書き出し、SNSやメッセージへ共有できます。',
            'faq.item4.q': 'Android以外でも使えますか？',
            'faq.item4.a': '現在はAndroid向けアプリとしてGoogle Playで公開しています。',
            'faq.item5.q': 'どんな人に向いていますか？',
            'faq.item5.a':
                '情報を細かく整理するより、好きなものや気になったものを雰囲気ごと見返したい人に向いています。',
            'faq.item6.q': '安心して使うための情報はありますか？',
            'faq.item6.a':
                'フッターからプライバシーポリシー、利用規約、特定商取引法に基づく表記を確認できます。',
            'cta.eyebrow': 'Available Now',
            'cta.title': 'MoodClipはGoogle Playで公開中です。',
            'cta.body': '気になったものをボードに集めて、あなたの世界観として残せます。',
            'cta.storeAria': 'MoodClipをGoogle Playで見る',
            'cta.storeAlt': 'Google Play で手に入れよう',
            'footer.privacy': 'プライバシーポリシー',
            'footer.terms': '利用規約',
            'footer.commercial': '特定商取引法に基づく表記',
            'footer.copyright': 'Copyright © 2026 @Moa Lab. All rights reserved.'
        }
    },
    en: {
        pageTitle: 'MoodClip | Android mood board app for URLs, images, and notes',
        metaDescription:
            'MoodClip is an Android mood board app that lets you keep web pages, images, short notes, music, and location links together as a visual board you can share as an image.',
        ogLocale: 'en_US',
        ogTitle: 'MoodClip | Android mood board app for URLs, images, and notes',
        ogDescription:
            'Collect web pages, images, short notes, music, and location links into one board, then share it as a single image.',
        twitterTitle: 'MoodClip | Android mood board app for URLs, images, and notes',
        twitterDescription:
            'Collect web pages, images, short notes, music, and location links into one board, then share it as a single image.',
        text: {
            'header.brandAria': 'Back to Moa Lab. home',
            'header.navAria': 'In-page navigation',
            'header.navConcept': 'Concept',
            'header.navFeatures': 'Features',
            'header.navScreens': 'Screens',
            'header.languageLabel': 'Language',
            'header.languageAria': 'Language switcher',
            'header.back': 'Back to top',
            'hero.eyebrow': 'MoodClip for Android',
            'hero.title': '<span>What you save becomes</span><span>a magazine-like board.</span>',
            'hero.lead':
                'Web pages, images, short notes, music, and location links you want to keep. MoodClip turns everything you collect into a mood board you can browse by vibe and share as a single image.',
            'hero.storeAria': 'View MoodClip on Google Play',
            'hero.storeAlt': 'Get it on Google Play',
            'hero.viewScreens': 'See the screens',
            'hero.imageAlt': 'Visual preview of the MoodClip board screen',
            'hero.visualAria': 'MoodClip introduction visual',
            'hero.actionsAria': 'How to get MoodClip',
            'concept.eyebrow': 'Concept',
            'concept.title': '<span>Not just URL management,</span><span>save the mood too.</span>',
            'concept.body1':
                'A page to revisit later, a favorite photo, a line that came to mind. If each item lives in a different place, the feeling you wanted to keep gets scattered fast.',
            'concept.body2':
                'MoodClip is more than an app for neat categorization. It gathers what catches your eye into one board and makes the act of looking back feel good too.',
            'features.eyebrow': 'Features',
            'features.title': 'Collect, browse, finish.',
            'features.item1.title': 'Save straight from share',
            'features.item1.body': 'Share from your browser or social apps and keep the moment as it is.',
            'features.item2.title': 'Browse everything as a board',
            'features.item2.body': 'Review URLs, images, notes, music, and location links as one visual world.',
            'features.item3.title': 'Choose a theme by mood',
            'features.item3.body': 'Switch to a look that fits what you saved, from retro and pop to neo and dreamlike styles.',
            'features.item4.title': 'Export and share as an image',
            'features.item4.body': 'Turn the finished board into a single image and share it through social apps or messages.',
            'story.eyebrow': 'How to Use',
            'story.title': 'From the moment something catches your eye to a post-ready board.',
            'story.step1.kicker': 'Share',
            'story.step1.title': 'Share from any app',
            'story.step1.body': 'When you find something you want to keep, send it to MoodClip from Android’s share menu.',
            'story.step2.kicker': 'Board',
            'story.step2.title': 'Gather it on the board',
            'story.step2.body': 'Adjust themes and arrangement while you look at it as your own mood board.',
            'story.step3.kicker': 'Post',
            'story.step3.title': 'Share it as an image',
            'story.step3.body': 'Export the finished board as an image and share it with social apps or friends right away.',
            'showcase.eyebrow': 'Mood Details',
            'showcase.title': 'Saving, styling, and sharing all belong to the board.',
            'showcase.body':
                'From the save flow to theme selection and image sharing, everything keeps the magazine-like feel that defines MoodClip.',
            'showcase.galleryAria': 'MoodClip feature images',
            'showcase.poster1Alt': 'The flow for saving from share into MoodClip',
            'showcase.poster2Alt': 'MoodClip theme selection screen',
            'showcase.poster3Alt': 'The screen for sharing a MoodClip board as an image',
            'showcase.poster1Caption': 'Save straight from share',
            'showcase.poster2Caption': 'Change the vibe with a theme',
            'showcase.poster3Caption': 'Share as an image',
            'screens.eyebrow': 'Screens',
            'screens.title': '<span>A spacious interface</span><span>with the board at the center.</span>',
            'screens.body':
                'Saved materials are displayed as a set you will want to revisit, not just a pile of items. In the editor, you can adjust size and order to match the board.',
            'screens.galleryAria': 'MoodClip screen gallery',
            'screens.boardAlt': 'MoodClip board overview screen',
            'screens.editAlt': 'MoodClip layout editing screen',
            'screens.themeAlt': 'MoodClip theme selection screen',
            'screens.boardCaption': 'Board',
            'screens.editCaption': 'Edit',
            'screens.themeCaption': 'Theme',
            'faq.eyebrow': 'FAQ',
            'faq.title': 'Questions before you start.',
            'faq.item1.q': 'Where can I install it?',
            'faq.item1.a':
                'You can install MoodClip from Google Play. Use the badge at the top or bottom of the page to open the store listing.',
            'faq.item2.q': 'What can I save?',
            'faq.item2.a':
                'The app is designed for web pages, images, short text, music, and location links you want to keep on the board.',
            'faq.item3.q': 'Can I share the board?',
            'faq.item3.a': 'Yes. Export the finished board as a single image and share it through social apps or messages.',
            'faq.item4.q': 'Does it work on anything other than Android?',
            'faq.item4.a': 'MoodClip is currently available as an Android app on Google Play.',
            'faq.item5.q': 'Who is it for?',
            'faq.item5.a':
                'It is a fit for people who want to revisit things they like or find interesting by mood, not just by strict organization.',
            'faq.item6.q': 'Where can I check the legal info?',
            'faq.item6.a':
                'You can find the privacy policy, terms of service, and legal notice in the footer.',
            'cta.eyebrow': 'Available Now',
            'cta.title': 'MoodClip is available on Google Play.',
            'cta.body': 'Gather what you like onto a board and keep it as part of your own visual world.',
            'cta.storeAria': 'View MoodClip on Google Play',
            'cta.storeAlt': 'Get it on Google Play',
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
        // Ignore storage access failures and fall back to browser language.
    }

    const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return browserLanguage.toLowerCase().startsWith('en') ? 'en' : 'ja';
}

function setAttrFromKey(element, attrName, value) {
    if (!element) {
        return;
    }

    element.setAttribute(attrName, value);
}

function applyLanguage(language) {
    const translation = translations[language] || translations.ja;

    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
    document.title = translation.pageTitle;

    setAttrFromKey(document.getElementById('meta-description'), 'content', translation.metaDescription);
    setAttrFromKey(document.getElementById('og-locale'), 'content', translation.ogLocale);
    setAttrFromKey(document.getElementById('og-title'), 'content', translation.ogTitle);
    setAttrFromKey(document.getElementById('og-description'), 'content', translation.ogDescription);
    setAttrFromKey(document.getElementById('twitter-title'), 'content', translation.twitterTitle);
    setAttrFromKey(document.getElementById('twitter-description'), 'content', translation.twitterDescription);

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        const nextValue = translation.text[key];

        if (typeof nextValue !== 'string') {
            return;
        }

        element.textContent = nextValue;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
        const key = element.dataset.i18nHtml;
        const nextValue = translation.text[key];

        if (typeof nextValue !== 'string') {
            return;
        }

        element.innerHTML = nextValue;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
        const key = element.dataset.i18nAria;
        const nextValue = translation.text[key];

        if (typeof nextValue !== 'string') {
            return;
        }

        element.setAttribute('aria-label', nextValue);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
        const key = element.dataset.i18nAlt;
        const nextValue = translation.text[key];

        if (typeof nextValue !== 'string') {
            return;
        }

        element.setAttribute('alt', nextValue);
    });

    document.querySelectorAll('[data-lang-src-ja], [data-lang-src-en]').forEach((element) => {
        const nextSrc =
            language === 'en'
                ? element.dataset.langSrcEn || element.dataset.langSrcJa
                : element.dataset.langSrcJa || element.dataset.langSrcEn;

        if (typeof nextSrc === 'string' && nextSrc.length > 0) {
            element.setAttribute('src', nextSrc);
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
        // Ignore storage access failures.
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
