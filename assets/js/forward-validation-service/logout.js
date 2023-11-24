const logOut = async (setVerify, language) => {
    const logOutRequest = await fetch('http://localhost:8080/api/logout', {
        method: 'GET',
        credentials: 'include',
    });
    if (logOutRequest.ok) {
        const logOutResponse = await logOutRequest.json();
        // log out in case of error as well
        if (logOutResponse === 'logged out') {
            setVerify(false);
            window.location.replace(`http://localhost:5500/index.html?lan=${language}`);
        } 
        else  {
            setVerify(false);
            window.location.replace(`http://localhost:5500/index.html?lan=${language}`);
        }
    } else {
        setVerify(false);
        window.location.replace(`http://localhost:5500/index.html?lan=${language}`);
    }
}