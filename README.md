<!-- 
Important commands for packages i installed:
-npm i =>download package manager.
-npm run dev => run the project.
-npm i formik yup react-router-dom @fortawesome/fontawesome-free axios.
-npm install -D tailwindcss@3 postcss autoprefixer.
-npx tailwindcss init -p.
-install the font : npm install @fontsource/encode-sans-expanded.
-install the notifications: npm install react-hot-toast.
-install swiper : npm i swiper.
-install jwt decoder: npm i jwt-decode.
-install react detect offline : npm i react-detect-offline.
-install react helmet: npm i react-helmet.
-instal tanstack: npm i @tanstack/react-query 'used to cache the apis instead of reloading'.




--steps used to build the ecommerce
[1] Routing
[2] building Navbar
[3] building Footer 
[4] Signup
[5] Login
[6] Home page
[7] protect routes and guest routes.
[8] cart.context.jsx==> contains the add product, get cart product(display) , remove specific product, clear cart , update cart product quantity functions and api's
[9] product details page
[10] related categories
[11] checkout page
[12] Orders page
[13] Custom Hooks    
 -->



<!-- 
Api's Usage:
1-customer register api-> signup.jsx , customer login api-> login.jsx
2-vendor register api->vendorSignUp.jsx , vendor login api-> vendorLogin.jsx
3-get all products api-> Home.jsx
4-get product details api-> ProductDetails.jsx
5-get related products api-> ProductDetails.jsx 
6-add product to wishlist api-> Wishlist.jsx
7-get product from wishlist api-> Wishlist.jsx
8-remove product from wishlist api-> Wishlist.jsx
9-Add product to cart api->cart.context.jsx
10-Get product from cart api->Cart.context.jsx
11-remove specific product from cart-> Cart.context.jsx
12-clear cart api-> Cart.context.jsx
13-update cart product quantity api-> Cart.Context.jsx
14-create cash order api->checkout.jsx
15-create online order api->checkout.jsx 'if needed'
16-search products api->ProductSearch.jsx

<-----
Api connecting :
1-vendor:
register✅ , login ✅ , add product ✅ , list products ✅, delete product ✅ , update product ✅ , get all orders details ✅.


2-Admin:Done✅
approve vendor ✅, disapprove vendor ✅ enable vendor ✅ , disable vendor ✅, accept product ✅, reject product ✅, list pending vendors ✅,
auto approve products for specific vendor(ينزل برودكت منغير موافقه الادمن يعني)✅


3-Customer:
register ✅, login ✅, get products in home ✅ , display product details✅,add to savedproducts(wishlist) ✅ ,  display savedproduct ✅, 
delete from savedproduct ✅, add to cart ✅ ,get from cart ✅, delete from cart ✅, checkout✅, display customer orders ✅,search products ✅


 -->


  <!--  -->
