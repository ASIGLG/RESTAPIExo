import { Router } from 'express'
import { echo } from './controller'

const router = Router()

router.post('/', echo)

export default router
