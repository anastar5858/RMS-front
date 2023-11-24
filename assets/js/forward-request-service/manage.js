const fetchAllRecords = async (setRequests, setCurrentRequest, setIndexCounter) => {
    const allRequestsRequest = await fetch('http://localhost:8080/api/all-requests', {
        method: 'GET',
        credentials: 'include',
    });
    if (allRequestsRequest.ok) {
        const allRequestsResponse = await allRequestsRequest.json();
        setRequests(allRequestsResponse);
        setCurrentRequest(allRequestsResponse[0]);
        setIndexCounter(0);
    } else {
        // todo: handle server error
    }
}
const fetchMyRecords = async (setRequests, setCurrentRequest, setIndexCounter, setFilter) => {
    const myRequestsRequest = await fetch('http://localhost:8080/api/my-requests', {
        method: 'GET', 
        credentials: 'include',
    });
    if (myRequestsRequest.ok) {
        const myRequestsResponse = await myRequestsRequest.json();
        if (myRequestsResponse.length > 0) {
            setRequests(myRequestsResponse);
            setCurrentRequest(myRequestsResponse[0]);
            setIndexCounter(0);
        } else {
            setFilter('all');
        }
    } else {
        // todo: handle server error
    }
}
const fetchStatusRecord = async (setRequests, setCurrentRequest, setIndexCounter, statusFilter, setFilter) => {
    const statusRequestsRequest = await fetch(`http://localhost:8080/api/status-requests/${JSON.stringify(statusFilter)}`, {
        method: 'GET', 
        credentials: 'include',
    });
    if (statusRequestsRequest.ok) {
        const statusRequestsResponse = await statusRequestsRequest.json();
        if (statusRequestsResponse.length > 0) {
            setRequests(statusRequestsResponse);
            setCurrentRequest(statusRequestsResponse[0]);
            setIndexCounter(0);
        } else {
            setFilter('all');
        }
    } else {
        // todo: handle server error
    }
}

const updateRecordStatus = async (record, newStatus, setRequests, setCurrentRequest) => {
    const statusUpdateRequestRequest = await fetch(`http://localhost:8080/api/update-request-status`, {
        method: 'PUT', 
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        }, 
        body: JSON.stringify({...record, newStatus,}),
    });
    if (statusUpdateRequestRequest.ok) {
        const statusUpdateRequestResponse = await statusUpdateRequestRequest.json();
        setRequests(statusUpdateRequestResponse.allRequests);
        setCurrentRequest(statusUpdateRequestResponse.updatedRecord);
    } else {
        // todo: handle server error
    }
}
const checkOwnership =  async (record, setIsOwner) => {
    const payload = {
        creator: record.creator,
    }
    const ownershipRequest = await fetch(`http://localhost:8080/api/check-ownership/${JSON.stringify(payload)}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (ownershipRequest.ok) {
        const ownershipResponse = await ownershipRequest.json();
        if (ownershipResponse) setIsOwner(true);
        else setIsOwner(false);
    } else {
        // todo: handle server error
    }
}

const deleteRecord = async (record, setDeleteIndicator, btn) => {
    const deleteRequest = await fetch(`http://localhost:8080/api/delete-record`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(record),
    });
    if (deleteRequest.ok) {
        const deleteResponse = await deleteRequest.json();
        if (deleteResponse) {
            setDeleteIndicator((prev) => !prev);
            btnErrorHandler('deleted', 'success', btn)
        } 
    } else {
        // todo: handle server error
    }
}

const btnErrorHandler = (message, type, button) => {
    const currentText = button.textContent;
    button.disabled = true;
    button.textContent = message;
    button.style.color = type === 'error' ? 'red' : 'green';
    setTimeout(() => {
        button.disabled = false;
        button.textContent = currentText;
        button.style.color = 'black';
    }, 2000);
}