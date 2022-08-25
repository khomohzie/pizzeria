let pizzas
window.addEventListener('DOMContentLoaded', ()=> {
    getPizzas()
    getCart()
    getCartNumber()
    handleSignIn()
})
 
let searchBar = document.getElementById('search-bar')
searchBar.addEventListener('input', (e)=>{
    let container = document.getElementById('item-cont')
    container.innerHTML = ''
    let keyword = e.target.value
    let searchCount = 0
    pizzas.forEach(item => {
        if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
            let div = document.createElement('div')
            div.classList.add('col-12', 'col-md-6', 'col-lg-4')
            div.id = item._id
            div.innerHTML += renderCard(item._id, item.name, item.price, item.image, item.description)
            container.appendChild(div)
            searchCount += 1
        }
    })
    if (searchCount <= 0) {
        container.innerHTML = ''
        let h3 = document.createElement('h3')
        h3.innerText = `No pizzas that match the keyword ${keyword}`
        container.appendChild(h3)
    }
})
 
async function handleSignIn () {
    let token = localStorage.getItem('token')
    if (!token) return;
 
    let request = await fetch('https://pizzeria-oop.herokuapp.com/api/user/me', {
        method : 'get',
        headers : {
            'authorization' : `Bearer ${token}`
        }
    }).then(res=>res.json()).catch(err=>{return})
 
    if (!request.success) {localStorage.removeItem('token')}
 
    if (request.data.role == 1) {
        let container = document.getElementById('home-username')
        container.innerHTML = ''
        let h4 = document.createElement('h4')
        h4.innerText = `Welcome ${request.data.username}`
        let button = document.createElement('button')
        button.onclick = () => logout()
        button.innerText = 'Logout'
        container.appendChild(h4)
        container.appendChild(button)
    }
}
 
function logout () {
    localStorage.removeItem('token')
    // window.location.reload()
    window.location.assign('/')
}
 
function goToSignInPage() {
    window.location.assign('/sign-in.html')
}
 
async function getPizzas () {
    let response = await fetch('https://pizzeria-oop.herokuapp.com/api/pizza', {method : 'get',}).then(res=>res.json())
    pizzas = response.data
    let container = document.getElementById('item-cont')
    container.innerHTML = ''
   
    pizzas.forEach(item => {
        let div = document.createElement('div')
        div.classList.add('col-12', 'col-md-6', 'col-lg-4')
        div.id = item._id
        div.innerHTML += renderCard(item._id, item.name, item.price, item.image, item.description)
        container.appendChild(div)
    })
}
 var globalId;
function renderCard (id, name, price, image, description) {
    globalId = id;
    return `<div class="inner">
                <img src="${image}" alt="image of ${name}" class="card-img-top rounded">
            </div>
            <div class="card-body border border-light shadow p-3 mb-5 bg-body rounded">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${description}</p>
                <p class="card-text price">$${price}</p>
                <div id="${id}" onclick="order(this)" class="d-grid gap-2"><button class="btn btn-success">Order</button></div>
                <div class="d-grid gap-2" style="margin-top: 10px;" title="Add to favorites"><button id="${id}" onclick="addFavorite(this)" class="btn btn-success"><i class="fa-solid fa-heart-circle-plus"></i></button></div>
            </div>`
            
}

function addFavorite(clickedElement){
    let token = localStorage.getItem('token')
    if (!token) return
    
let data = {
    pizza : clickedElement.id
}

fetch(`https://pizzeria-oop.herokuapp.com/api/favorite`,{
    method:'POST',
    headers: {
        'authorization' : `Bearer ${token}`,
        'Content-Type' : `application/json`
    },
    body : JSON.stringify(data),
})
.then((response)=>response.json())
.then((json)=>{
    console.log(json);
})
.catch((error)=>{
    console.error('Error:',error)
})
if (request.success){
    return alert('Pizza added to favorites')
}
}
 
 

 
function order(clickedElement) {
    let cart = localStorage.getItem('cart')

    let id = clickedElement.id
    if (!cart) {
        let div = document.createElement('div')
        div.innerHTML += orderDropdown()
        clickedElement.parentElement.appendChild(div)
        clickedElement.parentElement.removeChild(clickedElement)
    }
    cart = JSON.parse(cart)
    if (cart[id]){
        return alert('Item already exists in cart')
    }
    else{
        let div = document.createElement('div')
        div.innerHTML += orderDropdown()
        clickedElement.parentElement.appendChild(div)
        clickedElement.parentElement.removeChild(clickedElement)
    }
}
function orderDropdown () {
    return `<div class="order-dropdown">
                <select>
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                </select>
                <button class="add-cart" onclick="addToCart(this)">Add to Cart</button>
            </div>
            `
}
 
