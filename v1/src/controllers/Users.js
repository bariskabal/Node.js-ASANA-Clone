const {insert,list,loginUser,modify,remove } = require("../services/Users")
const projectService = require("../services/Projects")
const httpStatus = require("http-status")
const uuid = require("uuid")
const eventEmitter = require("../scripts/events/eventEmitter")
const {passwordToHash, generateAccessToken, generateRefreshToken} = require("../scripts/utils/helper")
const path = require("path")

const create = (req,res) => {

    req.body.password = passwordToHash(req.body.password)

    insert(req.body).then(response => {
        res.status(httpStatus.CREATED).send(response)
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
    
}
const index = (req,res) => {
    list().then(response=>{
        res.status(httpStatus.OK).send(response)
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
    
}
const login = (req,res) => {
    req.body.password = passwordToHash(req.body.password)
    loginUser(req.body)
    .then((user)=>{
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({message: "Böyle bir kullanıcı bulunmamaktadır!"})
        }
        user = {
            ...user.toObject(),
            tokens:{
                access_token : generateAccessToken(user),
                refresh_token : generateRefreshToken(user)
            }
        }
        res.status(httpStatus.OK).send(user)
    })
    .catch(e=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e))
}
const projectList = (req,res) =>{
     projectService
     .list({user_id : req.user?._id})
     .then(projects=>{
         res.status(httpStatus.OK).send(projects)
     }).catch(()=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"Beklenmedik bir hata oluştu!"}))
}
const resetPassword = (req,res) => {
    const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`
    modify({email:req.body.email},{password: passwordToHash(new_password)}).then(updatedUser => {
        if (!updatedUser) {
            return res.status(httpStatus.NOT_FOUND).send({error:"Böyle bir kullanıcı bulunamadı."})
        }
        eventEmitter.emit("send_email",{
            to: updatedUser.email, // list of receivers
            subject: "Şifre Sıfırlama ✔", // Subject line
            html: `Şifre sıfırlama gerçekleşti. <br></br> Yeni Şifreniz : <b>${new_password}</b>`, // html body
        })
        res.status(httpStatus.OK).send({
            message: "Şifre sıfırlama talebiniz alındı.Maili kontrol edin."
        })
    }).catch(()=>res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error : "Şifre resetleme sırasında bir problem oluştu!"}))
}
const update = (req,res) => {
     modify({_id:req.user?._id},req.body).then((updatedUser) => {
         res.status(httpStatus.OK).send(updatedUser)
     }).catch(()=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"Beklenmedik bir hata oluştu!"}))
}
const changePassword = (req,res) => {
    req.body.password = passwordToHash(req.body.password)
    modify({_id:req.user?._id},req.body).then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser)
    }).catch(()=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"Beklenmedik bir hata oluştu!"}))
}
const deleteUser = (req,res)=>{
    if (!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({message : "Kayıt bulunamadı."})
    }
    remove(req.params?.id)
    .then((deletedUser) => {
        if (!deletedUser) {
            return res.status(httpStatus.NOT_FOUND).send({message : "ID Bilgisi eksik."})
        }
        res.status(httpStatus.OK).send({message : "User silinmiştir!"})
    }).catch(e=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error : "Silme işlemi sırasında bir sorun oluştu"}))
}
const updateProfileImage = (req,res)=> {
    // 1- Resim kontrolü
    if (!req?.files?.profile_image) {
        return res.status(httpStatus.BAD_REQUEST).send({error:"Bu işlemi yapamazsınız!"})
    }
    //const fileName = req?.user._id
    // 2- Upload işlemi 
    const extensions = path.extname(req.files.profile_image.name)
    const fileName = `${req?.user._id}${extensions}`
    const folderPath = path.join(__dirname,"../","uploads/users",fileName)
    req.files.profile_image.mv(folderPath,function (err){
        if(err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:err})
        modify({_id:req.user._id},{profile_image: fileName})
        .then(updatedUser => {
            res.status(httpStatus.OK).send(updatedUser)
        }).catch(e=>res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:"Upload başarılı fakat kayıt sırasında sorun oluştu!"}))
    })
    // 3- DB save işlemi
    // 4- Responses 
}



module.exports = {
    create,index,login,projectList,resetPassword,update,deleteUser,changePassword,updateProfileImage
}