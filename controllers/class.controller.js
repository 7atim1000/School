const Class = require('../models/class.model');

const Student = require('../models/student.model');
const Examination = require('../models/examination.model');
const Schedule = require('../models/schedule.model');


module.exports = {
    getAllClasses: async(req, res)=> {
        try{
            // get classes by the school
           const schoolId = req.user.schoolId;

           const allClasses = await Class.find({school:schoolId});
           res.status(200).json({ success: true, message: 'Successfully getting classs.', data: allClasses})

        } catch(error){
            console.log('Getallclasses error', error)
            res.status(500).json({ success: false, message: 'Server error in getting classes' })
        }
    },


    createClass: async(req, res) => {
        try {
            const newClass = new Class({
               school: req.user.schoolId, // req.user taked from auth.js req.user = decoded && schoolId taket from login
               class_text: req.body.class_text,
               class_num: req.body.class_num, 
            })

        await newClass.save();
        res.status(200).json({ success: true, message: 'Successfully created the class.' })
 
        } catch (err) {
            res.status(500).json({ success: false, message: 'Server error in creating class.' })
        }
    },

    
    updateClassWithId: async(req, res) => {
        try {
            let id = req.params.id  // used params method
            //const { id } = req.params;
            
            await Class.findOneAndUpdate({_id:id}, {$set:{...req.body}}) ;
            //const { dep_name, description } = req.body ;
            
            const classAfterUpdate = await Class.findOne({_id:id})
            res.status(200).json({ success: true, data:classAfterUpdate, message: 'Successfully Class Updated' })
            /*
            const updateDep = await Department.findByIdAndUpdate({ _id: id }, dep_name, description})
            res.status(200).json({ success: true, updateDep})
            */

        } catch (error) {
            console.log('Update class error=>', error)
            res.status(500).json({ success: false, message: 'Server error in update class.' })   
        }
    },



    deleteClassWithId:  async(req, res)=> {
        try{
            let id = req.params.id;
            let schoolId = req.user.schoolId;

            //can not delete already in use 
            const classStudentCount = (await Student.find({student_class:id, school:schoolId})).length;
            const classExaminationCount = (await Examination.find({class:id, school:schoolId})).length;
            const classScheduleCount = (await Schedule.find({class:id, school:schoolId})).length;

            if ((classStudentCount===0) && (classExaminationCount===0) && (classScheduleCount===0)){
                await Class.findOneAndDelete({_id:id, school:schoolId})
                res.status(200).json({ success: true, message: 'Successfully class deleted.' })
            } else {
                res.status(500).json({ success: false, message: 'This class is already in use ...' })
            }

        }catch (error){
            console.log('Delete class Error=>', error)
            req.status(500).json({ success: false, messsage: 'Server error in deleting class.' })
        }
    }
        
}