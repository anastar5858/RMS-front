const Login = (props) => {
    const language = props.language
    console.log(language)
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const statusMark = React.useRef(null);
    const [languageData, setLanguageData] = React.useState({});
    React.useEffect(() => {
        fetchLanguageData(setLanguageData);
    }, []);
    return (
        <form className='flex-column surface'>
        <input id='email-input' ref={emailRef} className='w-30 middle front media-wide' type='email' placeholder={Object.keys(languageData).length > 0 ? languageData.login.emailPlaceholder[language] : ''} />
        <input id='password-login' ref={passwordRef} className='w-30 middle front media-wide' type='password' placeholder={Object.keys(languageData).length > 0 ? languageData.login.passwordPlaceholder[language] : ''} />
        <mark id='login-status' ref={statusMark} style={{textAlign: 'center'}} className='front w-center'><strong>IDLE</strong></mark>
        <button id='login-btn' onAnimationStart={() => {
            const hamburgerMenu = document.getElementById('menu-toggle2');
            const hamburgerMenu2 = document.getElementById('menu-toggle');
            if (hamburgerMenu && hamburgerMenu2) {
                hamburgerMenu.disabled = true;
                hamburgerMenu2.disabled = true; 
            } 
        }} onAnimationEnd={() => {
            const hamburgerMenu = document.getElementById('menu-toggle2');
            const hamburgerMenu2 = document.getElementById('menu-toggle');
            if (hamburgerMenu && hamburgerMenu2) {
                hamburgerMenu.disabled = false;
                hamburgerMenu2.disabled = false; 
                hamburgerMenu.checked = false
            } 
        }} onClick={(e) => {
            e.preventDefault();
            loginForwarder(emailRef, passwordRef, statusMark, language, languageData);
        }} onMouseEnter={(e) => e.currentTarget.style.animation = 'none'} 
        className='w-10 middle front primary-container'  
        style={{animation: `${props.animationIndicator === true ? 'btnTransition 3s 1 forwards' : 'default'}`}}>{Object.keys(languageData).length > 0 ? languageData.login.loginBtn[language] : ''}</button>
    </form>
    )
}