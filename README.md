A full-stack blog written in Java and TypeScript using Spring Boot and Reactjs.
     
##Setup Guide

### MySQL Setup:

  1. Use a preffered MySQL for your system(os) and create a database named ```blog```
  2. Run the MySQL Server
  
### Backend: 
You can also download jar file of the project from here(https://drive.google.com/file/d/1KB06OygW2SYx14Dg0KDa1Y7WclG_6FL7/view?usp=sharing) but remember to keep the settings of application properties as it is and use the settings below

MYSQL settings
1. Database user = root
2. Database password =
3. Database name = blog

  1. Open the ```backend``` folder with InteliJIDEA or Eclipse
  2. Right click on the ```pom.xml``` file and with the maven option select ```Reload the project``` it will automatically download 
     the dependencies
  3. Open ```application.properties``` file from the resource folder and add the following lines
          
          #MySQL database connection strings
          spring.datasource.url=jdbc:mysql://localhost:3306/blog
          spring.datasource.username=YOUR_DB_USERNAME //Commonly used: root
          spring.datasource.password=YOUR_DB_PASSWORD

          # JPA property settings
          #spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
          spring.jpa.hibernate.ddl-auto=update //If update don't work use create or create-drop, the revert back to update
          spring.jpa.properties.hibernate.show_sql=true
          
  4. Once the source building and dependecies are ready and ```application.properties``` is configured, run the App using 
     Application configuration or just run if the provided configuration is available.

### Frontend:

  1. Open ```frontend/simplyblog/api/axios.tsx``` file and change the baseURL: like this ```baseURL:'http://localhost:8080',``` and save.
  2. Create new folder named front end and add all files except backend from repository into frontend. Open frontend folder in Vs code and run terminal
  3. In terminal run following commands
     cd simplyblog
     npm install
     npn run start
                              
  5. Either you can use ```npm run start``` or use ```npm run build``` then serve the build with ```serve -s build```
  6. Frontend will automatically run in your browser
  
  
#### Once all three are set, you can readily browse through http://lostcalhost:8080 for backend and http://localhost:3000 for frontend (PORTs may vary depending on your system/version or availability for use.)

