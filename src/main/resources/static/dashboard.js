document.addEventListener("DOMContentLoaded", function() {
    const newTicketBtn = document.querySelector('.new-ticket-btn');
    newTicketBtn.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'create-ticket.html'; // Redirect to create ticket page
    });

    // Check if user is authenticated
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (token && userType) {
            if (userType !== 'client') {
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                window.location.href = 'Ticket.html';
            }
        } else {
            window.location.href = 'Ticket.html';
        }
    }

//    const teamMembers = document.querySelectorAll('.team-member');
//    teamMembers.forEach(member => {
//        member.addEventListener('click', function(event) {
//            event.preventDefault();
//            const memberName = member.querySelector('.tagline').textContent;
//            alert(`Click action for ${memberName}...`);
//        });
//    });

    const sidebarMenuItems = document.querySelectorAll('.sidebar ul li a');
    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const menuItem = item.textContent.trim();
            if (menuItem === "Tickets") {
                window.location.href = 'view-tickets.html'; // Redirect to view tickets page
            } else if (menuItem === "Messages") {
                window.location.href = 'messaging.html'; // Redirect to messaging page
            } else if (menuItem === "Logout") {
                logoutUser(); // Log out the user
            } else {
                alert(`Navigating to ${menuItem}...`);
            }
        });
    });

    // Function to log out the user
    function logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = 'Ticket.html'; // Redirect to login page
    }

    // Fetch and display user-specific ticket counts
    async function fetchUserTicketCounts() {
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

    checkAuthentication();
    fetchUserTicketCounts();
});
