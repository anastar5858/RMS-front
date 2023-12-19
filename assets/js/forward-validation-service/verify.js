const verifyToken = async (setVerify) => {
    const verifyRequest = await fetch('https://urchin-app-ihhrv.ondigitalocean.app/api/verify', {
        method: 'GET',
        credentials: 'include',
    });
    if (verifyRequest.ok) {
        const verifyResponse = await verifyRequest.json();
        if (verifyResponse === 'log in') {
            setVerify(true);
        } else {
            setVerify(false)
            window.location.replace("https://anastar5858.github.io/RMS-front/index.html");
        }
    } else {
        // todo: handle server error
    }
} 