document.addEventListener("DOMContentLoaded", function() {
    const manageServiceStaffLink = document.getElementById('manage-service-staff-link');
//    const viewStaffStatsLink = document.getElementById('view-staff-stats-link');
    const createServiceStaffLink = document.getElementById('create-service-staff-link');
    const manageServiceStaffSection = document.getElementById('manage-service-staff-section');
    const viewStaffStatsSection = document.getElementById('view-staff-stats-section');
    const createServiceStaffSection = document.getElementById('create-service-staff-section');
    const logoutButton = document.getElementById('logout-btn');
    const token = localStorage.getItem('token');

    // Check if user is authenticated
    function checkAuthentication() {
        const userType = localStorage.getItem('userType');

        if (token && userType) {
            if (userType !== 'admin') {
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                window.location.href = 'Ticket.html';
            }
        } else {
            window.location.href = 'Ticket.html'; // Show login form if not authenticated
        }
    }

    checkAuthentication();

    // Function to log out the user
    function logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = 'Ticket.html'; // Redirect to login page
    }

    logoutButton.addEventListener('click', function() {
        logoutUser();
    });

    manageServiceStaffLink.addEventListener('click', function() {
        manageServiceStaffSection.style.display = 'block';
//        viewStaffStatsSection.style.display = 'none';
        createServiceStaffSection.style.display = 'none';
        fetchAllServiceStaff();
    });

//    viewStaffStatsLink.addEventListener('click', function() {
//        manageServiceStaffSection.style.display = 'none';
//        viewStaffStatsSection.style.display = 'block';
//        createServiceStaffSection.style.display = 'none';
//        // Add logic to fetch and display staff stats
//    });

    createServiceStaffLink.addEventListener('click', function() {
        manageServiceStaffSection.style.display = 'none';
//        viewStaffStatsSection.style.display = 'none';
        createServiceStaffSection.style.display = 'block';
    });

    // Fetch all service staff
    async function fetchAllServiceStaff() {
        try {
            const response = await fetch('http://localhost:8080/api/admin/service-staff', {
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

            const serviceStaff = await response.json();
            const tableBody = document.querySelector('#service-staff-table tbody');
            tableBody.innerHTML = '';

            serviceStaff.forEach(staff => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${staff.id}</td>
                    <td>${staff.username}</td>
                    <td>${staff.email}</td>
                    <td>
                        <button class="edit-btn" data-id="${staff.id}">Edit</button>
                        <button class="delete-btn" data-id="${staff.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const staffId = this.getAttribute('data-id');
                    // Add logic to edit service staff
                });
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async function() {
                    const staffId = this.getAttribute('data-id');
                    try {
                        const response = await fetch(`http://localhost:8080/api/admin/service-staff/${staffId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            alert('Error: ' + errorData.message);
                            return;
                        }

                        alert('Service staff deleted successfully.');
                        fetchAllServiceStaff();
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error: ' + error.message);
                    }
                });
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    // Create service staff
    const createServiceStaffForm = document.getElementById('create-service-staff-form');
    createServiceStaffForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

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
            createServiceStaffForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    });

    // Initially show the manage service staff section
    manageServiceStaffLink.click();
});
