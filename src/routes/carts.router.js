import { Router } from 'express';
import { CartManager } from "../managers/cartManager.js";
import { ProductManager } from "../managers/productManager.js";

const router = Router();

const cartService = new CartManager();

const productService = new ProductManager();

//---- GET PRODUCTS IN CART BY ID ----//
router.get('/:idCart/products', async(req, res) => {
    let idCart = parseInt(req.params.idCart);
    if(isNaN(idCart)) return res.status(400).send({error: 'The value must be numeric.'});
    let cart = await cartService.getCartById(idCart);
    if(!cart) return res.status(400).send({error: `Cart with id ${idCart} could not be found.`});
    if(cart.products.length === 0) return res.status(200).send({message:`Cart with id ${idCart} is empty.`});
    let productsInCart = await cartService.getProductsInCart(idCart);
    res.status(200).send({"Products in cart": productsInCart});
});

//---- ADD NEW CART ----//
router.post('/', async(req, res) => {
    let cartAdded = await cartService.addCart();
    res.status(200).send({"New cart added": `Cart with id ${cartAdded.id} has been created.`});
});

//---- ADD PRODUCT IN CART BY ID ----//
router.post('/:idCart', async(req, res) => {
    let idCart = parseInt(req.params.idCart);
    let productToAdd = req.body;
    if(isNaN(idCart)) return res.status(400).send({error: 'The value must be numeric.'});
    let cart = await cartService.getCartById(idCart);
    if(!cart) return res.status(400).send({error: `Cart with id ${idCart} could not be found.`});
    if(!productToAdd.productId || !productToAdd.quantity) return res.status(400).send({error: "Product id and quantity are required."});
    if(isNaN(productToAdd.productId)) return res.status(400).send({error: `Id must be numeric.`});
    if(isNaN(productToAdd.quantity)) return res.status(400).send({error: `Quantity must be numeric.`});
    let productInStock = await productService.getProductById(productToAdd.productId);
    if(!productInStock) return res.status(400).send({error: `Product with id ${productToAdd.productId} could not be found.`});
    if(productToAdd.quantity <= 0) return res.status(400).send({error: `Quantity must be major than 0.`});
    if(productToAdd.quantity > productInStock.stock) return res.status(400).send({error: 'Not enough stock of this product.'});
    let productAdded = await cartService.addProductInCart(idCart, productToAdd);
    res.status(200).send({"Product added in cart": productAdded});
});

//---- DELETE CART ----//
router.delete('/:idCart', async(req, res)=>{
    let idCart = parseInt(req.params.idCart);
    if(isNaN(idCart)) return res.status(400).send({error: 'The value must be numeric.'});
    let cartRemoved = await cartService.deleteCartById(idCart);
    if(!cartRemoved) return res.status(400).send({error: `Cart with id ${idCart} could not be found.`});
    res.status(200).send({"Cart removed": `Cart with id ${cartRemoved.id} has been removed.`});
});

//---- DELETE PRODUCT IN CART BY ID ----//
router.delete('/:idCart/products/:idProduct', async(req, res)=>{
    let idCart = parseInt(req.params.idCart);
    let idProduct = parseInt(req.params.idProduct);
    if(isNaN(idCart) || isNaN(idProduct)) return res.status(400).send({error: 'The values must be numeric.'});
    let cart = await cartService.getCartById(idCart);
    if(!cart) return res.status(400).send({error: `Cart with id ${idCart} could not be found.`});
    if(cart.products.length === 0) return res.status(404).send({error:`There are no products to remove from cart with id ${idCart}.`});
    let productRemoved = await cartService.deleteProductInCart(idCart, idProduct);
    if(!productRemoved) return res.status(400).send({error: `Product with id ${idProduct} could not be found in cart with id ${idCart}.`});
    res.status(200).send({"Product removed from cart": productRemoved});
});

export default router;