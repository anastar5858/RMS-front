const loginForwarder = async (emailInput, passwordInput, markErrElem, language, languageData, loginBtn) => {
    setTimeout(() => {
        loginBtn.disabled = false;
    }, 2000)
    loginBtn.textContent = Object.keys(languageData).length > 0 ? languageData.states.loading[language] : ''
    const payload = {
        email: emailInput.current.value,
        password: passwordInput.current.value,
    }
    const loginRequest = await fetch('https://squid-app-i93aj.ondigitalocean.app/api/login', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    loginBtn.textContent = Object.keys(languageData).length > 0 ? languageData.login.loginBtn[language] : '';
    if (loginRequest.ok) {
        const loginResponse = await loginRequest.json();
        if (loginResponse === 'invalid') markErrElem.current.firstChild.textContent = languageData.errors.invalidCredentials[language];
        else {
            sharedRegister(true);
        }
    } else {
        markErrElem.current.firstChild.textContent = languageData.states.serverError[language];
    }
}