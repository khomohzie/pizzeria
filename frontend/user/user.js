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
			if (!request.success) {
				localStorage.removeItem("token");
				window.location.assign("/");
			}
		})
		.catch((err) => {
			return;
		});
}

checkRole();

// Get profile and edit profile