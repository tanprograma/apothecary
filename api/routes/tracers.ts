import express from 'express';
import { getTracers, createTracer } from '../controllers/tracer-controller';

const router = express.Router();

router.get('/', getTracers);
router.post('/', createTracer);

export default router;
//     amount: amount + item.price * item.quantity,
//     quantity: quantity + item.quantity,
//   };
// } // Compare this snippet from api/controllers/tracerController.ts:
// import { Request, Response } from 'express';
// import { TracerModel } from '../models/tracers';
// export const getTracers = async (req: Request, res: Response) => {
//   try {
//     const tracers = await TracerModel.find();
//     res.status(200).json(tracers);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
