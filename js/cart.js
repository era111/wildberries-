function cart(){
    const carBtn = document.querySelector('.button-cart')
    const cart = document.getElementById('modal-cart')
    const closeBtn = cart.querySelector('.modal-close')
    const goodsContainer = document.querySelector('.long-goods-list')
    const cartTable = document.querySelector('.cart-table__goods')
    const modalForm = document.querySelector('.modal-form')

    const totalPrice = document.querySelector(".card-table__total"); // Сумма все корзины

    const formInputName = document.querySelector('[name="nameCustomer"]'); // input имени из модальной формы
    const formInputPhone = document.querySelector("[name='phoneCustomer']"); // input телефона из модальной формы

    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))

        const newCart = cart.filter(good => {
            return good.id !== id
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const pluseCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if (good.id===id) {
                good.count++
            }
            return good
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if (good.id===id) {
                if (good.count>0){
                    good.count--
                }

            }
            return good
        })

        localStorage.setItem('cart', JSON.stringify(cart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'))
        const clickedGood = goods.find((good)=>good.id===id)
        const cart = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : []

        console.log(cart.some(good => good.id === clickedGood.id));

        if (cart.some(good => good.id === clickedGood.id)) {
            console.log('приплюсовать');
            cart.map(good => {
                if (good.id===clickedGood.id) {
                    good.count++
                }
                return good
            })
        } else {
            console.log("дбаить в корзину");
            clickedGood.count = 1
            cart.push(clickedGood)
        }

        localStorage.setItem('cart', JSON.stringify(cart))
    }

    const renderCartGoods = (goods) => {
        cartTable.innerHTML = ''

        goods.forEach(good => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}$</td>
                <td><button class="cart-btn-minus"">-</button></td>
                <td>${good.count}</td>
                <td><button class=" cart-btn-plus"">+</button></td>
                <td>${good.price * +good.count}$</td>
                <td><button class="cart-btn-delete"">x</button></td>
            `
            cartTable.append(tr)

            tr.addEventListener('click', (event) => {
                if (event.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id)

                } else if (event.target.classList.contains('cart-btn-plus')) {
                    pluseCartItem(good.id)

                } else if (event.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id)

                }
            })
        })

        let priceCount = 0;
        goods.forEach((item) => {
            const price = item.price * item.count;
            priceCount += price;

        });
        totalPrice.innerText = priceCount + "$";
    }

    

    const sendForm = (name,phone) => {
        const cartArray = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : []
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: name,
                phone: phone
            })
        }).then (() => {
            formInputName.value = "";
            formInputPhone.value = "";
            localStorage.removeItem("cart");
            cart.style.display = "";
        })
    }



    modalForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const nameInput = formInputName.value;
        const phoneInput = formInputPhone.value;
    
        sendForm(nameInput, phoneInput);
    })
    
    carBtn.addEventListener('click', function() {
        const cartArray = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : []
        renderCartGoods(cartArray)
        cart.style.display = 'flex'
    })

    closeBtn.addEventListener('click', function() {
        cart.style.display = ''
    })

    cart.addEventListener('click', function(event) {
        if (event.target.closest('.modal') && event.target.classList.contains('overlay')) {
            cart.style.display = ''
        }

    })

    if (goodsContainer) {
        goodsContainer.addEventListener('click', (event) => {
            if (event.target.closest('.add-to-cart')) {
                const buttonToCart = event.target.closest('.add-to-cart')
                const goodId = buttonToCart.dataset.id

                addToCart(goodId)

            }
        })
    }

}

cart()