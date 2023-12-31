const logOut = async (setVerify, language) => {
    const logOutRequest = await fetch('https://rms-back-90595d39ec60.herokuapp.com/api/logout', {
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