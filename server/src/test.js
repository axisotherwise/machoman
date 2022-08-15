import bcrypt from "bcrypt";

const PW = 'abcd1234';
const encryptedPW = bcrypt.hashSync(PW, 10);
console.log(encryptedPW);

const same = bcrypt.compareSync(PW, "$2b$10$k6fw9uM/WozIPzqEwM3UR.KeTrcqW6pfraVRmvA4wpib2XWTMIcAa");
console.log(same); // same = true