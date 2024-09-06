document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messagesDiv = document.getElementById('messages');
    const token = localStorage.getItem('token');

    const fetchMessages = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/messages/${ticketId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const messages = await response.json();
            messagesDiv.innerHTML = messages.map(message => `
                <div>
                    <strong>${message.user.username}</strong>: ${message.content}
                    <br><small>${message.timestamp}</small>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        const ticketId = document.getElementById('ticketId').value;
        const content = document.getElementById('message-content').value;

        try {
            await fetch(`http://localhost:8080/api/messages/${ticketId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            document.getElementById('message-content').value = '';
            fetchMessages(ticketId);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    messageForm.addEventListener('submit', sendMessage);

    const ticketId = document.getElementById('ticketId').value;
    fetchMessages(ticketId);
});
