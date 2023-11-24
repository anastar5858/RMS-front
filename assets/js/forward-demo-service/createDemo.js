const validateDemo = (title, url, demoElementsList) => {
    const titleTrimmed = title.trim();
    const urlTrimmed = url.trim();
    if (titleTrimmed === '' || urlTrimmed === '') return btnErrorHandler('Missing Input', 'error');
    const demoElementsListChildren = [...demoElementsList.current.children];
    if (demoElementsListChildren.length === 0) return btnErrorHandler('Missing Input', 'error');
    const demoElementsArray = []
    for (const container of demoElementsListChildren) {
        const object = {};
        const children = [...container.children];
        const idInput = children[0];
        const eventInput = children[1];
        const messageInput = children[2];
        if (idInput.value.trim() === '' ||
        eventInput.value.trim() === '' ||
        messageInput.value.trim() === '') {
            return btnErrorHandler('Invalid Input', 'error');
        }
        object.id = idInput.value.trim();
        object.event = eventInput.value.trim().toLowerCase();
        object.message = messageInput.value.trim();
        demoElementsArray.push(object);
    }
    // foward to server side (deep validation)
    const payload = {
        title: titleTrimmed,
        url: urlTrimmed,
        demoElements: demoElementsArray,
        
    }
    sendToServerController(payload)
}

const sendToServerController = async (payload) => {
    const demoRequest = await fetch('http://localhost:8080/api/create-demo', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (demoRequest.ok) {
        const demoResponse = await demoRequest.json();
        if (demoResponse === 'invalid') return btnErrorHandler('Error Check Input', 'error');
        if (demoResponse === 'invalid event') return btnErrorHandler('Error Check events (click or input only)', 'error');
        if (demoResponse === 'invalid url') return btnErrorHandler('Error Check url', 'error');
        sharedIndicator((prev) => !prev);
        return btnErrorHandler('Demo Added', 'success');
    } else {
        return btnErrorHandler('Server Error', 'success');
    }
}


const btnErrorHandler = (message, type) => {
    const registerBtn = document.getElementById('publish-demo-btn');
    const currentText = registerBtn.textContent;
    registerBtn.disabled = true;
    registerBtn.textContent = message;
    registerBtn.style.color = type === 'error' ? 'red' : 'green';
    setTimeout(() => {
        registerBtn.disabled = false;
        registerBtn.textContent = currentText;
        registerBtn.style.color = 'black';
    }, 2000);
}