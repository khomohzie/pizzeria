window.onload = async () => {
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
		return alert("User must be logged in");
	}
	console.log(request.data);

	let reference = localStorage.getItem("paystack");

	const verifyRequest = await fetch(
		`localhost:4000/api/order/paystack/verify-transaction?reference=${reference}`,
		{
			method: "get",
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			console.log(err);
		});

	if (verifyRequest.success) {
		const messageElement = document.getElementById("verified-message");

		messageElement.textContent = verifyRequest.message;
	}
};
