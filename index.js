let Jimp = require('jimp');
let fs = require('fs');
const { exit } = require('process');
let args = process.argv.slice(2);

let filePath = args[0];
// let filePath = './erk.png';
if(!filePath){
    console.log('Please supply an image path argument');
    exit();
}
const SML_SCREEN = 80;
const LRG_SCREEN = 176;

let linesLeft = 1000;//total lines available to use
let data = 'draw clear 0 0 0 0 0 0';//final data to be written out
linesLeft -= 1;

let sSize = SML_SCREEN;
let picSize = 10;
let pixSize = Math.floor(sSize/picSize);

Jimp.read(filePath, (err, img) => {
    if(err)throw err;
    //img.contrast(0.2);
    //img.brightness(0.1);
    img.resize(picSize,picSize);
    //img.write('test.jpg');
    for(let y = 1; y <= picSize; y++){
        for(let x = 0; x < picSize; x++){
            if(linesLeft < 3){
                break;
            }
            let rgba = Jimp.intToRGBA(img.getPixelColor(x,y-1));
            data +=`\ndraw color ${rgba.r} ${rgba.g} ${rgba.b} ${rgba.a} 0 0`;
            data +=`\ndraw rect ${x*pixSize} ${sSize-(y*pixSize)} ${pixSize} ${pixSize} 0 0`;
            linesLeft -= 2;
        }
        if(linesLeft < 3){
            console.log('line limit reached');
            break;
        }
    }
    data += `\ndrawflush display1`
    linesLeft -= 1;
    fs.writeFileSync('output.txt', data);
    console.log(`${1000-linesLeft} lines printed`)
})