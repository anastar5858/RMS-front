const getDemosOfDomain = async (domain, setAllDemosDomain) => {
    const demosResponse = await fetch(`https://squid-app-i93aj.ondigitalocean.app/api/fetch-demos-domain/${domain}`, {
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