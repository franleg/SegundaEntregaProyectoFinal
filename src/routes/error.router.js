import { Router } from 'express';

const router = Router();

router.get('/*', (req,res)=>{
    res.status(500).send({error: -2, description: `Route ${req.url} method ${req.method} not implemented.`});
});

router.post('/*', (req,res)=>{
    res.status(500).send({error: -2, description: `Route ${req.url} method ${req.method} not implemented.`});
});

router.put('/*', (req,res)=>{
    res.status(500).send({error: -2, description: `Route ${req.url} method ${req.method} not implemented.`});
});

router.delete('/*', (req,res)=>{
    res.status(500).send({error: -2, description: `Route ${req.url} method ${req.method} not implemented.`});
});

export default router;