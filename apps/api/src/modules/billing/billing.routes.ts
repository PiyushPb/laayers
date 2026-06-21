import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { requireWorkspace, requireRole } from '../../middlewares/workspace';
import { asyncHandler } from '../../utils/asyncHandler';
import {
  getSubscription, updateSubscription, cancelSubscription, resumeSubscription, changePlan,
  getUsage, listInvoices, getInvoice, listPaymentMethods, addPaymentMethod, deletePaymentMethod,
  createCheckout, createCustomerPortal, handleWebhook, getHistory
} from './billing.controller';

const router: Router = Router({ mergeParams: true });

// Public Webhooks
router.post('/webhooks', asyncHandler(handleWebhook));

// All other routes require auth and workspace scope
router.use(requireAuth);
// To apply workspace middleware globally on billing, the client must pass workspaceId in headers or query,
// or we mount it under /workspaces/:workspaceId/billing. 
// Assuming it's mounted under /api/v1/workspaces/:workspaceId/billing in index.ts.

router.get('/subscription', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(getSubscription));
router.patch('/subscription', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(updateSubscription));
router.post('/subscription/cancel', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(cancelSubscription));
router.post('/subscription/resume', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(resumeSubscription));
router.post('/subscription/change-plan', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(changePlan));

router.get('/usage', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(getUsage));
router.get('/invoices', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(listInvoices));
router.get('/invoices/:invoiceId', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(getInvoice));

router.get('/payment-methods', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(listPaymentMethods));
router.post('/payment-methods', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(addPaymentMethod));
router.delete('/payment-methods/:id', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(deletePaymentMethod));

router.post('/checkout', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(createCheckout));
router.post('/customer-portal', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(createCustomerPortal));

router.get('/history', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(getHistory));

export default router;
