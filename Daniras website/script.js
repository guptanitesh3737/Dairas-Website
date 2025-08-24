let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product, price) {
    cart.push({product, price});
    alert(product + " added to cart!");
    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCart() {
    let cartItemsDiv = document.getElementById('cart-items');
    let totalDiv = document.getElementById('total');
    if(!cartItemsDiv || !totalDiv) return;

    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        cartItemsDiv.innerHTML += `<p>${item.product} - Rs. ${item.price} <button onclick="removeItem(${index})">Remove</button></p>`;
    });
    totalDiv.innerText = "Total: Rs. " + total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Payment selection modal
function payOption(method) {
    if(method === 'stripe') checkoutStripe();
    else if(method === 'esewa') checkoutESewa();
    else if(method === 'khalti') checkoutKhalti();
}

// Stripe Checkout
function checkoutStripe() {
    const stripe = Stripe("YOUR_STRIPE_PUBLISHABLE_KEY");
    fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart })
    })
    .then(res => res.json())
    .then(session => stripe.redirectToCheckout({ sessionId: session.id }))
    .catch(err => console.error(err));
}

// eSewa Checkout
function checkoutESewa() {
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    const esewaURL = `https://esewa.com.np/epay/main?amt=${totalAmount}&p1=ORDER123&p2=&p3=&scd=MERCHANT_CODE&su=https://yourwebsite.com/success.html&fu=https://yourwebsite.com/cancel.html`;
    window.location.href = esewaURL;
}

// Khalti Checkout
function checkoutKhalti() {
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0) * 100;
    var config = {
        "publicKey": "YOUR_KHALTI_PUBLIC_KEY",
        "productIdentity": "12345",
        "productName": "Danira's Cart",
        "productUrl": "https://yourwebsite.com/cart.html",
        "paymentPreference": ["KHALTI","EBANKING","MOBILE_BANKING","CONNECT_IPS","SCT"],
        "eventHandler": {
            onSuccess(payload) { alert("Payment Successful!"); },
            onError(error) { alert("Payment Failed!"); },
            onClose() { console.log("Khalti widget closed"); }
        }
    };
    var checkout = new KhaltiCheckout(config);
    checkout.show({amount: totalAmount});
}

displayCart();
