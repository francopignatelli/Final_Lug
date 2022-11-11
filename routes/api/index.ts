import { Router, Request, Response } from 'express'
import cartRouter from './cart'
import itemRouter from './item'

const router = Router(); //Inicializa el Router

router.use('/cart', cartRouter)

router.use('/item', itemRouter)

export default router