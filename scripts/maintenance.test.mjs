import assert from 'node:assert/strict';
import { MaintenanceRequest } from '../server/models/MaintenanceRequest.js';
import { createMaintenanceHandlers } from '../server/routes/maintenanceRoutes.js';

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function createMockModel(initialDocs = []) {
  const store = initialDocs.map((doc) => ({ ...doc }));
  let seq = store.length + 1;

  class MockMaintenanceModel {
    constructor(data) {
      Object.assign(this, {
        _id: `maint-${seq++}`,
        projectName: '',
        attachments: [],
        status: 'new',
        appointmentDate: null,
        appointmentNotes: '',
        createdAt: new Date(),
        ...data,
      });
    }

    async save() {
      const idx = store.findIndex((item) => item._id === this._id);
      if (idx >= 0) {
        store[idx] = this;
      } else {
        store.push(this);
      }
      return this;
    }

    static findOne(query) {
      const match = store.find(
        (item) =>
          item.unitNumber === query.unitNumber &&
          item.customerPhone === query.customerPhone
      ) || null;
      return {
        sort() {
          return Promise.resolve(match);
        },
      };
    }

    static find() {
      return {
        sort() {
          return Promise.resolve([...store].sort((a, b) => b.createdAt - a.createdAt));
        },
      };
    }

    static async findById(id) {
      return store.find((item) => item._id === id) || null;
    }
  }

  MockMaintenanceModel._store = store;
  return MockMaintenanceModel;
}

function createMockLeadModel(initialLeads = []) {
  const leads = initialLeads.map((lead) => ({ ...lead }));

  return {
    async findOne(query) {
      return (
        leads.find(
          (lead) =>
            lead.phone === query.phone &&
            lead.unitCode === query.unitCode &&
            lead.stage === query.stage
        ) || null
      );
    },
  };
}

// T1. Model validation (no DB connection)
const baseValidPayload = {
  unitNumber: 'A-101',
  customerName: 'أحمد العتيبي',
  customerPhone: '0551234567',
  description: 'تسريب مياه في دورة المياه الرئيسية',
};

for (const missingField of ['unitNumber', 'customerName', 'customerPhone', 'description']) {
  const invalidPayload = { ...baseValidPayload };
  delete invalidPayload[missingField];
  const invalidDoc = new MaintenanceRequest(invalidPayload);
  await assert.rejects(
    () => invalidDoc.validate(),
    (err) => {
      assert.ok(
        err?.errors?.[missingField],
        `Expected validation error for ${missingField}`
      );
      return true;
    }
  );
}

const validDoc = new MaintenanceRequest(baseValidPayload);
await validDoc.validate();
assert.equal(validDoc.status, 'new');
assert.equal(validDoc.verificationStatus, 'unconfirmed');
assert.deepEqual(validDoc.attachments, []);

// T2. Route logic with mocked req and res (no DB connection)
const MockModel = createMockModel();
const MockLeadModel = createMockLeadModel([
  { phone: '0551112222', unitCode: 'C-303', stage: 'closed' },
  { phone: '0553334444', unitCode: 'D-404', stage: 'reserved' },
]);
const handlers = createMaintenanceHandlers(MockModel, MockLeadModel);

// POST /maintenance — missing required field returns 400
{
  const req = { body: { unitNumber: 'A-101', customerName: 'أحمد' } };
  const res = createMockRes();
  await handlers.createRequest(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
}

// POST /maintenance — creates with status 'new' regardless of client status
let createdId = null;
{
  const req = {
    body: {
      unitNumber: 'A-101',
      projectName: 'مشروع الياسمين',
      customerName: 'أحمد العتيبي',
      customerPhone: '0551234567',
      description: 'مشكلة في التكييف المركزي',
      status: 'done',
    },
  };
  const res = createMockRes();
  await handlers.createRequest(req, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.id);
  assert.equal(res.body.status, 'new');
  assert.equal(res.body.customerName, undefined);
  assert.equal(res.body.customerPhone, undefined);
  assert.equal(res.body.verificationStatus, undefined);
  createdId = res.body.id;
  const saved = MockModel._store.find((item) => item._id === createdId);
  assert.equal(saved.verificationStatus, 'unconfirmed');
}

// POST /maintenance — confirmed when matching closed lead exists (with phone/unit normalization)
{
  const req = {
    body: {
      unitNumber: ' c-303 ',
      customerName: 'سارة محمد',
      customerPhone: ' 055-111 (2222) ',
      description: 'صيانة كهرباء',
    },
  };
  const res = createMockRes();
  await handlers.createRequest(req, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.verificationStatus, undefined);
  const saved = MockModel._store.find((item) => item._id === res.body.id);
  assert.equal(saved.verificationStatus, 'confirmed');
}

// POST /maintenance — unconfirmed when no matching closed lead exists (e.g. reserved lead)
{
  const req = {
    body: {
      unitNumber: 'd-404',
      customerName: 'خالد علي',
      customerPhone: '0553334444',
      description: 'صيانة سباكة',
    },
  };
  const res = createMockRes();
  await handlers.createRequest(req, res);
  assert.equal(res.statusCode, 201);
  const saved = MockModel._store.find((item) => item._id === res.body.id);
  assert.equal(saved.verificationStatus, 'unconfirmed');
}

// GET /maintenance/track — exact unit and phone match returns tracking fields only
{
  const req = { query: { unitNumber: 'A-101', customerPhone: '0551234567' } };
  const res = createMockRes();
  await handlers.trackRequest(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.deepEqual(Object.keys(res.body.data).sort(), [
    'appointmentDate',
    'appointmentNotes',
    'status',
  ]);
  assert.equal(res.body.data.status, 'new');
}

// GET /maintenance/track — mismatch on phone or unit returns 404
{
  const reqWrongPhone = { query: { unitNumber: 'A-101', customerPhone: '0500000000' } };
  const resWrongPhone = createMockRes();
  await handlers.trackRequest(reqWrongPhone, resWrongPhone);
  assert.equal(resWrongPhone.statusCode, 404);
  assert.equal(resWrongPhone.body.success, false);

  const reqWrongUnit = { query: { unitNumber: 'B-999', customerPhone: '0551234567' } };
  const resWrongUnit = createMockRes();
  await handlers.trackRequest(reqWrongUnit, resWrongUnit);
  assert.equal(resWrongUnit.statusCode, 404);
  assert.equal(resWrongUnit.body.success, false);
}

// PATCH /admin/maintenance/:id — updates only status, appointmentDate, appointmentNotes
{
  const req = {
    params: { id: createdId },
    body: {
      status: 'scheduled',
      appointmentDate: '2026-12-01T10:00:00.000Z',
      appointmentNotes: 'سيحضر الفني الساعة 10 صباحاً',
      unitNumber: 'HACKED-999',
      customerName: 'اسم مختلف',
      customerPhone: '0599999999',
      description: 'وصف معدل',
    },
  };
  const res = createMockRes();
  await handlers.updateRequest(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.status, 'scheduled');
  assert.equal(
    new Date(res.body.data.appointmentDate).toISOString(),
    '2026-12-01T10:00:00.000Z'
  );
  assert.equal(res.body.data.appointmentNotes, 'سيحضر الفني الساعة 10 صباحاً');
  assert.equal(res.body.data.unitNumber, 'A-101');
  assert.equal(res.body.data.customerName, 'أحمد العتيبي');
  assert.equal(res.body.data.customerPhone, '0551234567');
  assert.equal(res.body.data.description, 'مشكلة في التكييف المركزي');
}

console.log('ALL_MAINTENANCE_TESTS_PASSED');
