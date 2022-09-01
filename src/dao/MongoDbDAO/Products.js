import mongoose from 'mongoose';
import MongoDbContainer from './MongoDbContainer.js';

const collection = 'products';

const productsSquema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    thumbnail: String,
    stock: Number,
    timestamp: String,
    code: String,
})

export default class Products extends MongoDbContainer{
    constructor() {
        super(collection, productsSquema);
    }
    validateId = (id) => {
        if(typeof id === 'number'){
            id = String(id)
            return id;
        };
        return id;
    }
}