document.getElementById('registerForm')?.addEventListener('submit', function (e) {
	e.preventDefault();
	const formData = {
		first_name: document.getElementById('fname').value,
		last_name: document.getElementById('lname').value,
		email: document.getElementById('email').value,
		phone: document.getElementById('phone').value,
		password: document.getElementById('password').value
	};

	fetch('/api/customers/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Customer registered successfully') {
				alert('Registration successful!');
				window.location.href = 'index.html';
			} else {
				alert(data.message);
			}
		})
		.catch(error => console.error('Error:', error));
});

document.getElementById('customerForm').addEventListener('submit', function (e) {
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

	fetch('http://localhost:5000/api/customers/new', {
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

document.getElementById('loginForm')?.addEventListener('submit', function (e) {
	e.preventDefault();

	const formData = {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value
	};

	fetch('/api/customers/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData),
	})
		.then(response => response.json())
		.then(data => {
			if (data.message === 'Login successful') {
				// Store customer data in localStorage
				localStorage.setItem('token', data.token);
				localStorage.setItem('firstName', data.first_name);
				localStorage.setItem('companyName', data.companyName);
				localStorage.setItem('_id', data._id);
				localStorage.setItem('password', data.password);
				localStorage.setItem('lastName', data.last_name);
				localStorage.setItem('email', data.email);
				localStorage.setItem('phone', data.phone);
				localStorage.setItem('company_address', data.c);
				// Redirect to portal
				window.location.href = 'portal.html';
			} else {
				alert(data.message);
			}
		})
		.catch(error => console.error('Error:', error));
});
