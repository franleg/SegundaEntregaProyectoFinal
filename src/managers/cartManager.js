import fs from 'fs';
import { __dirname } from '../utils.js';
import moment from 'moment';
import { ProductManager } from "../managers/productManager.js";

const productService = new ProductManager();

class CartManager {
    constructor(){
        this.path = __dirname + '/files/carts.json';
    }

    getAllCarts = async() => {
        try{
            if(fs.existsSync(this.path)){
                let cartsFile = await fs.promises.readFile(this.path,'utf-8');
                let carts = JSON.parse(cartsFile);
                return carts;  
            }else{
                return [];
            }
 
        }catch(error){
            console.log("Error: " + error);
        }
    }

    getCartById = async(idCart) => {
        try{
            const cartsFile = await this.getAllCarts();
            let cart = cartsFile.find(cart => cart.id === idCart);
            return cart;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    addCart = async() => {
        try{
            const cartsFile = await this.getAllCarts();
            let newCart = {};
            if(cartsFile.length === 0){
                newCart.id = 1;
                newCart.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
                newCart.products = [];
                cartsFile.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(cartsFile, null, '\t'));
                return newCart;
            }else{
                newCart.id = cartsFile[cartsFile.length-1].id + 1;
                newCart.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
                newCart.products = [];
                cartsFile.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(cartsFile, null, '\t'));
                return newCart;
            }

        }catch(error){
            console.log("Error: " + error);
        }
    }

    deleteCartById = async (idCart) =>{
        try {
            const cartsFile = await this.getAllCarts();
            let cart = cartsFile.find(cart => cart.id === idCart);
            cart.products = [];
            let cartIndex = cartsFile.indexOf(cart);
            cartsFile.splice(cartIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile, null, '\t'));
            return cart;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    getProductsInCart = async(idCart) => {
        try {
            const cartsFile = await this.getAllCarts();
            let cart = cartsFile.find(cart => cart.id === idCart);
            let productsInCart = cart.products;
            return productsInCart;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    addProductInCart = async(idCart, productAdded) => {
        try {
            const cartsFile = await this.getAllCarts();
            const productsFile = await productService.getAllProducts();
            let cart = cartsFile.find(cart => cart.id === idCart);
            let productInCart = cart.products.find(prod => prod.productId === productAdded.productId);
            if(productInCart){
                productInCart.quantity += productAdded.quantity;
            }else{
                productAdded.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
                cart.products.push(productAdded);
            }
            let product = productsFile.find(prod => prod.id === productAdded.productId);
            product.stock -= productAdded.quantity;
            await fs.promises.writeFile(__dirname + '/files/products.json', JSON.stringify(productsFile, null, '\t'));
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile, null, '\t'));
            return productAdded;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    deleteProductInCart = async(idCart, idProd) => {
        try {
            const cartsFile = await this.getAllCarts();
            let cart = cartsFile.find(cart => cart.id === idCart);
            let product = cart.products.find(prod => prod.productId === idProd);
            let productIndex = cart.products.indexOf(product);
            cart.products.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile, null, '\t'));
            return product;

        }catch(error){
            console.log("Error: " + error);
        }
    }
}

export {CartManager};