var img = document.querySelectorAll(".gallery img");


var minimum = -1;

for (var i = 0; i < img.length; i++) {
    var currentImage = img[i];
    
    currentImage.addEventListener("click",function(e){
        
        e.currentTarget.style.zIndex = minimum;
        minimum -= 1;
        e.stopPropagation();
    })
}