function cartItemRender (id, image, name, price, category, quantity) {
    return `<div class="product-cont">
                <div class="d-flex justify-content-between align-items-center">
                    <img src="${image}" alt="image of ${name}">
                    <div style="max-width: 70%; display: flex; flex-direction: column; text-align: center;">
                        <p class="fs-5">${name}</p>
                        <span class="fw-bold">$${price}</span>
                        <span class="text-uppercase fw-light">${category}</span>
                    </div>
                    <i class="fas fa-trash" id="${id}" onclick="deletefromCart(this)"></i>
                </div>
                <div class="quantity-control">
                    <button id="${id}" onclick="decreaseQuantity(this)">-</button>
                    <div>${quantity}</div>
                    <button id="${id}" onclick="increaseQuantity(this)">+</button>
                </div>
            </div>`
}
 
function increaseQuantity (clickedElement) {
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    let id = clickedElement.id
    if (cart[id].quantity >= 30) {return}
    cart[id].quantity += 1
    clickedElement.previousElementSibling.innerText = cart[id].quantity
    localStorage.setItem('cart', JSON.stringify(cart))
    getCart()
}
function decreaseQuantity (clickedElement) {
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    let id = clickedElement.id
    if (cart[id].quantity <= 1) {return}
    cart[id].quantity -= 1
    clickedElement.nextElementSibling.innerText = cart[id].quantity
    localStorage.setItem('cart', JSON.stringify(cart))
    getCart()
}
 
function addToCart (clickedElement) {
    let cart = localStorage.getItem('cart') || '{}'
    cart = JSON.parse(cart)
    let id = clickedElement.parentElement.parentElement.parentElement.parentElement.id
 
    let selectTag = clickedElement.previousElementSibling
 
    pizzas.forEach(item => {
        if (item._id == id) {
            cart[item._id] = {
                name : item.name,
                price : item.price,
                quantity : 1,
                category : selectTag.value,
                image : item.image
            }
 
            localStorage.setItem('cart', JSON.stringify(cart))
            location.reload()
            return alert(`${cart[id].name} has been added to cart`)
        }
    })
}
 
function openCart () {
    if (document.getElementById('cart-dropdown').classList.contains('cart-dropdown-closed')) {
        document.getElementById('cart-dropdown').classList.replace('cart-dropdown-closed', 'cart-dropdown')
        document.getElementById('items-container').innerHTML = ''
        getCart()
    }
}
function closeCart () {
    if (document.getElementById('cart-dropdown').classList.contains('cart-dropdown')) {
        document.getElementById('cart-dropdown').classList.replace('cart-dropdown', 'cart-dropdown-closed')
    }
}
 
function getCart () {
    let cart = localStorage.getItem('cart')
    document.getElementById('items-container').innerHTML = ''
    let total = 0
    if (!cart) {
        let h3 = document.createElement('h3')
        h3.classList.add('m-3')
        h3.innerText = 'No items in cart'
        document.getElementById('items-container').appendChild(h3)
        document.getElementById('cart-total').innerText = 0
    }
    else{
        cart = JSON.parse(cart)
        for (key in cart) {
            let div = document.createElement('div')
            div.innerHTML += cartItemRender(key, cart[key].image, cart[key].name, cart[key].price, cart[key].category, cart[key].quantity)
            document.getElementById('items-container').appendChild(div)
 
            let productPrice = cart[key].price
            productPrice = Number(productPrice)
            total += cart[key].quantity * productPrice
        }
        document.getElementById('cart-total').innerHTML = `$${total.toFixed(2)}`
    }
}
 
function getCartNumber () {
    let cart = localStorage.getItem('cart')
    if (!cart) {
        document.getElementById('cart-counter').innerText = 0
    }
    else{
        cart = JSON.parse(cart)
        let cartNo = 0
        Object.keys(cart).forEach(key => {
            cartNo += 1
        })
        document.getElementById('cart-counter').innerText = cartNo
    }
}
 
function deletefromCart (clickedElement) {
    let cart = localStorage.getItem('cart')
    let id = clickedElement.id
    cart = JSON.parse(cart)
    delete cart[id]
    localStorage.setItem('cart', JSON.stringify(cart))
    document.getElementById('items-container').innerHTML = ''
    getCart()
    getCartNumber()
}

async function checkout () {
    let token = localStorage.getItem('token')
    if (!token) return
 
    let request = await fetch('https://pizzeria-oop.herokuapp.com/api/user/me', {
        method : 'get',
        headers : {
            'authorization' : `Bearer ${token}`
        }
    }).then(res=>res.json()).catch(err=>{return})
 
    if (!request.success) {
        localStorage.removeItem('token')
        return alert('User must be logged in')
    }
   
    let id = pizzas[0]._id

   
 
    let paystackReq = await fetch(`https://pizzeria-oop.herokuapp.com/api/order/pay/pizza/${id}`, {
        method : 'post',
        headers : {
            'authorization' : `Bearer ${token}`
        }
    }).then(res=>res.json()).catch(err=>{return})
 
    localStorage.setItem("paystack", paystackReq.data.reference);

    if (paystackReq.success === true) {
        window.location.href = paystackReq.data.paystackUrl
    }
}
