# ZinNodeJS
SAP CA 3 - Insecure Branch 

This branch includes vulnerabilities and security issues

NodeJS Application will run on `localhost` on `port 5000`

Installs that may be needed: 

1. `npm install`
2. `npm install ejs`

To run the application:

1. `node app.js`

*** 

Access: 

**Administrator:**
Username and password within Documentation under **Version Control**
- Should have exclusive access to:
1.  http://localhost:5000/admin 
2.  http://localhost:5000/admin/songs
3.  http://localhost:5000/all-users 
- Should **NOT** be able to create song entry

1.  http://localhost:5000/songs/create 

_However since this is the insecure branch, by force browsing the URL above, you will be able to access admin pages even without being logged in._ 


**Test User:** (or feel free to register your own)

email: tester

password: 123456
- Should have access to:

1.  http://localhost:5000/songs
2.  http://localhost:5000/songs/create  
- Should **NOT** have access to Admin pages:

1.  http://localhost:5000/admin 
2.  http://localhost:5000/admin/songs
3.  http://localhost:5000/all-users 

_However since this is the insecure branch, by force browsing the URL above, you will be able to access admin pages even without being logged in._ 

***