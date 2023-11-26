async function fetchLanguageData(setLanguageData) {
    const response = await fetch('https://anastar5858.github.io/RMS-front/assets/raw/language.json');
    if (!response.ok) {
        throw new Error('Failed to fetch JSON');
    }
    const jsonData = await response.json();
    setLanguageData(jsonData);
}