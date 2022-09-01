export default class MemoryContainer {
    constructor () {
        this.data = [];
    }

    getAll = () => {
        return this.data;
    }

    getById = (id) => {
        const data = this.getAll();
        let element = data.find(el => el.id === id);
        return element;
    }

    save = (element) => {
        const data = this.getAll();
        if(data.length === 0){
            element.id = 1;
        }else{
            element.id = data[data.length-1].id + 1;
        }
        data.push(element);
        return element;
    }

    update = (oldElement, newElement) => {
        const data = this.getAll();
        let elementToReplace = data.find(el => el.id == oldElement.id)
        let elementIndex = data.indexOf(elementToReplace);
        if(newElement){
            data[elementIndex] = newElement;
            newElement.id = oldElement.id;
            return newElement;
        }
        data[elementIndex] = oldElement;
        return oldElement;
    }

    deleteById = (id) =>{
        const data = this.getAll();
        let element = data.find(el => el.id == id);
        let elementIndex = data.indexOf(element);
        data.splice(elementIndex, 1);
        return element;
    }
}