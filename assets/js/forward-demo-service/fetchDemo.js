const fetchAllDemos = async (setListOfDemo) => {
    const urlWithoutSearchParams = window.location.origin + window.location.pathname;
    // fetch the demos of this page only
    const demosResponse = await fetch(`http://localhost:8080/api/fetch-demos/${encodeURIComponent(urlWithoutSearchParams)}`);
    if (demosResponse.ok) {
        const data = await demosResponse.json();
        console.log(data)
        setListOfDemo(data);
    } else {
        // todo: handle server error
    }
}