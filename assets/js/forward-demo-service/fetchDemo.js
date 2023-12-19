const fetchAllDemos = async (setListOfDemo) => {
    const urlWithoutSearchParams = window.location.origin + window.location.pathname;
    const demosResponse = await fetch(`https://urchin-app-ihhrv.ondigitalocean.app/api/fetch-demos/${encodeURIComponent(urlWithoutSearchParams)}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (demosResponse.ok) {
        const data = await demosResponse.json();
        setListOfDemo(data);
    } else {
        // todo: handle server error
    }
}