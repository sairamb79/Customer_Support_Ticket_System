document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    const logoutButton = document.getElementById('logout-btn');

    // Check if user is authenticated
    function checkAuthentication() {
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

    if (!token) {
        alert('No token found. Please log in.');
        return;
    }

    // Function to log out the user
    function logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = 'Ticket.html'; // Redirect to login page
    }

    async function fetchAllTickets() {
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
            const tableBody = document.querySelector('#tickets-table tbody');
            tableBody.innerHTML = '';

            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ticket.subject}</td>
                    <td>${ticket.description}</td>
                    <td>
                        <select class="priority-dropdown" data-id="${ticket.id}">
                            <option value="Low" ${ticket.priority.toLowerCase() === 'low' ? 'selected' : ''}>Low</option>
                            <option value="Medium" ${ticket.priority.toLowerCase() === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="High" ${ticket.priority.toLowerCase() === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </td>
                    <td>
                        <select class="status-dropdown" data-id="${ticket.id}">
                            <option value="Open" ${ticket.status.toLowerCase() === 'open' ? 'selected' : ''}>Open</option>
                            <option value="Closed" ${ticket.status.toLowerCase() === 'closed' ? 'selected' : ''}>Closed</option>
                            <option value="Pending" ${ticket.status.toLowerCase() === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="Escalated" ${ticket.status.toLowerCase() === 'escalated' ? 'selected' : ''}>Escalated</option>
                        </select>
                    </td>
                    <td>${ticket.createdAt}</td>
                    <td>${ticket.lastUpdated}</td>
                    <td>${ticket.response ? ticket.response : 'No response'}</td>
                    <td class="actions">
                        ${ticket.status.toLowerCase() === 'open' ? `<button class="respond-btn" data-id="${ticket.id}">Respond</button>` : ''}
                        <button class="messages-btn" data-id="${ticket.id}">Messages</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Event listeners for the respond buttons
            document.querySelectorAll('.respond-btn').forEach(button => {
                button.addEventListener('click', async function() {
                    const ticketId = this.getAttribute('data-id');
                    const response = prompt('Enter your response:');
                    if (response) {
                        try {
                            const responseResult = await fetch(`http://localhost:8080/api/tickets/${ticketId}/respond`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({ response }),
                            });

                            if (!responseResult.ok) {
                                const errorData = await responseResult.json();
                                alert('Error: ' + errorData.message);
                                return;
                            }

                            alert('Response submitted successfully.');
                            fetchAllTickets();
                        } catch (error) {
                            console.error('Error:', error);
                            alert('Error: ' + error.message);
                        }
                    }
                });
            });

            // Event listeners for the priority dropdowns
            document.querySelectorAll('.priority-dropdown').forEach(dropdown => {
                dropdown.addEventListener('change', async function() {
                    const ticketId = this.getAttribute('data-id');
                    const priority = this.value;

                    try {
                        const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/priority`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({ priority }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            alert('Error: ' + errorData.message);
                            return;
                        }

                        alert('Priority updated successfully.');
                        fetchAllTickets();
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error: ' + error.message);
                    }
                });
            });

            // Event listeners for the status dropdowns
            document.querySelectorAll('.status-dropdown').forEach(dropdown => {
                dropdown.addEventListener('change', async function() {
                    const ticketId = this.getAttribute('data-id');
                    const status = this.value;

                    try {
                        const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/status`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            alert('Error: ' + errorData.message);
                            return;
                        }

                        alert('Status updated successfully.');
                        fetchAllTickets();
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error: ' + error.message);
                    }
                });
            });

            // Event listeners for the messages buttons
            document.querySelectorAll('.messages-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const ticketId = this.getAttribute('data-id');
                    window.location.href = `messaging.html?ticketId=${ticketId}`;
                });
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    fetchAllTickets();

    logoutButton.addEventListener('click', function(){
        logoutUser();
    });
});
