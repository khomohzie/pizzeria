async function checkRole() {
	let token = localStorage.getItem("token");
	if (!token) window.location.assign("/");

	await fetch("https://pizzeria-oop.herokuapp.com/api/user/me", {
		method: "get",
		headers: {
			authorization: `Bearer ${token}`,
		},
	})
		.then((res) => res.json())
		.then((request) => {
			if (!request.success || request.data.role != 0) {
				localStorage.removeItem("token");
				window.location.assign("/");
			}
		})
		.catch((err) => {
			return;
		});
}

checkRole();

async function getAdminInfo() {
	let token = localStorage.getItem("token");

	if (!token) return;

	let request = await fetch(
		"https://pizzeria-oop.herokuapp.com/api/user/me",
		{
			method: "get",
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			return;
		});

	console.log(request.data);

	let container = document.getElementById("home-username");
	container.innerHTML = "";
	let h3 = document.createElement("h3");
	h3.innerText = `Welcome ${request.data.username}`;
	let button = document.createElement("button");
	button.onclick = () => logout();
	button.innerText = "Logout";
	container.appendChild(h3);
	container.appendChild(button);
}

getAdminInfo();

// Create
const pizzaForm = document.getElementById("pizza-form");

const fileInput = document.getElementById("image");
const imageParagraph = document.getElementById("image-uploaded");

fileInput.addEventListener("change", () => {
	imageParagraph.innerText = fileInput.files[0].name;
});

const onFormSubmit = function (event) {
	let token = localStorage.getItem("token");

	if (!token) return;

	event.preventDefault(); //Without preventing the default, the browser would attempt to navigate to the URL of the form action attribute when the form is submitted.

	const formData = new FormData();

	// Now, get the data to work with
	const name = document.getElementById("name").value;
	const description = document.getElementById("description").value;
	const price = document.getElementById("price").value;

	const data = JSON.stringify({
		name: name,
		description: description,
		price: price,
	});

	formData.append("image", fileInput.files[0]);
	formData.append("data", data);

	// fetch POST request
	fetch("https://pizzeria-oop.herokuapp.com/api/pizza", {
		method: "POST",
		body: formData,
		headers: {
			authorization: `Bearer ${token}`,
		},
	})
		.then(async function (res) {
			if (res.status == 200) {
				let response = await res.json();
				console.log(response);

				let success = document.getElementById("alert");

				success.style.background = "#DFF2BF";
				success.style.color = "#270";
				success.style.display = "block";

				success.innerHTML = `
                    <div>
                        <p>${response.message}</p>
                        <p>${response.data.name}</p>
                    </div>
                `;
			}
			res.json().then(function (data) {
				console.log(data);

				let error = document.getElementById("alert");

				error.style.display = "block";

				error.innerHTML = `
					<div>
						<p>${data.message}</p>
						<p>${data.data}</p>
					</div>
			`;
			});
		})
		.catch((err) => {
			console.log("ERROR:", err.message);
		});
};

// Then add the event listener for the form and function.

pizzaForm.addEventListener("submit", onFormSubmit);

async function getUsers() {
	let token = localStorage.getItem("token");
	if (!token) return;
	let request = await fetch(
		"https://pizzeria-oop.herokuapp.com/api/admin/users",
		{
			method: "get",
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			return;
		});
	console.log(request.data);

	request.data.forEach((user) => {
		console.log(user);
		user +=
			data.results[i]._id +
			"<br>" +
			data.results[i].email +
			"<br>" +
			data.results[i].password +
			"<br>" +
			data.results[i].username +
			"<br>";
	});
}

getUsers();
