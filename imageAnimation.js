const BOTTOM_LIMIT = 3000; // variable qui determine la position ou les posts s'arretent
const INTERVAL_SPEED = 50; //vitesse de deplacement en ms
const MOVEMENT = 5; //distance de deplacement en px
const SPACE_BETWEEN = 420;

function animatePosts(){
    var posts = document.getElementsByClassName("parent"); // Class des posts a descendre

    for (i = 0; i<posts.length; i++){ // loop tous les posts
        doAnimate(posts, i); // faut call une fonction pour que setInterval soit assigne a chaque element different j'pense. dont ask why
    }
}

function doAnimate(posts, i){
    var post = posts[i]; //chaque element
    post.style.top = (-300 - i*SPACE_BETWEEN) + "px"; // Premier div commence a -100px, 2e a -200px, 3e a -300px, etc...
    post.style.left = Math.abs(Math.floor((Math.random() * window.innerWidth - 500) + 1)) + "px"; //fonction random pour la position

    moving = setInterval(function(){ // fonction qui fait repeter
        finished = moveDown(post); // call la fonction de mouvement
        if(finished == BOTTOM_LIMIT && i + 1 == posts.length){ // arreter la repetition lorsque le dernier element est en bas
            clearInterval(moving);
        }
    }, INTERVAL_SPEED);
}

function moveDown(element){
    var position = parseInt(element.style.top.replace("px", "")); // prendre la position presente
    position = (position < BOTTOM_LIMIT) ? position + MOVEMENT : BOTTOM_LIMIT; // si pas en bas, faire descendre, sinon garder en bas

    element.style.top = position + "px"; // assigner la nouvelle position
    return (position==BOTTOM_LIMIT); //retourne true si est rendu en bas
}



function myFunction() {
    alert("Facebook main feed is equivalent to a time river or stream where posts float down in a linear fashion. You’re sitting at the edge of the river and watch posts pass by.");
}
