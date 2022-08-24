function createCookie(name, value, exdays) {
	if (exdays) {
		var date = new Date();
		date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = "; expires=" + date.toGMTString();
	} else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function gotToSignUp() {
	document.getElementById("sign-in-tab").style.display = "none";
	document.getElementById("sign-in-tab").reset();
	document.getElementById("sign-up-tab").style.display = "flex";
	document.getElementById("sign-up-tab").reset();
}
function gotToSignIn() {
	document.getElementById("sign-in-tab").style.display = "flex";
	document.getElementById("sign-in-tab").reset();
	document.getElementById("sign-up-tab").style.display = "none";
	document.getElementById("sign-up-tab").reset();
}

async function signUp() {
	let fullname = document.getElementById("fullname1").value;
	let email = document.getElementById("e-mail2").value;
	let username = document.getElementById("username").value;
	let password1 = document.getElementById("password2").value;
	let password2 = document.getElementById("password3").value;

	if (
		email.length < 1 ||
		username.length < 1 ||
		password1.length < 1 ||
		password2.length < 1
	) {
		return alert("User must have a valid e-mail, username and password");
	}
	if (password1 !== password2) {
		return alert("Passwords must be the same");
	}

	let data = {
		fullname: fullname,
		username: username,
		password: password1,
		email: email,
		contact: "019091012",
	};
	let request = await fetch(
		"https://pizzeria-oop.herokuapp.com/api/user/auth/signup",
		{
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			return;
		});

	if (!request || !request.success) {
		return alert("Failed to create user");
	}

	let loginData = {
		email: email,
		password: password1,
	};

	let login = await fetch(
		"https://pizzeria-oop.herokuapp.com/api/auth/signin",
		{
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginData),
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			return;
		});

	if (!login || !login.success) {
		return alert("Login failed");
	}

	createCookie("token", login.data.token, 7);

	localStorage.setItem("token", login.data.token);

	if (login.data.user.role == 0) {
		window.location.assign("http://127.0.0.1:5500/admin.html");
		return;
	}
	window.location.assign("http://127.0.0.1:5500/index.html");
}

async function signIn() {
	let email = document.getElementById("e-mail1").value;
	let password = document.getElementById("password1").value;

	if (email.length < 1 || password.length < 1) {
		return alert("A valid e-mail and password must be entered");
	}

	let data = {
		email: email,
		password: password,
	};

	let login = await fetch(
		"https://pizzeria-oop.herokuapp.com/api/auth/signin",
		{
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			return;
		});

	if (!login || !login.success) {
		return alert("Login failed");
	}

	localStorage.setItem("token", login.data.token);

	createCookie("token", login.data.token, 7);

	if (login.data.user.role == 0) {
		window.location.assign("http://127.0.0.1:5500/admin.html");
		return;
	}
	window.location.assign("http://127.0.0.1:5500/index.html");
}
