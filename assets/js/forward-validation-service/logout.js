const logOut = async (setVerify, language) => {
    const logOutRequest = await fetch('https://urchin-app-ihhrv.ondigitalocean.app/api/logout', {
        method: 'GET',
        credentials: 'include',
    });
    if (logOutRequest.ok) {
        const logOutResponse = await logOutRequest.json();
        if (logOutResponse === 'logged out') {
            setVerify(false);
            window.location.replace(`https://anastar5858.github.io/RMS-front/index.html?lan=${language}`);
        } 
        else  {
            setVerify(false);
            window.location.replace(`https://anastar5858.github.io/RMS-front/index.html?lan=${language}`);
        }
    } else {
        setVerify(false);
        window.location.replace(`https://anastar5858.github.io/RMS-front/index.html?lan=${language}`);
    }
}