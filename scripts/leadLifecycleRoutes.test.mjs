import assert from 'node:assert/strict';
import {
  PAYMENT_PLANS,
  FINANCING_STATUSES,
  DOCUMENT_KEYS,
  computeLeadStageFromLifecycle,
  isLeadUnitSoldDisplay,
} from '../server/routes/leadRoutes.js';

const allDocs = {
  nationalId: true,
  depositReceipt: true,
  financingProof: true,
  allocationForm: true,
};

const missingDoc = {
  nationalId: true,
  depositReceipt: false,
  financingProof: true,
  allocationForm: true,
};

// 1. Constants check
assert.deepEqual(PAYMENT_PLANS, ['full', 'depositbank', 'depositclient', 'bankonly']);
assert.equal(FINANCING_STATUSES.includes('approved'), true);
assert.equal(DOCUMENT_KEYS.length, 4);

// 2. Server-side stage computation (never trusts client stage)
assert.equal(computeLeadStageFromLifecycle({ stage: 'closed', paymentPlan: null, amountPaid: 0, financingStatus: 'not_started', documents: {} }), 'prospective');

for (const plan of PAYMENT_PLANS) {
  assert.equal(
    computeLeadStageFromLifecycle({ paymentPlan: plan, amountPaid: 0, financingStatus: 'not_started', documents: missingDoc }),
    'reserved'
  );
}

// 3. Stage becomes closed only when docs complete + payment/financing ready
assert.equal(
  computeLeadStageFromLifecycle({ paymentPlan: 'full', amountPaid: 50000, financingStatus: 'not_started', documents: allDocs }),
  'closed'
);
assert.equal(
  computeLeadStageFromLifecycle({ paymentPlan: 'depositbank', amountPaid: 25000, financingStatus: 'approved', documents: allDocs }),
  'closed'
);
assert.equal(
  computeLeadStageFromLifecycle({ paymentPlan: 'depositclient', amountPaid: 25000, financingStatus: 'pending', documents: allDocs }),
  'reserved'
);
assert.equal(
  computeLeadStageFromLifecycle({ paymentPlan: 'bankonly', amountPaid: 0, financingStatus: 'approved', documents: missingDoc }),
  'reserved'
);

// 4. Display-only sold flag (requires closed + all 4 docs + preparing_unit/delivered)
assert.equal(isLeadUnitSoldDisplay({ stage: 'closed', documents: allDocs, handover: { status: 'preparing_unit' } }), true);
assert.equal(isLeadUnitSoldDisplay({ stage: 'closed', documents: allDocs, handover: { status: 'delivered' } }), true);
assert.equal(isLeadUnitSoldDisplay({ stage: 'closed', documents: allDocs, handover: { status: 'pending_deed' } }), false);
assert.equal(isLeadUnitSoldDisplay({ stage: 'closed', documents: missingDoc, handover: { status: 'delivered' } }), false);
assert.equal(isLeadUnitSoldDisplay({ stage: 'reserved', documents: allDocs, handover: { status: 'delivered' } }), false);

console.log('ALL_LEAD_LIFECYCLE_ROUTE_TESTS_PASSED');
