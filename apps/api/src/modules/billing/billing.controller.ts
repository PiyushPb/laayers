import { Request, Response } from 'express';
import { db, workspaceSubscriptions, auditLogs } from '@layers/database';
import { eq, and } from 'drizzle-orm';
import { sendSuccess, NotFoundError } from '@layers/shared';

// For multi-cluster support, assume clusterId is passed in headers or body if not default
const getClusterId = (req: Request) => req.headers['x-cluster-id'] as string || 'default';

export const getSubscription = async (req: Request, res: Response) => {
  const clusterId = getClusterId(req);
  const [subscription] = await db
    .select()
    .from(workspaceSubscriptions)
    .where(
      and(
        eq(workspaceSubscriptions.workspaceId, req.workspace.id),
        eq(workspaceSubscriptions.clusterId, clusterId)
      )
    )
    .limit(1);

  if (!subscription) {
    // Return a default free tier if not found
    return res.status(200).json(sendSuccess({
      subscription: {
        planId: 'free',
        status: 'active',
        clusterId,
      }
    }));
  }

  res.status(200).json(sendSuccess({ subscription }));
};

export const updateSubscription = async (req: Request, res: Response) => {
  // E.g., updating tax id, billing email
  res.status(200).json(sendSuccess(null, 'Subscription updated (stub)'));
};

export const cancelSubscription = async (req: Request, res: Response) => {
  const clusterId = getClusterId(req);
  const [sub] = await db
    .update(workspaceSubscriptions)
    .set({ cancelAtPeriodEnd: true })
    .where(
      and(
        eq(workspaceSubscriptions.workspaceId, req.workspace.id),
        eq(workspaceSubscriptions.clusterId, clusterId)
      )
    )
    .returning();

  await db.insert(auditLogs).values({
    workspaceId: req.workspace.id,
    actorType: 'user',
    userId: req.user.id,
    action: 'billing.subscription.cancelled',
    entityType: 'subscription',
    entityId: sub?.id || 'none',
    newValue: { cancelAtPeriodEnd: true },
  });

  res.status(200).json(sendSuccess({ subscription: sub }, 'Subscription set to cancel at period end'));
};

export const resumeSubscription = async (req: Request, res: Response) => {
  const clusterId = getClusterId(req);
  const [sub] = await db
    .update(workspaceSubscriptions)
    .set({ cancelAtPeriodEnd: false })
    .where(
      and(
        eq(workspaceSubscriptions.workspaceId, req.workspace.id),
        eq(workspaceSubscriptions.clusterId, clusterId)
      )
    )
    .returning();

  res.status(200).json(sendSuccess({ subscription: sub }, 'Subscription resumed'));
};

export const changePlan = async (req: Request, res: Response) => {
  const { planId } = req.body;
  const clusterId = getClusterId(req);

  const [existing] = await db.select().from(workspaceSubscriptions)
    .where(and(eq(workspaceSubscriptions.workspaceId, req.workspace.id), eq(workspaceSubscriptions.clusterId, clusterId)));

  let sub;
  if (!existing) {
    [sub] = await db.insert(workspaceSubscriptions).values({
      workspaceId: req.workspace.id,
      clusterId,
      planId,
      status: 'active'
    }).returning();
  } else {
    [sub] = await db.update(workspaceSubscriptions).set({ planId })
      .where(eq(workspaceSubscriptions.id, existing.id)).returning();
  }

  await db.insert(auditLogs).values({
    workspaceId: req.workspace.id,
    actorType: 'user',
    userId: req.user.id,
    action: 'billing.subscription.plan_changed',
    entityType: 'subscription',
    entityId: sub.id,
    newValue: { planId },
  });

  res.status(200).json(sendSuccess({ subscription: sub }, 'Plan changed successfully'));
};

export const getUsage = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ usage: {} }, 'Usage retrieved (stub)'));
};

export const listInvoices = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ invoices: [] }));
};

export const getInvoice = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ invoice: {} }));
};

export const listPaymentMethods = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ paymentMethods: [] }));
};

export const addPaymentMethod = async (req: Request, res: Response) => {
  res.status(201).json(sendSuccess({ paymentMethod: {} }));
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess(null));
};

export const createCheckout = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ url: 'https://checkout.stripe.com/stub' }));
};

export const createCustomerPortal = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ url: 'https://billing.stripe.com/stub' }));
};

export const handleWebhook = async (req: Request, res: Response) => {
  // Idempotency and provider verification happens here
  res.status(200).json({ received: true });
};

export const getHistory = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ history: [] }));
};
