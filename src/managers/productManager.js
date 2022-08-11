import fs from 'fs';
import { __dirname } from '../utils.js';
import moment from 'moment';

class ProductManager {
    constructor(){
        this.path = __dirname + '/files/products.json';
    }
 
    getAllProducts = async() => {
        try{
            if(fs.existsSync(this.path)){
                let fileData = await fs.promises.readFile(this.path,'utf-8');
                let products = JSON.parse(fileData);
                return products;  
            }else{
                return [];
            }
 
        }catch(error){
            console.log("Error: " + error);
        }
    }

    getProductById = async (idProd) =>{
        try{
            const fileData = await this.getAllProducts();
            let product = fileData.find(prod => prod.id === idProd);
            return product;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    addProduct = async(newProd) => {
        try{
            let fileData = await this.getAllProducts();
            if(fileData.length === 0){
                newProd.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'));
                newProd.code = Math.random().toString(35).substring(3);
                newProd.id = 1;
                fileData.push(newProd);
                await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
                return newProd
            }else{
                newProd.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'))
                newProd.code = Math.random().toString(35).substring(3);
                newProd.id = fileData[fileData.length-1].id + 1;
                fileData.push(newProd);
                await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
                return newProd
            }
            
        }catch(error){
            console.log("Error: " + error);
        }
    }

    updateProduct = async(newProd, oldProd) => {
        try{
            let fileData = await this.getAllProducts();
            let productToReplace = fileData.find(prod => prod.id == oldProd.id)
            let productIndex = fileData.indexOf(productToReplace);
            fileData[productIndex] = newProd;
            newProd.timestamp = moment().format(('DD/MM/YYYY hh:mm:ss'))
            newProd.code = Math.random().toString(35).substring(3);
            newProd.id = oldProd.id;
            await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
            return newProd;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    deleteProductById = async (idProd) =>{
        try {
            const fileData = await this.getAllProducts();
            let product = fileData.find(prod => prod.id == idProd);
            let productIndex = fileData.indexOf(product);
            fileData.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
            return product;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    deleteAll = async () =>{
        try{
            let fileData = await this.getAllProducts();
            fileData = []
            await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));

        }catch(error){
            console.log("Error: " + error);
        }
    }
}

export {ProductManager};