# table-booking app

A Table Booking built using MERN Stack

Tech Stack Used : MERN => MongoDB, Express, React,NodeJS
Packages Used : Mongoose,BCrypt, JWT, Passport, HtmlTabletoExcel, Validator

Procedures to Install :
1=> clone the repo 2=> run npm install 3=> run client-install 4=> run npm run dev (This will start both frontend and backend)

Features of Backend:

  => Built on NodeJS and Express
  => Used Mongoose to manipulate data into Database
  => I Have used JWT and Passport for user Authorization
  => Passwords are encrypted using BCrypt
  => Validation for each data in backend

Features of Frontend:

  => Completely bulit with react and redux
  => Export Tables to Excel
  => Used Material CSS for Styling
  => An Unidirectional data flow using Redux
  => Redux Middlewares are used to make requests to API
  => Axios is used for making Requests
  => Used Materialize Css

Note : The Available Tables will be empty intially, We have to populate it with data, for that i have created a backend route /manageTable.

    In order to populate that send this as a body via post request from postman or any request creators

        eg :
        body = {
        time : "2 PM" // String - Create avalaible tables for particular time,
        capcity : "5" // String - Capacity of table,
        startNumber : 5 // Number - an integer denotes the start of a series of tables,
        number : 10 // Indicates the amount of table to be created
        }

    Please make a request as above, so that a series of available tables can be created
    from which the user can book tables
