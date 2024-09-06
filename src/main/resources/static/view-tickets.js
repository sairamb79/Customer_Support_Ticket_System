document.addEventListener("DOMContentLoaded", async function() {
    const token = localStorage.getItem('token');
    const logoutButton = document.getElementById('logout-btn');

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

    async function fetchUserTickets() {
        try {
            const response = await fetch('http://localhost:8080/api/tickets/user', {
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
            populateTicketsTable(tickets);
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    function populateTicketsTable(tickets) {
        const ticketsTableBody = document.querySelector("#ticketsTable tbody");
        ticketsTableBody.innerHTML = '';

        tickets.forEach(ticket => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${ticket.subject}</td>
                <td>${ticket.description}</td>
                <td>${ticket.priority}</td>
                <td>${ticket.status}</td>
                <td>${new Date(ticket.createdAt).toLocaleString()}</td>
                <td>${new Date(ticket.lastUpdated).toLocaleString()}</td>
                <td>
                    <button class="messages-btn" data-id="${ticket.id}">Messages</button>
                </td>
            `;

            if (ticket.response) {
                row.classList.add("responded");
                row.addEventListener("click", () => showResponse(ticket.response));
            }

            ticketsTableBody.appendChild(row);
        });

        // Event listeners for the messages buttons
        document.querySelectorAll('.messages-btn').forEach(button => {
            button.addEventListener('click', function() {
                const ticketId = this.getAttribute('data-id');
                window.location.href = `messaging.html?ticketId=${ticketId}`;
            });
        });
    }

    function showResponse(response) {
        const modal = document.getElementById("responseModal");
        const responseText = document.getElementById("responseText");
        responseText.textContent = response;
        modal.style.display = "block";
    }

    // Close the modal when the user clicks on <span> (x)
    const closeBtn = document.querySelector(".modal .close");
    closeBtn.addEventListener("click", function() {
        const modal = document.getElementById("responseModal");
        modal.style.display = "none";
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("responseModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    logoutButton.addEventListener("click", function() {
        logoutUser();
    });

    fetchUserTickets();
});
