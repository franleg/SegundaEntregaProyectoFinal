import FileSystemContainer from "./FileSystemContainer.js";

export default class Products extends FileSystemContainer{
    constructor() {
        super('products');
    }
    validateId = (id) => {
        if(typeof id === 'string'){
            id = parseInt(id)
            return id;
        };
        return id;
    }
}