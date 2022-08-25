window.addEventListener("DOMContentLoaded", () => {
	handleSignIn();
});

function goToSignInPage() {
	window.location.assign("/sign-in.html");
}
function goToMenuPage() {
	window.location.assign("/menu.html");
}

async function handleSignIn() {
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

	if (!request.success) {
		localStorage.removeItem("token");
	}

	if (request.data.role == 1 || request.data.role == 0) {
		let container = document.getElementById("home-username");
		let containerlog = document.getElementById("home-username-log");
		let namediv = document.getElementById("username");

		container.style.display = "none";
		containerlog.style.display = "flex";
		containerlog.style.alignItems = "center";
		namediv.innerHTML = `Welcome ${request.data.username}`;
		namediv.style.marginLeft = "6px";
	}
}

function logout() {
	localStorage.removeItem("token");
	// window.location.reload()
	window.location.assign("/");
}
