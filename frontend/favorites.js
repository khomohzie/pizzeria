window.addEventListener('DOMContentLoaded', ()=> {
    loadfavorite()

})
async function loadfavorite(){
let token = localStorage.getItem('token')
if (!token) return
fetch(`https://pizzeria-oop.herokuapp.com/api/favorite`,{
    method:'GET',
    headers: {
        'authorization' : `Bearer ${token}`
    },

})
.then(response=> response.json())
.then((json)=>{
    
    return `<div class="inner">
    <img src="${image}" alt="image of ${name}" class="card-img-top rounded">
</div>
<div class="card-body border border-light shadow p-3 mb-5 bg-body rounded">
    <h5 class="card-title">${name}</h5>
    <p class="card-text">${description}</p>
    <p class="card-text price">$${price}</p>
    <div id="${id}" onclick="order(this)" class="d-grid gap-2"><button class="btn btn-success">Order</button></div>
    <div class="d-grid gap-2" style="margin-top: 10px;" title="Add to favorites"><button onclick="addFavorite()" class="btn btn-success"><i class="fa-solid fa-heart-circle-plus"></i></button></div>
</div>`

}).catch(err=>{return})
if (getUsers.role  != 0){
    window.Location.assign('http://127.0.0.1:5500/index.html')
}
}
