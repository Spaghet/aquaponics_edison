var NowCamera = 1;

var NowBox = 1;

function ChangeCamera () {
    if (NowCamera == 1) {
        $("#CameraScrollBox").css("-webkit-animation","Camera1to2 0.8s ease 0s forwards");
        NowCamera = 2;
    }else{
        $("#CameraScrollBox").css("-webkit-animation","Camera2to1 0.8s ease 0s forwards");
        NowCamera = 1;
    }
}

function ChangePageTo1 () {
    if (NowBox == 2) {
        $("#HeaderBorder").css("-webkit-animation","Btn2to1 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box2to1 1s ease 0s forwards");
        NowBox = 1;
    }else if (NowBox == 3){
        $("#HeaderBorder").css("-webkit-animation","Btn3to1 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box3to1 1s ease 0s forwards");
        NowBox = 1;
    }else if (NowBox == 4){
        $("#HeaderBorder").css("-webkit-animation","Btn4to1 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box4to1 1s ease 0s forwards");
        NowBox = 1;
    }else{};
}

function ChangePageTo2 () {
    if (NowBox == 1) {
        $("#HeaderBorder").css("-webkit-animation","Btn1to2 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box1to2 1s ease 0s forwards");
        NowBox = 2;
    }else if (NowBox == 3){
        $("#HeaderBorder").css("-webkit-animation","Btn3to2 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box3to2 1s ease 0s forwards");
        NowBox = 2;
    }else if (NowBox == 4){
        $("#HeaderBorder").css("-webkit-animation","Btn4to2 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box4to2 1s ease 0s forwards");
        NowBox = 2;
    }else{};
}

function ChangePageTo3 () {
    if (NowBox == 2) {
        $("#HeaderBorder").css("-webkit-animation","Btn2to3 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box2to3 1s ease 0s forwards");
        NowBox = 3;
    }else if (NowBox == 1){
        $("#HeaderBorder").css("-webkit-animation","Btn1to3 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box1to3 1s ease 0s forwards");
        NowBox = 3;
    }else if (NowBox == 4){
        $("#HeaderBorder").css("-webkit-animation","Btn4to3 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box4to3 1s ease 0s forwards");
        NowBox = 3;
    }else{};
}

function ChangePageTo4 () {
    if (NowBox == 2) {
        $("#HeaderBorder").css("-webkit-animation","Btn2to4 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box2to4 1s ease 0s forwards");
        NowBox = 4;
    }else if (NowBox == 3){
        $("#HeaderBorder").css("-webkit-animation","Btn3to4 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box3to4 1s ease 0s forwards");
        NowBox = 4;
    }else if (NowBox == 1){
        $("#HeaderBorder").css("-webkit-animation","Btn1to4 1s ease 0s forwards");
        $("#MainScrollBox").css("-webkit-animation","Box1to4 1s ease 0s forwards");
        NowBox = 4;
    }else{};
}