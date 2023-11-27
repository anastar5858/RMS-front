const validateEmail = (emailInput, passwordInput, passwordValidator, language, languageData, registerBtn) => {
    setTimeout(() => {
        registerBtn.disabled = false;
    }, 2000)
    const email = emailInput.current.value.trim().toLowerCase();
    if (email === '') return uiEmailErrorHandler(languageData.errors.emailEmpty[language], emailInput, 'Empty Email');
    const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email.match(re)) return uiEmailErrorHandler(languageData.errors.emailInvalid[language], emailInput, 'Invalid Email');
    if (!passwordValidator.long) passwordAnimationHandler('pass-val-long');
    if (!passwordValidator.startEndNo) passwordAnimationHandler('pass-val-sten');
    if (!passwordValidator.chacractersLimit) passwordAnimationHandler('pass-val-limit');
    if (!passwordValidator.long || !passwordValidator.startEndNo || !passwordValidator.chacractersLimit) return
    const password = passwordInput.current.value;
    sendToServerController(emailInput, password, language, languageData);
}
const passwordAnimationHandler = (id) => {
    const markElement = document.getElementById(id);
    markElement.style.animation = `validationY 2s 1`;
    markElement.addEventListener('animationend', () => {
        markElement.style.animation = 'none';
    }, { once: true });
}
const uiEmailErrorHandler = (lanMessage, emailInput, message) => {
    if (message === 'Empty Email') {
        emailInput.current.placeholder = lanMessage;
    } else if (message === 'Invalid Email') {
        const currentText = emailInput.current.value;
        emailInput.current.disabled = true;
        emailInput.current.value = lanMessage;
        emailInput.current.style.color = 'red';
        setTimeout(() => {
            emailInput.current.disabled = false;
            emailInput.current.value = currentText;
            emailInput.current.style.color = 'black';
        }, 1000);
    }
}
const validatePassword = (passwordInput, setPasswordValidator) => {
    if (passwordInput.length > 8) {
        setPasswordValidator((prev) => {
            return {...prev, long: true};
        })
    } else {
        setPasswordValidator((prev) => {
            return {...prev, long: false};
        }) 
    }
    if (isNaN(passwordInput[0]) && isNaN(passwordInput[passwordInput.length - 1])) {
        setPasswordValidator((prev) => {
            return {...prev, startEndNo: true};
        }) 
    } else {
        setPasswordValidator((prev) => {
            return {...prev, startEndNo: false};
        }) 
    }
    let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    if (passwordInput.match(re)) {
        setPasswordValidator((prev) => {
            return {...prev, chacractersLimit: true};
        }) 
    } else {
        setPasswordValidator((prev) => {
            return {...prev, chacractersLimit: false};
        }) 
    }
}
const btnErrorHandler = (message, type,languageData, language) => {
    const registerBtn = document.getElementById('regsiter-btn');
    registerBtn.disabled = true;
    registerBtn.textContent = message;
    registerBtn.style.color = type === 'error' ? 'red' : 'green';
    setTimeout(() => {
        registerBtn.disabled = false;
        registerBtn.textContent = Object.keys(languageData).length > 0 ? languageData.register.registerBtn[language] : '';
        registerBtn.style.color = 'black';
    }, 2000);
}
const sendToServerController = async (emailInput, password, language, languageData) => {
    const registerBtn = document.getElementById('regsiter-btn');
    registerBtn.textContent = Object.keys(languageData).length > 0 ? languageData.states.loading[language] : ''

    const payload = {email: emailInput.current.value, password};
    const controllerRequest = await fetch('https://rms-back-90595d39ec60.herokuapp.com/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    if (controllerRequest.ok) {
        const controllerResponse = await controllerRequest.json();
        if (controllerResponse === 'Invalid Email') return uiEmailErrorHandler(languageData.errors.emailInvalid[language], emailInput, 'Invalid Email');
        if (controllerResponse.state === false) return passwordAnimationHandler(controllerResponse.id);
        if (controllerResponse === 'Invalid') return btnErrorHandler(languageData.errors.alreadyRegistered[language], 'error', languageData, language);
        btnErrorHandler(languageData.success.accountCreated[language], 'success');
        sharedRegister(true);
    } else {
        btnErrorHandler(languageData.states.serverError[language], 'error');
    }
}