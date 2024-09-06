document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('create-service-staff-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/admin/service-staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert('Error: ' + errorData.message);
                return;
            }

            alert('Service staff created successfully.');
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    });
});
