import mongoose from 'mongoose';
import MongoDbContainer from './MongoDbContainer.js';

const collection = 'carts';

const cartsSquema = mongoose.Schema({
    timestamp: String,
    products: Array,
})

export default class Carts extends MongoDbContainer{
    constructor() {
        super(collection, cartsSquema);
    }
    validateId = (id) => {
        if(typeof id === 'number'){
            id = String(id)
            return id;
        };
        return id;
    }
}
