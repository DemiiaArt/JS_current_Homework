let whatTime = prompt('Hello! Write how much hours you want to convert:');

const seconds = +whatTime * 60 * 60;

if (whatTime <= 1) {
    alert(`${whatTime} hour = ${seconds} seconds`);
} else {
    alert(`${whatTime} hours = ${seconds} seconds`);
}
