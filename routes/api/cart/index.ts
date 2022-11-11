import { Router, Request, Response } from "express";
import cartController from "../../../controllers/cart"

const router = Router()

router.get('/', cartController.getCarts)

router.post('/create-cart', cartController.createCart)

router.post('/add-item/:cartId', cartController.addItemtoCart)

router.delete('/delete-item/:cartId', cartController.deleteItemfromCart)

router.delete('/delete-cart/:cartId', cartController.delCart)

export default router