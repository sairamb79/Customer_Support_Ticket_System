document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticketId');
    const token = localStorage.getItem('token');
    const logoutButton = document.getElementById('logout-btn');

    if (!token) {
        alert('No token found. Please log in.');
        logoutUser();
    }

    // Function to log out the user
    function logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = 'Ticket.html'; // Redirect to login page
    }

    async function fetchMessages() {
        try {
            const response = await fetch(`http://localhost:8080/api/messages/${ticketId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert('1. Error: ' + errorData.message);
                return;
            }

            const messages = await response.json();
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = '';

            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.textContent = `${message.user.username}: ${message.content}`;
                messageContainer.appendChild(messageDiv);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('2. Error: ' + error.message);
        }
    }

    async function sendMessage(event) {
        event.preventDefault();

        const messageContent = document.getElementById('messageContent').value;
        if (!messageContent) {
            alert('Message content cannot be empty');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/messages/${ticketId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: messageContent }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert('3. Error: ' + errorData.message);
                return;
            }

            document.getElementById('messageContent').value = '';
            fetchMessages();
        } catch (error) {
            console.error('Error:', error);
            alert('4. Error: ' + error.message);
        }
    }

    document.getElementById('sendMessageForm').addEventListener('submit', sendMessage);

    logoutButton.addEventListener("click", function() {
        logoutUser();
    });

    if (ticketId) {
        fetchMessages();
    }
});
