const Register = (props) => {
    const language = props.language
    const [password, setPassword] = React.useState('');
    const [passwordValidator, setPasswordValidator] = React.useState({long: false, chacractersLimit: false, startEndNo: false});
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const [languageData, setLanguageData] = React.useState({});
    React.useEffect(() => {
        fetchLanguageData(setLanguageData);
    }, []);
    React.useEffect(() => {
        validatePassword(password, setPasswordValidator);
    }, [password]);
    return  (
    <form className='flex-column surface'>
        <input id='register-input' ref={emailRef} className='w-30 middle front media-wide' type='email' placeholder={Object.keys(languageData).length > 0 ? languageData.register.emailPlaceholder[language] : ''} />
        <input id='password-input' ref={passwordRef} onInput={(e) => setPassword(e.currentTarget.value)} className='w-30 middle front media-wide' type='password' placeholder={Object.keys(languageData).length > 0 ? languageData.register.passwordPlaceholder[language] : ''} />
        <ul className='middle front bullet' dir={Object.keys(languageData).length > 0 ? languageData.direction[language] : ''}>
            <strong>{Object.keys(languageData).length > 0 ? languageData.register.compliance[language] : ''}</strong>
            <li>
                <mark id='pass-val-long'><strong>{Object.keys(languageData).length > 0 ? languageData.register.passwordRule1[language] : ''}</strong></mark>
                <input id='checkBoxBlock1' type='checkbox' disabled checked={passwordValidator.long ? true : false} style={{margin: '0.2rem auto 0 auto',}}></input>
            </li>
            <li>
                <mark id='pass-val-limit'><strong>{Object.keys(languageData).length > 0 ? languageData.register.passwordRule2[language] : ''}</strong></mark>
                <input id='checkBoxBlock2' type='checkbox' disabled checked={passwordValidator.chacractersLimit ? true : false} style={{margin: '0.2rem auto 0 auto',}}></input>
            </li>
            <li>
                <mark id='pass-val-sten'> <strong>{Object.keys(languageData).length > 0 ? languageData.register.passwordRule3[language] : ''}</strong></mark>
                <input id='checkBoxBlock3' type='checkbox' disabled checked={passwordValidator.startEndNo ? true : false} style={{margin: '0.2rem auto 0 auto',}}></input>
            </li>
        </ul>
        <button id='regsiter-btn'onAnimationStart={(e) => {
            if (e.currentTarget.style.animation.includes('btnTransition')) e.currentTarget.disabled = true;
            const hamburgerMenu = document.getElementById('menu-toggle2');
            const hamburgerMenu2 = document.getElementById('menu-toggle');
            if ((hamburgerMenu && hamburgerMenu2) && e.currentTarget.style.animation.includes('btnTransition')) {
                hamburgerMenu.disabled = true;
                hamburgerMenu2.disabled = true; 
            }
        }} onAnimationEnd={(e) => {
            e.currentTarget.disabled = false;
            const hamburgerMenu = document.getElementById('menu-toggle2');
            const hamburgerMenu2 = document.getElementById('menu-toggle');
            if ((hamburgerMenu && hamburgerMenu2) && e.currentTarget.style.animation.includes('btnTransition')) {
                hamburgerMenu.disabled = false;
                hamburgerMenu2.disabled = false; 
                hamburgerMenu.checked = false
            } 
        }} onClick={(e) => registerRequestForwarder(emailRef, passwordRef, e, passwordValidator, language, languageData, e.currentTarget)}
        onMouseEnter={(e) => {
            if (e.currentTarget.style.animation.includes('btnTransition')) {
                e.currentTarget.disabled = false;
                const hamburgerMenu = document.getElementById('menu-toggle2');
                const hamburgerMenu2 = document.getElementById('menu-toggle');
                if ((hamburgerMenu && hamburgerMenu2) && e.currentTarget.style.animation.includes('btnTransition')) {
                    hamburgerMenu.disabled = false;
                    hamburgerMenu2.disabled = false; 
                    hamburgerMenu.checked = false
                } 
            }
            e.currentTarget.style.animation = 'none';
        }}
        className='w-10 middle front primary-container' 
        style={{animation: `${props.animationIndicator === false ? 'btnTransition 3s 1 forwards' : 'default'}`}}>{Object.keys(languageData).length > 0 ? languageData.register.registerBtn[language] : ''}</button>
    </form>
    )
}
const registerRequestForwarder = (emailRef, passwordRef, event, passwordValidator, language, languageData, registerBtn) => {
    event.preventDefault();
    registerBtn.disabled = true;
    setTimeout(() => {
        registerBtn.disabled = false;
    }, 2000);
    validateEmail(emailRef, passwordRef, passwordValidator, language, languageData);
}