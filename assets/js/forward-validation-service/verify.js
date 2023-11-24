const verifyToken = async (setVerify) => {
    const verifyRequest = await fetch('http://localhost:8080/api/verify', {
        method: 'GET',
        credentials: 'include',
    });
    if (verifyRequest.ok) {
        const verifyResponse = await verifyRequest.json();
        if (verifyResponse === 'log in') {
            setVerify(true);
        } else {
            setVerify(false)
            window.location.replace("http://localhost:5500/index.html");
        }
    } else {
        // todo: handle server error
    }
} 