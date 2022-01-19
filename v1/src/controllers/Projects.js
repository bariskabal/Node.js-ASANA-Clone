const {insert,list,modify,remove} = require("../services/Projects")
const httpStatus = require("http-status")


const create = (req,res) => {
    req.body.user_id = req.user
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
const update = (req,res) => {
    if (!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({message : "ID Bilgisi eksik."})
    }
    modify(req.body,req.params?.id).then(updatedProject => {
        res.status(httpStatus.OK).send(updatedProject)
    }).catch(e=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error : "Kayıt sırasında bir sorun oluştu"}))

}
const deleteProject = (req,res)=>{
    if (!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).send({message : "Kayıt bulunamadı."})
    }
    remove(req.params?.id)
    .then((deletedProject) => {
        if (!deletedProject) {
            return res.status(httpStatus.NOT_FOUND).send({message : "ID Bilgisi eksik."})
        }
        res.status(httpStatus.OK).send({message : "Proje silinmiştir!"})
    }).catch(e=> res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error : "Silme işlemi sırasında bir sorun oluştu"}))
}
module.exports = {
    create,index,update,deleteProject
}