const getDemosOfDomain = async (domain, setAllDemosDomain) => {
    // fetch the demos of this page only
    const demosResponse = await fetch(`https://rms-back-90595d39ec60.herokuapp.com/api/fetch-demos-domain/${domain}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (demosResponse.ok) {
        const data = await demosResponse.json();
        setAllDemosDomain(data);
    } else {
        // todo: handle server error
    }
}