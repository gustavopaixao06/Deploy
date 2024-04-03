class FormSubmit {
    constructor(settings) {
        this.settings = settings;
        this.form = document.querySelector(settings.form);
        this.formButton = document.querySelector(settings.button);
        if (this.form) {
            this.url = this.form.getAttribute("action");
        }
        this.sendForm = this.sendForm.bind(this);
    }

    displaySuccess() {
        this.form.innerHTML = `${this.settings.success}
                                <button class="back-button">Voltar ao Formulário</button>`;
        this.form.querySelector('.back-button').addEventListener('click', () => {
            this.form.innerHTML = this.settings.formHTML;
            this.init();
        });
    }

    displayError(errorMsg) {
        this.form.innerHTML = `<h1 class='error'>Erro: ${errorMsg}</h1>`;
    }

    getFormObject() {
        const formObject = {};
        const fields = this.form.querySelectorAll("[name]");
        fields.forEach((field) => {
            formObject[field.getAttribute("name")] = field.value;
        });
        return formObject;
    }
    

    onSubmission(event) {
        event.preventDefault();
        event.target.disabled = true;
        event.target.innerHTML = "Enviando...";
    }

    async sendForm(event) {
        try {
            this.onSubmission(event);
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(this.getFormObject()),
            });
            if (response.ok) {
                this.displaySuccess();
            } else {
                throw new Error('Erro no envio do formulário');
            }
        } catch (error) {
            this.displayError(error.message);
        }
    }

    init() {
        if (this.form) {
            this.formButton.addEventListener("click", this.sendForm);
            this.settings.formHTML = this.form.innerHTML;
        }
        return this;
    }
}

const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-button]",
    success: "<h1 class='success'>Mensagem enviada! Responderemos o mais rápido possível</h1>",
    error:  "<h1 class='error'>Erro no envio do formulário. Tente novamente mais tarde.</h1>",
});
formSubmit.init();
