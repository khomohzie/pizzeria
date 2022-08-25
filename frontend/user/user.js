let Name = document.getElementById("name") 
let Email = document.getElementById("email")
let EditButton = document.getElementById("edit")
let EditForm = document.getElementById("profile-form")
let SubmitEdit = document.getElementById("submitEdit")
async function checkRole() {
	let token = localStorage.getItem("token");
	if (!token) window.location.assign("/");

	await fetch("https://pizzeria-oop.herokuapp.com/api/user/me", {
		method: "get",
		headers: {
			authorization: `Bearer ${token}`,
		}
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
async function UserProfile(){
    let token = localStorage.getItem("token");
	if (!token) window.location.assign("/");

    const response = await fetch("https://pizzeria-oop.herokuapp.com/api/user/me",{
		method: "get",
		headers: {
			authorization: `Bearer ${token}`,
		}
	}) 
    const data = await response.json()
    Name.value = data.data.fullname
    Email.value = data.data.email
    console.log(data)
}
UserProfile()

EditButton.addEventListener('click',()=>{
    for(let i = 0;i < EditForm.childElementCount;i++){
        if(EditForm.children[i].tagName == 'INPUT'){
            if(EditForm.children[i].disabled == true){
                EditForm.children[i].disabled = false
            }else{
                EditForm.children[i].disabled = true
            }
            
        }
    }
})

SubmitEdit.addEventListener('click',async ()=>{
    let token = localStorage.getItem("token");
	if (!token) window.location.assign("/");

    fetch("https://pizzeria-oop.herokuapp.com/api/user/me",{
		method: "put",
		headers: {
			authorization: `Bearer ${token}`,
		},
        body:JSON.stringify({
            "data": {
            "fullname": `${Name.value}`,
            "email": `${Email.value}`}
        })
	}) 
    .then(response => response.text ())
    .then(result => console.log(result))
})