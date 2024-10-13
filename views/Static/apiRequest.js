document.getElementById('api-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form data
    const method = document.getElementById('method').value;
    const url = document.getElementById('url').value;
    const token = document.getElementById('token').value;
    const body = document.getElementById('body').value;

    // Create headers object
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
 
    try {
        // Send request
        const response = await axios({
            method: method,
            url: url,
            data: method !== 'GET' ? body : null,
            headers: headers
        });

        // Display response
        document.getElementById('response').textContent = JSON.stringify(response.data, null, 4);
    } catch (error) {
        // Display error
        document.getElementById('response').textContent = error.toString();
    }
});
