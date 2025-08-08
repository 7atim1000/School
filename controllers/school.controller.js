// CRUD applications Create, Read, Update, Delete
// Authentication    School, Student, Teacher        npm i formidable
require('dotenv').config()
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
// resently jsonwebtoken Used in Login stage not in register or create stage 
const jwt = require('jsonwebtoken')
const School = require('../models/school.model');

module.exports = {

    registerSchool: async(req, res) => {
    try {
        //-------------------photos
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files)=> {

            const school = await School.findOne({email: fields.email[0]});
            if (school) {
                return res.status(409).json({ success: false, message: "Email already registered"})
            } else {

            const photo = files.image[0]; // fieldName

            let filepath = photo.filepath;
            let originalFilename = photo.originalFilename.replace(' ','_');
            let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);
        
            let photoData = fs.readFileSync(filepath);
            fs.writeFileSync(newPath, photoData);
        
        
        //---------------------data
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt)
        
        const newSchool = new School ({
            school_name: fields.school_name[0],
            email: fields.email[0],
            owner_name: fields.owner_name[0], 
            school_image: originalFilename,
            password: hashPassword
        })
        
            const savedSchool = await newSchool.save();
            res.status(200).json({ succeess: true, data: savedSchool, message:"School is Registered Successfully" })
        }  // close above else
    })
            
        
    } catch (error) {
        res.status(500).json ({ success:false, message: 'School Registration Faileds ...'})
    }

   }, 




    loginSchool: async(req, res) => {
            
        try {
                // fetch email
            const school  = await School.findOne({email: req.body.email});
           
            if (school) {
                // compare password
               const isAuth = bcrypt.compareSync(req.body.password, school.password)
               if (isAuth) {
                //res.header('Authorization', )
                // token configuration:-
                const jwtSecret = process.env.JWT_SECRET ;
                const token = jwt.sign({
                        
                    id: school._id,
                    schoolId: school._id,
                    owner_name: school.owner_name,
                    school_name: school.school_name,
                    image_url: school.school_image,
                    role: "SCHOOL"

                    }, jwtSecret) //, {expiresIn: "10d"}
                    
                    res.header("Authorization", token)
                //////////////////////////
                res.status(200).json({ success: true, message:'Success Login', 
                    user: {
                        id: school._id,
                        owner_name: school.owner_name,
                        school_name: school.school_name,
                        image_url: school.school_image,
                        role: "SCHOOL"
                    }  , token
                });

                }else {
                   res.status(401).json({ success: false, message: 'Password is Incorrect.'})
                }
            }else {
                res.status(401).json({ success: false, message: 'Email is not registered.'})
            }



        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error...[SCHOOL LOGIN].'})
        }
                
   },


   
    GetAllSchools: async(req, res) => {

       try {
           const schools = await School.find().select([`-password`, '-_id', '-email', '-owner_name', '-createdAt']);
           res.status(200).json({ success: true, message: 'Success in fetchin all schools data.', schools })
       } catch (error) {
           res.status(500).json({ success: false, message: 'Internal server error ... [All School Data].'})
       }
   },

   
    
   
    getSchoolOwnData: async(req, res) => {
    
       try {
            //const id = ""
            const id = req.user.id ;
            const school = await School.findOne({_id:id}).select(['-password']);

            if (school) {
                res.status(200).json({ success: true, school })
            } else {
                res.status(404).json({ success: false, message: 'School not exist ...' })
            }

        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal Server Error [OWN SCHOOL DATA] ...' })
        }
        

               
    }, 

    


    updateSchool: async(req, res) => {
        try {
            // update Api :-
            // const id = '';
            const id = req.user.id;
            //-------------------photo
            const form = new formidable.IncomingForm();
          
            form.parse(req, async(err, fields, files)=> {
            // update Api :-
            const school = await School.findOne({_id: id});
       
            if (files.image){
                const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(' ','_');
            
            // update Api:-
                if (school.school_image){
                    let oldImagePath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, school.school_image); 
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlink(oldImagePath, (err)=> {
                            if (err) console.log('Error deleting old Image.', err)
                        })
                    }
                }
                
                let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);
                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath, photoData);
            
            // update Api 
                Object.keys(fields).forEach((field)=>{   // All fields 
                    school[field]=fields[field][0]
                })

                school['school_image'] = originalFilename
            }

            //    await school.save();
            //    res.status(200).json({ success: true, message: 'School updated Successfully .', school})
           
            else{
                school['school_name'] = fields.school_name[0]
            }
            await school.save();
            res.status(200).json({ success: true, message: 'School updated Successfully .', school})

     
            
        })
                
            
        } catch (error) {
            res.status(500).json ({ success:false, message: 'School Registration Fields ...'})
        }
    
       },


}