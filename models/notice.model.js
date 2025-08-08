const mongoose = require('mongoose')

const noticeSchema = ({
    school: { type: mongoose.Schema.ObjectId, ref: 'School'},
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, enum:['student', 'teacher'], required: true },

    createdAt: { type: Date, default: new Date()}
})

module.exports = mongoose.model('Notice', noticeSchema)