document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (token && userType) {
            if (userType !== 'service_staff') {
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                window.location.href = 'Ticket.html';
            }
        } else {
            window.location.href = 'Ticket.html'; // Show login form if not authenticated
        }
    }

    checkAuthentication();

    // Fetch and display all tickets
    async function fetchAllTickets() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/tickets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert('Error: ' + errorData.message);
                return;
            }

            const tickets = await response.json();
            const tableBody = document.getElementById('tickets-table-body');
            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ticket.subject}</td>
                    <td>${ticket.description}</td>
                    <td>${ticket.priority}</td>
                    <td>${ticket.status}</td>
                    <td>${new Date(ticket.createdAt).toLocaleString()}</td>
                    <td>${new Date(ticket.lastUpdated).toLocaleString()}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    fetchAllTickets();

    // Fetch and display all ticket counts
    async function fetchAllTicketCounts() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/tickets/counts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert('Error: ' + errorData.message);
                return;
            }

            const data = await response.json();
            document.getElementById('open-tickets-count').textContent = data.open || 0;
            document.getElementById('closed-tickets-count').textContent = data.closed || 0;
            document.getElementById('escalated-tickets-count').textContent = data.escalated || 0;
            document.getElementById('total-tickets-count').textContent = data.total || 0;
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    fetchAllTicketCounts();
});
