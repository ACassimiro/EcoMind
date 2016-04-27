# EcoMind
The ecological Social Media

*@authors Heloisa Carbone | Aellison Cassimiro | Elizabeth Speer | Hongjun Yoon*

## Prerequisites   
	Preferable Resolution: 2560 x 1600 (a little small and a little bigger are ok, but may cause some disturbances in the html)  
	Preferable Browser: Chrome  
	Install:  
	-> mongodb Community Edition - https://docs.mongodb.org/manual/installation/  
	-> nodejs - https://nodejs.org/en/download/  
		nodejs libraries (using "npm install"):  
			- mongodb  
			- express  
			- nodemailer  
			- socket.io  
			- async  
			- http  
			-> If the program crash even after installing all this ones and show some other name, please forgive me and install this other thing that the program is claimming for using the same command "npm install 'library'"  
  
## Running the project  
	
  *1st time using the project: It is nice to execute the program to fill the database with news. To do that inside the EcoMind folder there is a file called inputNews.js execute it by using the command 
		"node inputNews.js"
	The program won't finish by himself, so as far as it is not printing anything else, you can kill it (CTRL C)*

	-> To Run our project
		Inside the folder EcoMind on the terminal execute 
			"node app.js"
		this will initialize our server
		After that, you can access 
			http://localhost:8080/index.html
		in the browser and Voilà, you now are able to create as many users as you want, and play with them.

**That's it. Hope you enjoy !**
