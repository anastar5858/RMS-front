let sharedRegister;
let dashboardView;
const Navbar = (props) => {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const urlParamater = new URLSearchParams(window.location.search);
    const lan = urlParamater.get('lan')
    const [registered, setregistered] = React.useState(props.loggedIn ? true : false);
    const [verify, setVerify] = React.useState(props.loggedIn ? true : false);
    const [language, setLanguage] = React.useState(lan ? lan : 'en');
    const [languageData, setLanguageData] = React.useState({});
    React.useEffect(() => {
        fetchLanguageData(setLanguageData);
    }, []);
    // for hamburger menu displau
    const [hamburgerDisplay, setHamburgerDisplay] = React.useState(windowWidth < 630 ? true : false);
    React.useEffect(() => {
      sharedRegister = setregistered;
    } , []);
    React.useEffect(() => {
      if (registered && !props.loggedIn) {
        verifyToken(setVerify);
        window.location.replace(`http://localhost:5500/assets/html/protected.html?lan=${language}`);
      } else if (props.loggedIn) {
        verifyToken(setVerify);
      }
    }, [registered]);
    React.useEffect(() => {
      // registeration and log in update on navbar language change
      if (sharedLan !== undefined) {
        if (typeof sharedLan === 'function') {
          sharedLan(language);
        }
      }
      if (sharedLanFooter !== undefined) {
        if (typeof sharedLanFooter === 'function') {
          sharedLanFooter(language);
        }
      }  
    } , [language])
    return (
      <div className='flex-row primary' dir={Object.keys(languageData).length > 0 ? languageData.direction[language] : ''}>
        <picture>
         <img width='50px' height='20px' src={props.loggedIn ? '../images/RMSLogo.svg' : 'assets/images/RMSLogo.svg'}/>
         <figcaption>
          <i>{Object.keys(languageData).length > 0 ? languageData.navbar.logoText[language] : ''}</i>
         </figcaption>
        </picture>
        {/* hamburger menu */}
        {hamburgerDisplay && (
        <div className="menudiv">
          <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label> 
          <input type="checkbox" id="menu-toggle" className="checkbox-input" />
          <input type="checkbox" id="menu-toggle2" className="checkbox-input" />
          <label htmlFor="menu-toggle2" className="menu-icon">&#9776;</label>
          <menu id="the-menu" className="the-menu">
          {verify && (
              <> 
              <li>
                <button id='log-out-btn' onClick={() => {
                  logOut(setVerify, language);
                }} className='primary-container'>{Object.keys(languageData).length > 0 ? languageData.navbar.logout[language] : ''}</button>
              </li>
              <li>
                <a id='create-new-request-link' onClick={() => sharedRouter('create')}>{Object.keys(languageData).length > 0 ? languageData.navbar.create[language] : ''}</a>
              </li>
              <li>
                <a id='manage-requests-link' onClick={() => sharedRouter('manage')}>{Object.keys(languageData).length > 0 ? languageData.navbar.manage[language] : ''}</a>
              </li>
              </>
          )}
          {!verify && (
            <> 
            <li>
              <a>{Object.keys(languageData).length > 0 ? languageData.navbar.register[language] : ''}</a>
            </li>
            <li>
              <a id='login-link'>{Object.keys(languageData).length > 0 ? languageData.navbar.login[language] : ''}</a>
            </li>
            </>
          )}
          <details id='change-language-mode' className='flex-column'>
            <summary>{Object.keys(languageData).length > 0 ? languageData.navbar.language[language] : ''}</summary>
            <label htmlFor='ar'>عربي</label>
            <input onClick={() => setLanguage('ar')} type='radio' id='ar' name='lan'></input>
            <label htmlFor='en'>English</label>
            <input onClick={() => setLanguage('en')} type='radio' id='en' name='lan'></input>
        </details>
          </menu>
        </div> 
        )}
        {/* desktop view */}
        {!hamburgerDisplay && (
        <ul className='flex-row'>
        {verify && (
          <> 
          <li>
            <button id='log-out-btn' onClick={() => {
                logOut(setVerify, language);
            }} className='primary-container'>{Object.keys(languageData).length > 0 ? languageData.navbar.logout[language] : ''}</button>
          </li>
          <li>
            <a id='create-new-request-link' onClick={() => sharedRouter('create')}>{Object.keys(languageData).length > 0 ? languageData.navbar.create[language] : ''}</a>
          </li>
          <li>
            <a id='manage-requests-link' onClick={() => sharedRouter('manage')}>{Object.keys(languageData).length > 0 ? languageData.navbar.manage[language] : ''}</a>
          </li>
          </>
        )}
        {!verify && (
          <> 
          <li>
            <a>{Object.keys(languageData).length > 0 ? languageData.navbar.register[language] : ''}</a>
          </li>
          <li>
            <a id='login-link'>{Object.keys(languageData).length > 0 ? languageData.navbar.login[language] : ''}</a>
          </li>
          </>
        )}
        <details id='change-language-mode' className='flex-column'>
            <summary>{Object.keys(languageData).length > 0 ? languageData.navbar.language[language] : ''}</summary>
            <label htmlFor='ar'>عربي</label>
            <input onClick={() => setLanguage('ar')} type='radio' id='ar' name='lan'></input>
            <label htmlFor='en'>English</label>
            <input onClick={() => setLanguage('en')} type='radio' id='en' name='lan'></input>
        </details>
        </ul>
        )}
      </div>
    );
  }