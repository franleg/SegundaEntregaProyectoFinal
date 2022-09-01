const persistence = "MEMORY";

let productsService;
let cartsService;

switch (persistence) {
    case "MEMORY":
        const { default:MemProduct } = await import('./MemoryDAO/Products.js');
        productsService = new MemProduct();
        const { default:MemCart } = await import('./MemoryDAO/Carts.js');
        cartsService = new MemCart();
        break;
    
    case "FILESYSTEM":
        const { default:FileProduct } = await import('./FileSystemDAO/Products.js');
        productsService = new FileProduct();
        const { default:FileCart } = await import('./FileSystemDAO/Carts.js');
        cartsService = new FileCart();
        break;

    case "MONGODB":
        const { default: MongoProduct } = await import('./MongoDbDAO/Products.js');
        productsService = new MongoProduct();
        const { default:MongoCart } = await import('./MongoDbDAO/Carts.js');
        cartsService = new MongoCart();
        break;
}

const services = {
    productsService,
    cartsService
}

export default services;