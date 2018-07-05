//usare:  'use indevpa'

db.createUser({user:'altkemist-dev',pwd:'kirajega',roles:[{role:'readWrite',db:'indevpa'}]});
//db.auth('altkemist-dev','kirajega');   [por si algun dia necesitamos usar Authetication]
// NO CREAR ESTE USUARIO MAS DE 1 VEZ
db.createCollection('users');
db.users.insertOne({
    email:'admin@indev-panama.com',
    username:'admin-indevJK',
    password:'$2a$10$7H5ho4H7MNzvs1j/Itzv6OM7ZOEKZc/x74.VPnEo9A/yaWgXLeGRu', 
    passConfirm:'$2a$10$7H5ho4H7MNzvs1j/Itzv6OM7ZOEKZc/x74.VPnEo9A/yaWgXLeGRu',
    tel:'3909090',
    rango:'0' 
});
db.createCollection('software');
db.software.insertOne({
    codigo:'0001',
    nombre:'Mercuris',
    descripcion:'Reproductor de musica', 
    desarrollador:'Altkemist',
    estado:'Inactivo'
});
// Para conectarse a la base de datos como Admin '$mongo -u altkmist-dev -p' esto les pedira la contrasena
// 0 es admin, 1 developer, 2 gente comun
// clave de admin: soyescanor123