const ServiceLog = require('../models/ServiceLog.js');

// @desc    Create new service log
// @route   POST /api/service-logs
// @access  Private
const createServiceLog = async (req, res) => {
    try {
        const {
            requestDate,
            basicDetails,
            supportDetails,
            sparesDetails,
            briefDescription,
            engineerFeedback,
            customerFeedback,
        } = req.body;

        // Generate Ticket Number: PC-YYYY-XXXX
        const year = new Date().getFullYear();
        const count = await ServiceLog.countDocuments({
            ticketNumber: { $regex: `PC-${year}` }
        });
        const ticketNumber = `PC-${year}-${(count + 1).toString().padStart(4, '0')}`;

        // Calculate Total Cost
        const totalCallCost = (Number(sparesDetails?.serviceCharge) || 0) + (Number(sparesDetails?.anyOtherCharges) || 0);

        const serviceLog = new ServiceLog({
            ticketNumber,
            requestDate,
            basicDetails: { ...basicDetails, ticketId: basicDetails?.ticketId || ticketNumber },
            supportDetails,
            sparesDetails,
            briefDescription,
            engineerFeedback,
            customerFeedback,
            totalCallCost,
        });

        const createdLog = await serviceLog.save();
        res.status(201).json(createdLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all service logs
// @route   GET /api/service-logs
// @access  Private
const getServiceLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 200;
        const logs = await ServiceLog.find({})
            .select('-engineerFeedback.engineerSignature -customerFeedback.signature')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get service log by ID
// @route   GET /api/service-logs/:id
// @access  Private
const getServiceLogById = async (req, res) => {
    try {
        const log = await ServiceLog.findById(req.params.id).lean();
        if (log) {
            res.json(log);
        } else {
            res.status(404).json({ message: 'Service Log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update service log
// @route   PUT /api/service-logs/:id
// @access  Private
const updateServiceLog = async (req, res) => {
    try {
        const log = await ServiceLog.findById(req.params.id);

        if (log) {
            // Update fields if they are present in req.body
            // Use hasOwnProperty or check for undefined to allow empty strings and false values
            if (req.body.basicDetails) log.basicDetails = req.body.basicDetails;
            if (req.body.supportDetails) log.supportDetails = req.body.supportDetails;
            if (req.body.sparesDetails) log.sparesDetails = req.body.sparesDetails;
            if (req.body.briefDescription !== undefined) log.briefDescription = req.body.briefDescription;
            if (req.body.engineerFeedback) log.engineerFeedback = req.body.engineerFeedback;
            if (req.body.customerFeedback) log.customerFeedback = req.body.customerFeedback;
            if (req.body.requestDate) log.requestDate = req.body.requestDate;

            // Recalculate total if charges changed
            if (req.body.sparesDetails) {
                log.totalCallCost = (Number(log.sparesDetails.serviceCharge) || 0) + (Number(log.sparesDetails.anyOtherCharges) || 0);
            }

            const updatedLog = await log.save();
            res.json(updatedLog);
        } else {
            res.status(404).json({ message: 'Service Log not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get next available ticket number
// @route   GET /api/service-logs/next-number
// @access  Private
const getNextTicketNumber = async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const count = await ServiceLog.countDocuments({
            ticketNumber: { $regex: `PC-${year}` }
        });
        const nextNumber = `PC-${year}-${(count + 1).toString().padStart(4, '0')}`;
        res.json({ nextNumber });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete service log
// @route   DELETE /api/service-logs/:id
// @access  Private
const deleteServiceLog = async (req, res) => {
    try {
        const log = await ServiceLog.findById(req.params.id);
        if (log) {
            await ServiceLog.deleteOne({ _id: req.params.id });
            res.json({ message: 'Service Log removed' });
        } else {
            res.status(404).json({ message: 'Service Log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createServiceLog,
    getServiceLogs,
    getServiceLogById,
    updateServiceLog,
    getNextTicketNumber,
    deleteServiceLog,
};
