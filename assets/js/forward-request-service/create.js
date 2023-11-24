const validateRequestInput = async (titleInput, descriptionTextBox, initialStatus, button, checked, language, languageData) => {
    const title = titleInput.current.value.trim();
    const desc = descriptionTextBox.current.value.trim();
    // client-side validation
    // no empty data
    if (title === '' || desc === '' || initialStatus === '') return btnErrorHandler(languageData.errors.missingInput[language], 'error', button);
    // forward to server after validations
    const payload = {
        title,
        desc,
        status: initialStatus,
        autoImg: checked,
    }
    const createRequestRequest = await fetch('http://localhost:8080/api/create-request', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    if (createRequestRequest.ok) {
        const createRequestResponse = await createRequestRequest.json();
        if (createRequestResponse === 'invalid') return btnErrorHandler(languageData.errors.noProcess[language], 'error', button);
        else return btnErrorHandler(languageData.success.requestCreated[language], 'success', button);
    } else {
        return btnErrorHandler(languageData.states.serverError[language], 'error', button);
    }
}
const btnErrorHandler = (message, type, button) => {
    const currentText = button.textContent;
    button.disabled = true;
    button.textContent = message;
    button.style.color = type === 'error' ? 'red' : 'green';
    setTimeout(() => {
        button.disabled = false;
        button.textContent = currentText;
        button.style.color = 'black';
    }, 2000);
}