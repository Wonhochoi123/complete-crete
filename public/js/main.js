// Handle Customer Registration Form
document.getElementById('customerForm')?.addEventListener('submit', function (e) {
	e.preventDefault();

	const formData = {
		first_name: document.getElementById('fnam').value,
		last_name: document.getElementById('lname').value,
		email: document.getElementById('email').value,
		phone: document.getElementById('phone').value,
		password: document.getElementById('password').value,
		company_name: document.getElementById('company_name').value,
		company_address: document.getElementById('company_address').value
	};

	// Adjust this URL to match your backend server
	fetch('https://complete-crete.onrender.com/api/customers/new', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formData),
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Customer created successfully') {
				alert('Registration successful!');
				window.location.href = 'index.html';
			} else {
				alert(data.message);
			}
		})
		.catch(error => console.error('Error:', error));
});

// Handle Customer Login Form
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
	e.preventDefault();

	const formData = {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value
	};

	// Adjust this URL to match your backend server
	fetch('https://complete-crete.onrender.com/api/customers/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Login successful') {
				localStorage.setItem('token', data.token);
				localStorage.setItem('customerData', JSON.stringify(data.customer));
				window.location.href = 'portal.html';
			} else {
				alert(data.message);
			}
		})
		.catch(error => console.error('Error:', error));
});

// Handle Manage Account Form
document.getElementById('manageAccountForm')?.addEventListener('submit', function (e) {
	e.preventDefault();

	const updatedData = {
		first_name: document.getElementById('firstName').value,
		last_name: document.getElementById('lastName').value,
		email: document.getElementById('email').value,
		phone: document.getElementById('phone').value,
		company_name: document.getElementById('companyName').value,
		company_address: document.getElementById('companyAddress').value,
		password: document.getElementById('newPassword').value // Optional password change
	};

	// Adjust this URL to match your backend server
	fetch('https://complete-crete.onrender.com/api/customers/update', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updatedData)
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Account updated successfully') {
				alert('Account updated successfully!');
				localStorage.setItem('customerData', JSON.stringify(data.customer)); // Update localStorage
			} else {
				alert('Failed to update account.');
			}
		})
		.catch(error => console.error('Error:', error));
});
