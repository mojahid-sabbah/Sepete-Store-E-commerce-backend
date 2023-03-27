import  multer from 'multer';
 // (fs) method that create a files
export const validationtype = {
    image: ['image/jpeg', 'image/png' ],
    pdf: ['application/pdf']
}
export const HME = (error, req, res, next) => { //handleMulterError
    if (error) {  res.status(400).json({ message: "multer error", error }) } 
    else { next() }
}
export function myMulter(customValidation) {
    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb("invalid file type", false)
        }
    }
    const upload = multer({ dest: 'upload', fileFilter, storage })
    return upload;
} 