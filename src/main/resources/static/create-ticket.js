document.addEventListener("DOMContentLoaded", function() {
    const ticketForm = document.getElementById('ticketForm');

    ticketForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        console.log('JWT Token:', token); // Debugging line

        const formData = new FormData(ticketForm);

        try {
            const response = await fetch('http://localhost:8080/api/tickets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    alert('Error: ' + errorData.message);
                } catch (error) {
                    alert('Error: Unable to process the request.');
                }
                return;
            }

            const data = await response.json();
            alert('Ticket created successfully');
            ticketForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    });
});
