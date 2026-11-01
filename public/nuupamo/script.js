document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('[data-faq] details');

    // ネイティブのdetailsを使用。JavaScriptが無効でも回答を開けます。
    questions.forEach((question) => {
        question.addEventListener('toggle', () => {
            if (!question.open) {
                return;
            }

            questions.forEach((otherQuestion) => {
                if (otherQuestion !== question) {
                    otherQuestion.open = false;
                }
            });
        });
    });
});
