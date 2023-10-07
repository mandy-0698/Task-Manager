const mongoose=require('mongoose');
require('../src/db/mongoose');
const User=require('../src/models/user');


// const id='6512ea706460b38ad44d1d17';
// User.findByIdAndUpdate(id,{age:10}).then((user)=>{
//     console.log("Updated user",user);
//     return User.count({age:10});
// }).then((result)=>{
// console.log(result);
// }).catch((error)=>{
//     console.log(error);
// }).finally(()=>{
//     mongoose.connection.close();
// })

const updateUserandCount=async(id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age});
    console.log(user);
    const count=await User.count({age});
    return count;
}

updateUserandCount('6512ea706460b38ad44d1d17',12).then((count)=>{
    console.log(count);
}).catch((error)=>{
    console.log(error);
}).finally(()=>{
    mongoose.connection.close();
})
