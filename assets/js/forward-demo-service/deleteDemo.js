const deleteDemo = async (demoName, btn, setDeleteIndicator) => {
    const payload = {name: demoName};
    const deleteRequest = await fetch(`http://localhost:8080/api/delete-demo`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (deleteRequest.ok) {
        const deleteResponse = await deleteRequest.json();
        if (deleteResponse) {
            btnErrorHandlerDemos('deleted', 'success', btn, setDeleteIndicator)
        } 
    } else {
        return btnErrorHandler('Server Error', 'success');
    }
}

const btnErrorHandlerDemos = (message, type, button, setDeleteIndicator) => {
    const currentText = button.textContent;
    button.disabled = true;
    button.textContent = message;
    button.style.color = type === 'error' ? 'red' : 'green';
    setTimeout(() => {
        setDeleteIndicator((prev) => !prev);
        button.disabled = false;
        button.textContent = currentText;
        button.style.color = 'black';
    }, 2000);
}