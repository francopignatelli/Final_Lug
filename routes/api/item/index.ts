import { Router, Request, Response } from "express";
import ItemController from "../../../controllers/item"

const router = Router()

router.get('/', ItemController.getItems)

router.post('/create-item', ItemController.createItem)

router.put('/mod-item/:itemId', ItemController.modItem)

router.delete('/delete-item/:itemId', ItemController.delItem)

export default router