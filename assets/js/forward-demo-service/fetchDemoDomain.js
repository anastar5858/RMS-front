const getDemosOfDomain = async (domain, setAllDemosDomain) => {
    // fetch the demos of this page only
    const demosResponse = await fetch(`http://localhost:8080/api/fetch-demos-domain/${domain}`);
    if (demosResponse.ok) {
        const data = await demosResponse.json();
        setAllDemosDomain(data);
    } else {
        // todo: handle server error
    }
}