 const Project = require("../models/Projects")
 
 const insert = (projectData) => {
    const project = new Project(projectData)
    return project.save()
 }
const list = (where) => {
    return Project.find(where || {}).populate({
        path: "user_id",
        select:"full_name email profile_image"
    })
}
const modify = (data,id) =>{
    return Project.findByIdAndUpdate(id,data,{new : true}) 
}
const remove = (id) =>{
    return Project.findByIdAndDelete(id,{new : true}) 
}
 module.exports = {
     insert,list,modify,remove
 }