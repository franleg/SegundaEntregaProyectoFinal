import { Router } from 'express';
import { uploader } from '../utils.js';
import moment from 'moment';
import services from '../dao/config.js';

const router = Router();

// Query for admin users => ?user=admin

//---- MIDDLEWARE OF AUTENTICATION ----//
const autentication = (req, res, next) => {
    let user = req.query.user;
    if(user !=="admin") return res.status(401).send({ error : -1, description: `Route ${req.url} method ${req.method} unauthorized.` });
    next();
};

//---- GET ALL PRODUCTS ----//
router.get('/', async(req, res) => {
    let allProducts = await services.productsService.getAll();
    if(allProducts.length === 0) return res.status(200).send({message: 'There are no products.'});
    res.status(200).send({"All products": allProducts});
});

//---- GET PRODUCT BY ID ----//
router.get('/:idProduct', async(req, res) => {
    let idProduct = req.params.idProduct;
    idProduct = await services.productsService.validateId(idProduct);
    let productFound = await services.productsService.getById(idProduct);
    if(!productFound) return res.status(400).send({error: `Product not found.`});
    res.status(200).send({"Product found": productFound});
});

//---- ADD NEW PRODUCT ----//
router.post('/', autentication, uploader.single('thumbnail'), async(req, res) => {
    let newProduct = req.body;
    if(!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock || !req.file) return res.status(400).send({error: "Name, description, price, stock and thumbnail are required."});
    if(isNaN(newProduct.price)) return res.status(400).send({error:`Price must be numeric.`});
    if(isNaN(newProduct.stock)) return res.status(400).send({error:`Stock must be numeric.`});
    let allProducts = await services.productsService.getAll();
    let productExist = allProducts.find(prod => prod.name === newProduct.name)
    if(productExist) return res.status(400).send({error: `Product ${newProduct.name} already exist.`});
    newProduct.thumbnail = req.file.path;
    newProduct.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
    newProduct.code = Math.random().toString(35).substring(3);
    let productAdded = await services.productsService.save(newProduct);
    res.status(200).send({"Product added": productAdded});
});

//---- UPDATE PRODUCT BY ID ----//
router.put('/:idProduct', autentication, uploader.single('thumbnail'), async(req, res) => {
    let idOldProduct = req.params.idProduct;
    idOldProduct = await services.productsService.validateId(idOldProduct);
    let newProduct = req.body;
    let allProducts = await services.productsService.getAll();
    let oldProduct = await services.productsService.getById(idOldProduct);
    if(!oldProduct) return res.status(400).send({error: `Product not found.`});
    if(!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock || !req.file) return res.status(400).send({error: "Name, price, description, stock and thumbnail are required."});
    if(isNaN(newProduct.price)) return res.status(400).send({error:`Price must be numeric.`});
    if(isNaN(newProduct.stock)) return res.status(400).send({error:`Stock must be numeric.`});
    let productExist = allProducts.find(prod => prod.name == newProduct.name);
    if(productExist) return res.status(400).send({error: `Product ${newProduct.name} already exist.`});
    newProduct.thumbnail = req.file.path;
    newProduct.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'))
    newProduct.code = Math.random().toString(35).substring(3);
    let productUpdated = await services.productsService.update(oldProduct, newProduct);
    res.status(200).send({"Product replaced": oldProduct, "New Product": productUpdated});
});

//---- DELETE PRODUCT BY ID ----//
router.delete('/:idProduct', autentication, async(req, res)=>{
    let idProduct = req.params.idProduct;
    idProduct = await services.productsService.validateId(idProduct);
    let productToRemove = await services.productsService.getById(idProduct);
    if(!productToRemove) return res.status(400).send({error: `Product not found.`});
    let productRemoved = await services.productsService.deleteById(idProduct);
    res.status(200).send({"Product removed": productRemoved});
});

export default router;  
