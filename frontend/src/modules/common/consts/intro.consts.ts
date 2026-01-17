const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const hour = currentDate.getHours();
const minute = currentDate.getMinutes();
const second = currentDate.getSeconds();

export const textLines = [
  `Call trans opt: received. ${month}-${day}-${year} ${hour}:${minute}:${second} REC:Log>`,
  "Trace program: running",
];
