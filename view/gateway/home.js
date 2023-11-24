let animationIndicator = null;
let sharedLan;
const Home = (props) => {
    const urlParamater = new URLSearchParams(window.location.search);
    const lan = urlParamater.get('lan')
    // alternate between register and login views
    const [register, setRegister] = React.useState(true);
    const [language, setLanguage] = React.useState(lan ? lan : 'en');
    const links = document.querySelectorAll('a');
    links.forEach((link) => link.addEventListener('click', (e) => {
        e.currentTarget.textContent === 'Register' ||  e.currentTarget.textContent === 'سوي حساب جديد' ? setRegister(true) : setRegister(false)
    }));
    React.useEffect(() => {
        sharedLan = setLanguage;
        animationIndicator = !animationIndicator;
    }, [register]);
    return (
        <>
            {register && <Register animationIndicator={animationIndicator} language={language}/>}
            {!register && <Login animationIndicator={animationIndicator} language={language}/>}
        </>
    )
}