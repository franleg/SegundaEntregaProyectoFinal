import FileSystemContainer from "./FileSystemContainer.js";

export default class Carts extends FileSystemContainer{
    constructor() {
        super('carts');
    }
    validateId = (id) => {
        if(typeof id === 'string'){
            id = parseInt(id)
            return id;
        };
        return id;
    }
}