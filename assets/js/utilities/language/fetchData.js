async function fetchLanguageData(setLanguageData) {
    // Fetch the JSON file
    const response = await fetch('http://localhost:5500/assets/raw/language.json');
    // Check if the request was successful (status code 200)
    if (!response.ok) {
        throw new Error('Failed to fetch JSON');
    }
    const jsonData = await response.json();
    setLanguageData(jsonData);
}