const text = document.querySelector('.text').innerHTML;
//console.log(text);

const regexp = /\s'(.+)'/g;

let textReqexp = text.replace(regexp, '"$1"');
//console.log(textReqexp);

document.querySelector(".text-regexp").insertAdjacentHTML("afterbegin", textReqexp);