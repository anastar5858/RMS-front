async function fetchLanguageData(setLanguageData) {
    // Fetch the JSON file
    const response = await fetch('https://anastar5858.github.io/RMS-front/assets/raw/language.json');
    // Check if the request was successful (status code 200)
    if (!response.ok) {
        throw new Error('Failed to fetch JSON');
    }
    const jsonData = await response.json();
    setLanguageData(jsonData);
}