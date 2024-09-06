// Function to show the login form and hide the sign-up form
function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';

    const title = document.getElementById('title');
    title.innerHTML = "Login";
}

// Function to show the sign-up form and hide the login form
function showSignUpForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';

    const title = document.getElementById('title');
    title.innerHTML = "Sign Up";
}

// Function to handle sign-up form submission
async function signUp(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;
    var userType = "client"; // Set default userType to client

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email, userType }),
        });

        if (response.ok) {
            alert('Account created successfully for ' + username);
            document.getElementById('signupForm').reset();
            // Show login form after signing up
            showLoginForm();
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

// login function
async function login(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Login successful for ' + username);
            console.log('JWT Token:', data.jwt); // Debugging line
            console.log('User Type:', data.userType); // Debugging line
            // Store the token in localStorage or sessionStorage
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('userType', data.userType);
//            alert("..sd.fdafa");
            // Redirect to a dashboard or another page
            if (data.userType === 'service_staff') {
                window.location.href = 'view-all-tickets.html'; // Redirect to service staff dashboard
            } else if (data.userType === 'admin') {
                window.location.href = 'admin-dashboard.html'
            } else {
                window.location.href = 'dashboard.html'; // Redirect to client dashboard
            }
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }

    document.getElementById('loginForm').reset();
}

// Function to navigate the user based on their userType
function navigateUser(userType) {
    if (userType === 'service_staff') {
        window.location.href = 'view-all-tickets.html'; // Redirect to service staff dashboard
    } else if (userType === 'admin') {
        window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
    } else {
        window.location.href = 'dashboard.html'; // Redirect to client dashboard
    }
}

// Check if user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (token && userType) {
        navigateUser(userType); // Navigate to the respective dashboard
    } else {
        showLoginForm(); // Show login form if not authenticated
    }
}

// Event listeners to call functions on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication(); // Check if user is authenticated on page load

    // Event listener for clicking "Login here" link
    var loginLink = document.querySelector('#signup-form a');
    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            showLoginForm();
        });
    }

    // Event listener for clicking "Signup" link in login form
    var signupLink = document.querySelector('#login-form a');
    if (signupLink) {
        signupLink.addEventListener('click', function(event) {
            event.preventDefault();
            showSignUpForm();
        });
    }

    // Event listener for sign-up form submission
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            signUp(event);
        });
    }

    // Event listener for login form submission
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            login(event);
        });
    }
});

// Event listener for the messages button
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.messages-btn').forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            window.location.href = `messaging.html?ticketId=${ticketId}`;
        });
    });
});