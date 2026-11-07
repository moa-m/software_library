"use strict";

// 言語を切り替えても、料金やFAQなど現在のセクションへ移動できる。
const languageSwitch = document.querySelector("[data-language-switch]");

if (languageSwitch) {
    const alternatePage = new URL(languageSwitch.href);

    function updateLanguageLink() {
        alternatePage.hash = window.location.hash;
        languageSwitch.href = alternatePage.href;
    }

    window.addEventListener("hashchange", updateLanguageLink);
    updateLanguageLink();
}

// 広い画面では2枚を並べ、小さい画面では選んだ実画面を大きく表示する。
// JavaScriptが無効でも、すべての画像を順に読める。
const mobileView = window.matchMedia("(max-width: 639px)");

document.querySelectorAll("[data-comparison]").forEach((comparison) => {
    const controls = comparison.querySelector(".view-controls");
    const buttons = [...comparison.querySelectorAll("[data-view]")];
    const panels = [...comparison.querySelectorAll("[data-panel]")];
    let selected = 0;

    function update() {
        controls.hidden = !mobileView.matches;
        buttons.forEach((button, index) => {
            button.setAttribute("aria-pressed", String(index === selected));
        });
        panels.forEach((panel, index) => {
            panel.hidden = mobileView.matches && index !== selected;
        });
    }

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            selected = index;
            update();
        });
    });

    mobileView.addEventListener("change", update);
    update();
});
