const inputImage = document.querySelector('#inputImage');
inputImage.style.width="100%";
const fileInput = document.getElementById('fileInput');
const cropOption = document.querySelector('#cropOption');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
const cropBtn = document.querySelector("#cropBtn");
const loader = document.querySelector("#loader");
let net;
const bodyPartMaskColors = [
            [0, 0, 0],
            [0, 0, 0],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255],
            [255, 255, 255]
        ];

fileInput.addEventListener('change', onSelectFile, false);
cropOption.addEventListener('change',onCropOptionChange);
cropBtn.addEventListener('click',loadAndPredict);

async function loadAndPredict() {
    if(!fileInput.files){
      return;
    }
    showOutputImage();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    const cropOptionValue = cropOption.value;
    let segmentation, coloredPartImage;
    // // The mask image is an binary mask image with a 1 where there is a person and
    // // a 0 where there is not.
    if (cropOptionValue == 1) {
        segmentation = await net.segmentPerson(inputImage, { internalResolution: 'high' });
        coloredPartImage = bodyPix.toMask(segmentation,{r: 0, g: 0, b: 0, a: 255},{r: 0, g: 0, b: 0, a: 0})
    } else {
        segmentation = await net.segmentPersonParts(inputImage, { internalResolution: 'high' });
        coloredPartImage = bodyPix.toColoredPartMask(segmentation, bodyPartMaskColors);
    }

    const opacity = 1;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    canvas.width = inputImage.width;
    canvas.height = inputImage.height;
    ctx.putImageData(coloredPartImage,0,0);
    // bodyPix.drawMask(
    //     canvas, inputImage, coloredPartImage, opacity, maskBlurAmount,
    //     flipHorizontal);
    if(cropOptionValue == 2){
      var imgd = ctx.getImageData(0, 0, inputImage.width, inputImage.height),
          pix = imgd.data,
          newColor = { r: 0, g: 0, b: 0, a: 0 };
      for (var i = 0, n = pix.length; i < n; i += 4) {
          var r = pix[i],
              g = pix[i + 1],
              b = pix[i + 2],
              a = pix[i + 3];

          // If it is black then make the pixel transparent
          if (r === 0 && g === 0 && b === 0) {
              pix[i + 3] = 0;
          }
      }
      ctx.clearRect(0,0,inputImage.width,inputImage.height);
      ctx.putImageData(imgd, 0, 0);
    }
    
    // ctx.save()
    if(cropOptionValue == 1){
      ctx.globalCompositeOperation = "source-in";
    }
    else{
      ctx.globalCompositeOperation = "source-out"
    }
    ctx.drawImage(inputImage, 0, 0,inputImage.width,inputImage.height);
    ctx.restore();
    
    hideInputImage()
}

function onSelectFile() {
  if(fileInput)
    hideOutputImage()
    inputImage.style.display = "block";
    inputImage.src = (window.URL ? URL : webkitURL).createObjectURL(fileInput.files[0]);
};

function hideImage() {
   inputImage.style.display = "none";
}

function onCropOptionChange() {
  showInputImage();
  hideOutputImage();
}

function showInputImage() {
  inputImage.style.display='block';
}

function hideInputImage() {
  inputImage.style.display='none';
}

function hideOutputImage(){
  canvas.style.display = 'none'
}

function showOutputImage(){
  canvas.style.display = 'block'
}
async function init(){
  net = await bodyPix.load();
  hideLoader();
  document.querySelector('#mainContent').style.visibility="visible";

}

function hideLoader(){
  loader.style.display = "none"
}

function showLoader(){
  loader.style.display = "flex"
}

function loadModel(){

}


init();