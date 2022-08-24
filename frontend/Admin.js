window.addEventListener('DOMContentLoaded', async () => {
    let token = localStorage.getItem('token')
    if (!token) return
 
    let request = await fetch('https://pizzeria-oop.herokuapp.com/api/user/me', {
        method : 'get',
        headers : {
            'authorization' : `Bearer ${token}`
        }
    }).then(res=>res.json()).catch(err=>{return})

    if (!request.success || request.data.user.role != 0) {
        localStorage.removeItem('token')
        window.location.assign('http://127.0.0.1:5500/index.html')
    }
})
async function getUsers(){
    let token = localStorage.getItem('token')
    if (!token) return
let request = await fetch('https://pizzeria-oop.herokuapp.com/api/admin/users', {
    method : 'get',
    headers : {
        'authorization' : `Bearer ${token}`
    }
   
}).then(res=>res.json()).catch(err=>{return})
console.log(request.data)
}
getUsers();

request.data.forEach(user => {
    // console.log(user)
    user += data.results[i]._id + "<br>"
+ data.results[i].email + "<br>"
+ data.results[i].password + "<br>"
+ data.results[i].username + "<br>"

});





