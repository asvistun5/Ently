const t = {
    en: {
        title: "Hello",
        btn: "Submit"
    },
    ru: {
        title: "Привет",
        btn: "Отправить"
    }
}

const trans = setTranslation(t, 1)
document.title = trans.title