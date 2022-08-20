const multer = require('multer')

const storage = multer.diskStorage({
    // xác định nơi sẽ lưu file
    destination: function(req, file, cb){
        cb(null,'./upload')
    },
    //xác định tên file khi lưu
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        //chấp nhận file
        cb(null,true)
    }
    else{
        //từ chối file
        cb(new Error('Failed'),false)
    }
}

const upload = multer({
    storage: storage,
    limit: {
        fileSize : 1024 * 1024 * 5 
    },
    fileFilter : fileFilter ,
})

// const singleUpload = multer({
//     storage: storage,
//     limit: {
//         fileSize : 1024 * 1024 * 5 
//     },
//     fileFilter : fileFilter ,
// }).single('image')

// const uploadOne = singleUpload(req,res,(error)=>{
//     if(error) console.log(error)
//     else{
//         const newProduct = new Product({...req.body.data,urlPicture: req.file.path})
//     }
// })

module.exports = upload 