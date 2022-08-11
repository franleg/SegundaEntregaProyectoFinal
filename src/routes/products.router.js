import { Router } from 'express';
import { uploader } from '../utils.js';
import { ProductManager } from "../managers/productManager.js";

const router = Router();

const productService = new ProductManager();

// Query for admin users => ?user=admin

//---- MIDDLEWARE OF AUTENTICATION ----//
const autentication = (req, res, next) => {
    let user = req.query.user;
    if(user !=="admin") return res.status(401).send({ error : -1, description: `Route ${req.url} method ${req.method} unauthorized.` });
    next();
};

//---- GET ALL PRODUCTS ----//
router.get('/', async(req, res) => {
    let allProducts = await productService.getAllProducts();
    if(allProducts.length === 0) return res.status(200).send({message: 'There are no products in file.'});
    res.status(200).send({"All products": allProducts});
});

//---- GET PRODUCT BY ID ----//
router.get('/:idProduct', async(req, res) => {
    let idProduct = parseInt(req.params.idProduct);
    if(isNaN(idProduct)) return res.status(400).send({error: 'The value must be numeric.'});
    let productFound = await productService.getProductById(idProduct);
    if(!productFound) return res.status(400).send({error: `Product with id ${idProduct} could not be found.`});
    res.status(200).send({"Product": productFound});
});

//---- ADD NEW PRODUCT ----//
router.post('/', autentication, uploader.single('thumbnail'), async(req, res) => {
    let newProduct = req.body;
    if(!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock || !req.file) return res.status(400).send({error: "Name, description, price, stock and thumbnail are required."});
    newProduct.thumbnail = req.file.path;
    if(isNaN(newProduct.price)) return res.status(400).send({error:`Price must be numeric.`});
    if(isNaN(newProduct.stock)) return res.status(400).send({error:`Stock must be numeric.`});
    let productsFile = await productService.getAllProducts();
    let productExist = productsFile.find(prod => prod.name === newProduct.name)
    if(productExist) return res.status(400).send({error: `Product ${newProduct.name} already exist.`});
    let productAdded = await productService.addProduct(newProduct);
    if(!productAdded) return res.status(400).send({error: `Product ${newProduct.name} could not be added.`});
    res.status(200).send({"Product added": productAdded});
});

//---- UPDATE PRODUCT BY ID ----//
router.put('/:idProduct', autentication, uploader.single('thumbnail'), async(req, res) => {
    let idOldProduct = parseInt(req.params.idProduct);
    let newProduct = req.body;
    if(isNaN(idOldProduct)) return res.status(400).send({error: 'The value must be numeric.'});
    let productsFile = await productService.getAllProducts();
    let oldProduct = await productService.getProductById(idOldProduct);
    if(!oldProduct) return res.status(400).send({error: `Product with id ${idOldProduct} could not be found.`});
    if(!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock || !req.file) return res.status(400).send({error: "Name, price, description, stock and thumbnail are required."});
    newProduct.thumbnail = req.file.path;
    if(isNaN(newProduct.price)) return res.status(400).send({error:`Price must be numeric.`});
    if(isNaN(newProduct.stock)) return res.status(400).send({error:`Stock must be numeric.`});
    let productExist = productsFile.find(prod => prod.name == newProduct.name);
    if(productExist) return res.status(400).send({error: `Product ${newProduct.name} already exist.`});
    let productUpdated = await productService.updateProduct(newProduct, oldProduct);
    if(!productUpdated) return res.status(400).send({error: `Product with id ${idOldProduct} could not be replaced.`});
    res.status(200).send({"Product replaced": oldProduct, "New Product": productUpdated});
});

//---- DELETE PRODUCT BY ID ----//
router.delete('/:idProduct', autentication, async(req, res)=>{
    let idProduct = parseInt(req.params.idProduct);
    if(isNaN(idProduct)) return res.status(400).send({error: 'The value must be numeric.'});
    let productToRemove = await productService.getProductById(idProduct);
    if(!productToRemove) return res.status(400).send({error: `Product with id ${idProduct} could not be found.`});
    let productRemoved = await productService.deleteProductById(idProduct);
    if(!productRemoved) return res.status(400).send({error: `Product with id ${idProduct} could not be removed.`});
    res.status(200).send({"Product removed": productRemoved});
});

export default router;  
