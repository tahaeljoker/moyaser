import { Router } from 'express';
import { MaintenanceRequest } from '../models/MaintenanceRequest.js';
import { Lead } from '../models/Lead.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { leadSubmissionLimiter } from '../middleware/rateLimiter.js';

const router = Router();

export const MAINTENANCE_STATUSES = ['new', 'scheduled', 'inprogress', 'done', 'cancelled'];
const ADMIN_ROLES = ['super_admin', 'admin', 'receptionist'];

const cleanString = (value) => (typeof value === 'string' ? value.trim() : '');

export function createMaintenanceHandlers(Model = MaintenanceRequest, LeadModel = Lead) {
  return {
    // POST /api/maintenance (Public)
    async createRequest(req, res) {
      try {
        const { unitNumber, projectName, customerName, customerPhone, description, attachments } = req.body || {};

        const cleanUnitNumber = cleanString(unitNumber);
        const cleanCustomerName = cleanString(customerName);
        const cleanCustomerPhone = cleanString(customerPhone);
        const cleanDescription = cleanString(description);

        if (!cleanUnitNumber || !cleanCustomerName || !cleanCustomerPhone || !cleanDescription) {
          return res.status(400).json({
            success: false,
            message: 'يرجى إدخال رقم الوحدة، اسم العميل، رقم الجوال، ووصف الطلب.',
          });
        }

        const cleanAttachments = Array.isArray(attachments)
          ? attachments.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
          : [];

        const cleanPhone = String(customerPhone || '').trim().replace(/[\s\-()]/g, '');
        const cleanUnit = cleanUnitNumber.toUpperCase();
        const matchingLead = await LeadModel.findOne({
          phone: cleanPhone,
          unitCode: cleanUnit,
          stage: 'closed',
        });
        const verificationStatus = matchingLead ? 'confirmed' : 'unconfirmed';

        const maintenanceRequest = new Model({
          unitNumber: cleanUnitNumber,
          projectName: cleanString(projectName),
          customerName: cleanCustomerName,
          customerPhone: cleanCustomerPhone,
          description: cleanDescription,
          attachments: cleanAttachments,
          status: 'new',
          verificationStatus,
        });

        await maintenanceRequest.save();

        return res.status(201).json({
          success: true,
          id: maintenanceRequest._id,
          status: maintenanceRequest.status,
          message: 'تم استلام طلب الصيانة بنجاح.',
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'فشل تسجيل طلب الصيانة.',
        });
      }
    },

    // GET /api/maintenance/track (Public)
    async trackRequest(req, res) {
      try {
        const cleanUnitNumber = cleanString(req.query?.unitNumber);
        const cleanCustomerPhone = cleanString(req.query?.customerPhone);

        if (!cleanUnitNumber || !cleanCustomerPhone) {
          return res.status(404).json({
            success: false,
            message: 'لم يتم العثور على طلب صيانة مطابق للبيانات المدخلة.',
          });
        }

        const request = await Model.findOne({
          unitNumber: cleanUnitNumber,
          customerPhone: cleanCustomerPhone,
        }).sort({ createdAt: -1 });

        if (!request) {
          return res.status(404).json({
            success: false,
            message: 'لم يتم العثور على طلب صيانة مطابق للبيانات المدخلة.',
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            status: request.status,
            appointmentDate: request.appointmentDate,
            appointmentNotes: request.appointmentNotes,
          },
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'تعذر التحقق من حالة طلب الصيانة.',
        });
      }
    },

    // GET /api/admin/maintenance (Protected)
    async listRequests(req, res) {
      try {
        const requests = await Model.find().sort({ createdAt: -1 });
        return res.status(200).json({
          success: true,
          count: requests.length,
          data: requests,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'فشل استرجاع طلبات الصيانة.',
        });
      }
    },

    // PATCH /api/admin/maintenance/:id (Protected)
    async updateRequest(req, res) {
      try {
        const { status, appointmentDate, appointmentNotes } = req.body || {};
        const request = await Model.findById(req.params.id);

        if (!request) {
          return res.status(404).json({
            success: false,
            message: 'طلب الصيانة غير موجود.',
          });
        }

        if (status !== undefined) {
          if (!MAINTENANCE_STATUSES.includes(status)) {
            return res.status(400).json({
              success: false,
              message: 'حالة الطلب غير صالحة.',
            });
          }
          request.status = status;
        }

        if (appointmentDate !== undefined) {
          if (appointmentDate === null || appointmentDate === '') {
            request.appointmentDate = null;
          } else {
            const parsedDate = new Date(appointmentDate);
            if (Number.isNaN(parsedDate.getTime())) {
              return res.status(400).json({
                success: false,
                message: 'تاريخ الموعد غير صالح.',
              });
            }
            request.appointmentDate = parsedDate;
          }
        }

        if (appointmentNotes !== undefined) {
          request.appointmentNotes = appointmentNotes === null ? '' : String(appointmentNotes).trim();
        }

        await request.save();

        return res.status(200).json({
          success: true,
          message: 'تم تحديث طلب الصيانة بنجاح.',
          data: request,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'فشل تحديث طلب الصيانة.',
        });
      }
    },
  };
}

const handlers = createMaintenanceHandlers(MaintenanceRequest);

router.post('/maintenance', leadSubmissionLimiter, handlers.createRequest);
router.get('/maintenance/track', handlers.trackRequest);
router.get('/admin/maintenance', verifyToken, requireRole(ADMIN_ROLES), handlers.listRequests);
router.patch('/admin/maintenance/:id', verifyToken, requireRole(ADMIN_ROLES), handlers.updateRequest);

export default router;
