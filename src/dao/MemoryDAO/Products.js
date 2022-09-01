import MemoryContainer from "./MemoryContainer.js";

export default class Products extends MemoryContainer {
    constructor() {
        super();
    }

    validateId = (id) => {
        if(typeof id === 'string'){
            id = parseInt(id)
            return id;
        };
        return id;
    }
};