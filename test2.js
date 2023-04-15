let array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
while (array.length >= 5) array.shift();
array.splice(0, 0, 'a')

console.log(array)