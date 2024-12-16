import express from 'express';
import {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  makeTransaction,
  getTransactionsForEnvelope
} from '../controllers/envelopes.controller.js';  

const envelopesRouter = express.Router();

envelopesRouter.get('/', async (req, res, next) => {
  try {
    await getAllEnvelopes(req, res);
  } catch (error) {
    next(error); 
  }
});

envelopesRouter.get('/:id', async (req, res, next) => {
  try {
    const envelope = await getEnvelopeById(req.params.id);
    res.json(envelope);
  } catch (error) {
    next(error);
  }
});

envelopesRouter.get('/:id/transactions', async (req, res, next) => {
  try {
    const transactions = await getTransactionsForEnvelope(req.params.id);
    res.json({ transactions });
  } catch (error) {
    next(error); 
  }
});

envelopesRouter.post('/', async (req, res, next) => {
  try {
    const newEnvelope = await createEnvelope(req, res);  
    res.json(newEnvelope);
  } catch (error) {
    next(error);
  }
});

envelopesRouter.post('/:id/transactions', async (req, res, next) => {
  try {
    const newTransaction = await makeTransaction(req, res); 
    res.json(newTransaction);
  } catch (error) {
    next(error);
  }
});

export { envelopesRouter };
