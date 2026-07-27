const form = document.getElementById('reservationForm');

function showError(field, message) {
    field.classList.add('error');
    let errorBox = field.parentElement.querySelector('.error-message');

    if (!errorBox) {
        errorBox = document.createElement('div');
        errorBox.className = 'error-message';
        field.insertAdjacentElement('afterend', errorBox);
    }

    errorBox.textContent = message;
}

function clearError(field) {
    field.classList.remove('error');
    const errorBox = field.parentElement.querySelector('.error-message');
    if (errorBox) {
        errorBox.textContent = '';
    }
}

if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const fields = [
            { name: 'nom', message: 'Veuillez entrer votre nom complet.' },
            { name: 'email', message: 'Veuillez entrer votre adresse e-mail.' },
            { name: 'telephone', message: 'Veuillez entrer votre numéro de téléphone.' },
            { name: 'adresse', message: 'Veuillez entrer votre adresse.' },
            { name: 'formation', message: 'Veuillez choisir une formation.' },
            { name: 'session', message: 'Veuillez choisir une session.' },
            { name: 'paiement', message: 'Veuillez choisir un mode de paiement.' }
        ];

        let isValid = true;

        fields.forEach(({ name, message }) => {
            const field = form.elements[name];
            if (!field) return;

            const value = field.value.trim();
            if (!value) {
                isValid = false;
                showError(field, message);
            } else {
                clearError(field);
            }
        });

        const phoneInput = form.elements['telephone'];
        const phonePattern = /^\+243[0-9]{9}$/;

        if (phoneInput && phoneInput.value.trim()) {
            if (!phonePattern.test(phoneInput.value.trim())) {
                isValid = false;
                showError(phoneInput, 'Le numéro doit être au format +243XXXXXXXXX.');
            } else {
                clearError(phoneInput);
            }
        }

        const conditions = form.elements['conditions'];
        const conditionsLabel = conditions ? conditions.parentElement.querySelector('label') : null;
        if (conditions && !conditions.checked) {
            isValid = false;
            if (conditionsLabel) {
                conditionsLabel.style.color = '#b91c1c';
            }
        } else if (conditionsLabel) {
            conditionsLabel.style.color = '';
        }

        if (isValid) {
            alert('Réservation enregistrée avec succès !');
            form.reset();
        }
    });
}
