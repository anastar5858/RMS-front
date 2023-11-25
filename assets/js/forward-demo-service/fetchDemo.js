const fetchAllDemos = async (setListOfDemo) => {
    const urlWithoutSearchParams = window.location.origin + window.location.pathname;
    // fetch the demos of this page only
    const demosResponse = await fetch(`https://rms-back-90595d39ec60.herokuapp.com/api/fetch-demos/${encodeURIComponent(urlWithoutSearchParams)}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (demosResponse.ok) {
        const data = await demosResponse.json();
        console.log(data)
        setListOfDemo(data);
    } else {
        // todo: handle server error
    }
}