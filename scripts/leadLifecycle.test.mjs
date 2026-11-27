import assert from 'node:assert/strict';
import {
  LIFECYCLE_STAGES,
  arePapersComplete,
  isUnitSold,
  getLeadStage,
  getFinancingBadge,
  getDepositBadge,
  groupLeadsByStage,
} from '../src/utils/leadLifecycle.js';

const fullPapers = {
  nationalId: true,
  financingApproval: true,
  depositReceipt: true,
  allocationForm: true,
};

const partialPapers = {
  nationalId: true,
  financingApproval: true,
  depositReceipt: false,
  allocationForm: true,
};

// 1. Stage list & normalization
assert.equal(LIFECYCLE_STAGES.length, 3);
assert.equal(getLeadStage({ stage: 'unknown' }), 'inquiry_recorded');
assert.equal(getLeadStage({ stage: 'reservation' }), 'reservation');
assert.equal(getLeadStage({ stage: 'closing' }), 'closing');

// 2. Papers completeness
assert.equal(arePapersComplete({ papers: fullPapers }), true);
assert.equal(arePapersComplete({ papers: partialPapers }), false);
assert.equal(arePapersComplete({}), false);

// 3. Sold rule: ONLY closing + papers complete + (inspection or handover)
assert.equal(isUnitSold({ stage: 'inquiry_recorded', subStatus: 'inspection', papers: fullPapers }), false);
assert.equal(isUnitSold({ stage: 'reservation', subStatus: 'handover', papers: fullPapers }), false);
assert.equal(isUnitSold({ stage: 'closing', subStatus: 'papers_review', papers: fullPapers }), false);
assert.equal(isUnitSold({ stage: 'closing', subStatus: 'inspection', papers: partialPapers }), false);
assert.equal(isUnitSold({ stage: 'closing', subStatus: 'inspection', papers: fullPapers }), true);
assert.equal(isUnitSold({ stage: 'closing', subStatus: 'handover', papers: fullPapers }), true);

// 4. Badges & grouping
assert.equal(getFinancingBadge({ financingIndependent: true, financingApproved: true }).tone, 'emerald');
assert.equal(getDepositBadge({ depositPaid: true, depositAmount: 25000 }).tone, 'emerald');
assert.equal(getDepositBadge({ depositPaid: false }).tone, 'rose');

const grouped = groupLeadsByStage([
  { id: '1', stage: 'inquiry_recorded' },
  { id: '2', stage: 'reservation' },
  { id: '3', stage: 'closing' },
]);
assert.equal(grouped.inquiry_recorded.length, 1);
assert.equal(grouped.reservation.length, 1);
assert.equal(grouped.closing.length, 1);

console.log('ALL_LEAD_LIFECYCLE_TESTS_PASSED');
