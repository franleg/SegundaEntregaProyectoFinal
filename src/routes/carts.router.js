import { Router } from 'express';
import moment from 'moment';
import services from '../dao/config.js';

const router = Router();

//---- GET PRODUCTS IN CART BY ID ----//
router.get('/:idCart/products', async(req, res) => {
    let idCart = req.params.idCart;
    idCart = await services.cartsService.validateId(idCart);
    let cart = await services.cartsService.getById(idCart);
    if(!cart) return res.status(400).send({error: `Cart not found.`});
    let productsInCart = cart.products;
    if(productsInCart.length === 0) return res.status(200).send({message:`Cart with id ${idCart} is empty.`});
    res.status(200).send({'Products in cart': productsInCart});
});

//---- ADD NEW CART ----//
router.post('/', async(req, res) => {
    let newCart = {};
    newCart.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
    newCart.products = [];
    await services.cartsService.save(newCart);
    res.status(200).send({'message': 'New cart created.'});
});

//---- ADD PRODUCT IN CART BY ID ----//
router.post('/:idCart', async(req, res) => {
    let idCart = req.params.idCart;
    idCart = await services.cartsService.validateId(idCart);
    let cart = await services.cartsService.getById(idCart);
    if(!cart) return res.status(400).send({error: `Cart not found.`});
    let newProd = req.body;
    if(!newProd.productId || !newProd.quantity) return res.status(400).send({error: "Product id and quantity are required."});
    newProd.productId = await services.cartsService.validateId(newProd.productId);
    if(isNaN(newProd.quantity)) return res.status(400).send({error: `Quantity must be numeric.`});
    let productInStock = await services.productsService.getById(newProd.productId);
    if(!productInStock) return res.status(400).send({error: `Product not found.`});
    if(newProd.quantity <= 0) return res.status(400).send({error: `Quantity must be major than 0.`});
    if(newProd.quantity > productInStock.stock) return res.status(400).send({error: 'Not enough stock of this product.'});
    let productInCart = cart.products.find(prod => prod.productId === newProd.productId);
    if(productInCart){
        productInCart.quantity += newProd.quantity;
    }else{
        newProd.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
        cart.products.push(newProd);
    }
    productInStock.stock -= newProd.quantity;
    await services.cartsService.update(cart);
    await services.productsService.update(productInStock);
    res.status(200).send({'Product added in cart': newProd});
});

//---- DELETE CART ----//
router.delete('/:idCart', async(req, res)=>{
    let idCart = req.params.idCart;
    idCart = await services.cartsService.validateId(idCart);
    let cartRemoved = await services.cartsService.deleteById(idCart);
    if(!cartRemoved) return res.status(400).send({error: `Cart not found.`});
    res.status(200).send({'message': 'Cart removed.'});
});

//---- DELETE PRODUCT IN CART BY ID ----//
router.delete('/:idCart/products/:idProduct', async(req, res)=>{
    let idCart = req.params.idCart;
    idCart = await services.cartsService.validateId(idCart);
    let idProduct = req.params.idProduct;
    idProduct = await services.cartsService.validateId(idProduct);
    let cart = await services.cartsService.getById(idCart);
    if(!cart) return res.status(400).send({error: `Cart not found.`});
    if(cart.products.length === 0) return res.status(404).send({error:`There are no products to remove from cart with id ${idCart}.`});
    let productToRemove = cart.products.find(prod => prod.productId === idProduct);
    if(!productToRemove) return res.status(400).send({error: `Product not found in cart.`});
    let productIndex = cart.products.indexOf(productToRemove);
    cart.products.splice(productIndex, 1); 
    await services.cartsService.update(cart);
    res.status(200).send({"Product removed from cart": productToRemove});
});

export default router;