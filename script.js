// // //object literals
// // const blogs=[
// // {title:"why cheese", likes: 10},
// // {title:'10 reasons why', likes:50},

// // ];
// // let user={
// // //   key:value
// //     name:'crystal',
// //     age:30,
// //     email:'fuck',
// //     local:"berlin",
// //     blogs:blogs,
// //     login(){
// //         console.log('user is racist');
// //     },
// //     logout(){
// //         console.log("user is out");
// //     },
// //     logblogs(){
// //         console.log("the blogs this person has person has wrote are:");
// //         this.blogs.forEach(blog=>{console.log(`The title is ${blog.title} and the amount of likes are ${blog.likes}`);
// //         })
// //     },
// // };
// //classes

// // class User{
// //     constructor(email,name){
// //         this.email=email;
// //         this.name=name;
// //         this.score=0;
// //     }

// //     login(){
// //         console.log(`${this.email} just logged in`)
// //         return this;

// //     }

// //     logout(){
// //         console.log(`${this.email} just logged out`)
// //         return this;

// //     }
// //     updateScore(){
// //         this.score++;
// //         console.log(`${this.email} score is now ${this.score}`);
// //         return this;
// //     }

// // }

// // //class inheritence
// // //will take constructors values and methods from what it extends from
// // //what ever is inside the exteneded class can not not be used by original class
// // class Admin extends User{

// //     deleteUser(user){
// //         users= users.filter(u=>{
// //             return u.email != user.email;
// //         })
// //     }
// // }

// // let userOne = new User('fuck@racist.com','ryu');
// // let userTwo = new User('fuck@racist.org','yosh');
// // let admin= new Admin('race@g', 'saun')

// // let users= [userOne, userTwo, admin];
// // userOne.login();
// // userTwo.logout();
// // //method chaining only works and will be defined if the instance is returned
// // userOne.login().updateScore().updateScore().logout();
// // admin.deleteUser(userTwo)
// // console.log(users);


// // //dot notation

// // // this.age=35;
// // // //could be used with brackets but need to be in quotes
// // // //or used dot notation
// // // //could make a value into a var then quotes no needed
// // // user.logblogs();
// // // let key = 'age';
// // // console.log(this[key])
// // // console.log(this['age'])
// // // //methods

// // // user.login();
// // // //Math is an object and date

// // console.log(Math);
// // console.log(Math.PI);
// // console.log(Math.E);
// // let area = 7.7;

// // console.log(Math.round(area));
// // console.log(Math.floor(area));
// // console.log(Math.ceil(area));
// // console.log(Math.trunc(area));

// // let ran = Math.random()*100;
// // console.log(ran);

// // //primiteve data types
// // //numbers,strings,bool,null,undefined,symbols

// // //reference types
// // //all types of objects,object literals,arrays,function,dates,all other objects


// //prototypes

// function User(email, name){
//     this.email=email;
//     this.name = name;
//     this.online = false;
// };
// //inheritance
// //args the same as email and name
// //User.apply gives the context to Admin
// function Admin(...args){
//    User.apply(this, args);
// };
// //now inherited anything from a different prototype 

// Admin.prototype = Object.create( User.prototype);
// //didn't do because the same as the last one 
// Admin.prototype.deleteUser= function(){
// console.log("e")
// }

// let users= [userOne, userTwo, admin];
// //class and prototypes are seperate
// //this prototype will only be seen in __proto__ not class
// //can still be used in class
// User.prototype.login = function(){
//     this.online= true;
//     console.log(`${this.email} has logged in`);
// }
// User.prototype.logout = function(){
//     this.online= false;
//     console.log(`${this.email} has logged in`);
// }

