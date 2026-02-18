const mongoose = require('mongoose');

const serviceLogSchema = mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
    },
    requestDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    basicDetails: {
        ticketId: String,
        customerName: String, // Ensure this matches user request 'Customer Business Name'
        serviceLocation: String,
        productName: String,
        productSerial: String,
        problemDescription: String,
    },
    supportDetails: {
        requestType: [String], // Demo, Installation, Warranty, AMC, Chargeable
        requestMode: String, // Telephone, Email
        receivedBy: String,
        customerContact: String,
        resellerName: String,
    },
    sparesDetails: {
        replacedSpare: String,
        replacedSpareSlNo: String,
        damagedOldSpare: String,
        damagedOldSpareSlNo: String,
        testCardAttached: Boolean,
        printingCounter: String,
        serviceCharge: { type: Number, default: 0 },
        anyOtherCharges: { type: Number, default: 0 },
        chargeDescription: String,
    },
    briefDescription: String,
    engineerFeedback: {
        engineerName: String,
        timeSpent: String,
        status: {
            type: String,
            enum: ['Completed', 'Pending'],
            default: 'Pending',
        },
        engineerSignature: String, // base64 string
    },
    customerFeedback: {
        rating: String, // Poor, Average, Good, Excellent
        representativeName: String,
        signature: String, // base64 string
        contactNo: String,
        email: String,
        remarks: String,
    },
    totalCallCost: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const ServiceLog = mongoose.model('ServiceLog', serviceLogSchema);
module.exports = ServiceLog;
