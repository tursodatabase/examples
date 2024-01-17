PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE frameworks (id integer primary key,name varchar (50) not null,language varchar (50) not null,url text not null,stars integer not null);
INSERT INTO frameworks VALUES(1,'Vue.js','JavaScript','https://github.com/vuejs/vue',2000);
INSERT INTO frameworks VALUES(2,'React','JavaScript','https://github.com/facebook/react',2000);
INSERT INTO frameworks VALUES(3,'Angular','TypeScript','https://github.com/angular/angular',87400);
INSERT INTO frameworks VALUES(4,'ASP.NET Core','C#','https://github.com/dotnet/aspnetcore',300);
INSERT INTO frameworks VALUES(5,'Express','JavaScript','https://github.com/expressjs/express',500);
COMMIT;
