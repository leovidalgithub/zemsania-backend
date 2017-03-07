
var constants = {
    reviewNotificationTime: 86400000, //24h
    newItemDurationTime: 172800000, //48h.
    draft: 'draft',
    imputed: 'imputed',
    sent: 'sent',
    validated: 'validated',
    delivery: 'delivery',
    hours_sent: 'hours_sent',
    hours_validated: 'hours_validated',
    hours_rejected: 'hours_rejected',
    spent_approved: 'spent_approved',
    spent_rejected: 'spent_rejected',
    spent_sent: 'spent_sent',
    absences_approved: 'absences_approved',
    absences_rejected: 'absences_rejected',
    absences_sent: 'absences_sent',
    read: 'read',
    unread: 'unread',
    requested: 'requested',
    holidaysTotal: 23,
    approved: 'approved',
    rejected: 'rejected',
    defaultPassword: 'Zemsania$15',
    roles: ['ROLE_USER', 'ROLE_BACKOFFICE', 'ROLE_MANAGER', 'ROLE_DELIVERY'],
    verifyResetPassTime : 60
}

module.exports = constants;
