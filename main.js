const cartCounter = document.querySelector('.cart__counter');
const cartDOM = document.querySelector('.cart__items');
const totalCoun = document.querySelector("#total__counter");
const totalCost = document.querySelector(".total__cost");
const checkOutBtn = document.querySelector('.check_out_btn');

const addToCartBtn = document.querySelectorAll('.btn__add__to__cart');

checkOutBtn.addEventListener('click', () => {
    if(confirm("Are Your Sure To Clear The Cart")){
        clearCartItems();
    }
    
})

let cartItems = (JSON.parse(localStorage.getItem("cart__items"))) || [];

document.addEventListener("DOMContentLoaded", loadData);

cartCounter.addEventListener('click', () => {
    cartDOM.classList.toggle('active');
});

addToCartBtn.forEach( btn => {

    btn.addEventListener("click", () => {
        let parentElement = btn.parentElement;
        const product = {
            id : parentElement.querySelector("#product__id").value,
            name : parentElement.querySelector(".product__name").innerText,
            image : parentElement.querySelector("#image").getAttribute("src"),
            price : parentElement.querySelector(".product__price").innerText.replace("$",""),
            quantity : 1
        }

        let isInCart = cartItems.filter( item => item.id === product.id ).length > 0;
       
        if(!isInCart) {
            addItemToTheDOM(product);
        }else{
            alert("product alreaday in the cart");
            return;
        }

        const cartDOMItems = document.querySelectorAll(".cart__item");

        cartDOMItems.forEach( individualItem => {
            if(individualItem.querySelector("#product__id").value === product.id){
                increaseItem(individualItem,product);
                decreaseItem(individualItem,product);
                removeItem(individualItem,product);
            }
        });

        cartItems.push(product);
        calculateTotal();
        saveToLocalStorage();



    })

   
}) 

function saveToLocalStorage() {
    localStorage.setItem("cart__items", JSON.stringify(cartItems));

}

function addItemToTheDOM(product) {

    cartDOM.insertAdjacentHTML("afterbegin", `
    <div class="cart__item">
    <input type="hidden" name="" id="product__id" value="${product.id}">
    <img src="${product.image}" alt="" id="product__image">
    <h4 class="product__name">${product.name}</h4>
    <a href="#" class="btn__small" action="decrease">&minus;</a>
    <h4 class="product__quantity">${product.quantity}</h4>
    <a href="#" class="btn__small" action="increase">&plus;</a>
    <span class="product__price">${product.price}</span>
    <a href="#" class="btn__small btn__remove" action="remove">&times;</a>
    </div>
    `)


}

function calculateTotal() {

    let total = 0;
    cartItems.forEach( item => {
        total += item.quantity * item.price;
    });

    totalCost.innerText = total;
    totalCoun.innerText = cartItems.length;

}

function increaseItem(individualItem,product) {

    individualItem.querySelector("[action='increase']").addEventListener("click", ()=> {

        cartItems.forEach( cartItem => {
            if(cartItem.id === product.id) {
                individualItem.querySelector(".product__quantity").innerText = ++cartItem.quantity;
                calculateTotal();
                saveToLocalStorage();
            }
        })

    })

}

function decreaseItem(individualItem,product) {

    individualItem.querySelector("[action='decrease'").addEventListener("click", () => {

        cartItems.forEach( cartItem => {
            if(cartItem.id === product.id) {
                if(cartItem.quantity > 1) {
                    individualItem.querySelector(".product__quantity").innerText = --cartItem.quantity;
                } else {
                    cartItems = cartItems.filter( newElements => newElements.id !== product.id );
                    individualItem.remove();
                }
                calculateTotal();
                saveToLocalStorage();
            }
        })

    })
}

function removeItem(individualItem,product) {
    individualItem.querySelector("[action='remove']").addEventListener("click", () => {

        cartItems.forEach( cartItem => {
            if(cartItem.id === product.id) {
                cartItems = cartItems.filter( newElements => newElements.id !== product.id);
                individualItem.remove();
                calculateTotal();
                saveToLocalStorage();
            }
        })
    })
}

function loadData(){

    if(cartItems.length > 0){
        
        cartItems.forEach( product => {
            addItemToTheDOM(product);

            const cartDOMItems = document.querySelectorAll(".cart__item");

            cartDOMItems.forEach( individualItem => {
                if(individualItem.querySelector("#product__id").value === product.id){
                    increaseItem(individualItem,product);
                    decreaseItem(individualItem,product);
                    removeItem(individualItem,product);
                }
            });
    
        });

        calculateTotal();
        saveToLocalStorage();

    }

}

function clearCartItems(){
    localStorage.clear();
    cartItems = [];

    document.querySelectorAll(".cart__items").forEach( item => {
        item.querySelectorAll(".cart__item").forEach( node => {
            node.remove();
        })
    });

    calculateTotal();
}