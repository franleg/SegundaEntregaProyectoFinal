import fs from 'fs';
import { __dirname } from '../../utils.js';

export default class FileSystemContainer {
    constructor (element) {
        this.path = __dirname + `/files/${element}.json`;
    }

    getAll = async() => {
        try{
            if(fs.existsSync(this.path)){
                const fileData = await fs.promises.readFile(this.path,'utf-8');
                let data = JSON.parse(fileData);
                return data;  
            }else{
                return [];
            }
 
        }catch(error){
            console.log("Error: " + error);
        }
    }

    getById = async(id) => {
        try{
            const fileData = await this.getAll();
            let element = fileData.find(el => el.id === id);
            return element;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    save = async(element) => {
        try {
            const fileData = await this.getAll();
            if(fileData.length === 0){
                element.id = 1;
            }else{
                element.id = fileData[fileData.length-1].id + 1;
            }
            fileData.push(element)
            await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
            return element;

        }catch(error){
            console.log("Error: " + error);
        }
    }

    update = async(oldElement, newElement) => {
        try{
            const fileData = await this.getAll();
            let elementToUpdate = fileData.find(el => el.id == oldElement.id);
            let elementIndex = fileData.indexOf(elementToUpdate);
            if(newElement){
                fileData[elementIndex] = newElement;
                newElement.id = oldElement.id;
                await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
                return newElement;
            }
            fileData[elementIndex] = oldElement;
            await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
            return oldElement;

        }catch(error){
            console.log("Error: " + error);
        }   
    }

    deleteById = async(id) =>{
        try {
            const fileData = await this.getAll();
            let element = fileData.find(el => el.id == id);
            let elementIndex = fileData.indexOf(element);
            fileData.splice(elementIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(fileData, null, '\t'));
            return element;

        }catch(error){
            console.log("Error: " + error);
        }  
    }
}