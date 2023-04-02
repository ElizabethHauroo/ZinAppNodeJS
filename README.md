# ZinNodeJS
SAP CA 3 - Secure Branch 

This branch is where all the secure implementations are located. 

NodeJS Application can run on localhost on port 5000

Access: 

**Administrator:**
Username: _TheAdminAdvantage_
Password: _ahKi$90i!gDf00d_
- should have exclusive access to: 
..* http://localhost:5000/admin 
..* http://localhost:5000/admin/songs
..* http://localhost:5000/all-users 
- Should **NOT** be able to create song entry
..* http://localhost:5000/songs/create 


**Test User:**
email: tester@email.com
password: #letM3!n007
- Should have access to:
..* http://localhost:5000/songs
..* http://localhost:5000/songs/create  
- Should **NOT** have access to Admin pages:
..* http://localhost:5000/admin 
..* http://localhost:5000/admin/songs
..* http://localhost:5000/all-users 


