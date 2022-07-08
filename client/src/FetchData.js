async function fetchData (reqMethod, url, requestData, token) {
    const requestOptions = {
        method: reqMethod,
        credentials: "include",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    };
    const response = await fetch(url, requestOptions);
    return await response.json();

}
export default fetchData;