alert('製作中, 尚未完成')
$(function(){
    // for(i=0;i<localStorage.length;i++){
    //     const obj = localStorage.getItem(Object.keys(localStorage)[i]);
    //     const name = obj.name;
    //     const time = obj.time;
    //     let newTime = time.toISOString().split('-').join('/').substring(0,10)
    //     newTime += `, ${time.toISOString().split('T')[1].substring(0,5)}`

    //     $('#fileList')[0].innerHTML += `
    //     <li class="fileItem  flex text-xl px-[30px] py-[18px] bg-light-main rounded-[35px] cursor-pointer">
    //         <p class="w-1/2">${name}</p>
    //         <p class="w-1/2">${newTime}</p>
    //     </li>
    //     `
    // }
})

$('#createSign').on('click',function(){
  $('#signOffcanvas').toggleClass('!hidden')
})

//簽名
const signCanvas = document.querySelector("#signCanvas");
console.log(signCanvas);
const ctx = signCanvas.getContext("2d");
const clearBtn = document.querySelector(".clear");

// 設定線條的相關數值
ctx.lineWidth = 4;
ctx.lineCap = "round";

// 設置狀態來確認滑鼠 / 手指是否按下或在畫布範圍中
let isPainting = false;

// 取得滑鼠 / 手指在畫布上的位置
function getPaintPosition(e) {
  const canvasSize = signCanvas.getBoundingClientRect();

  if (e.type === "mousemove") {
    return {
      x: e.clientX - canvasSize.left,
      y: e.clientY - canvasSize.top,
    };
  } else {
    return {
      x: e.touches[0].clientX - canvasSize.left,
      y: e.touches[0].clientY - canvasSize.top,
    };
  }
}

// 開始繪圖時，將狀態開啟
function startPosition(e) {
  e.preventDefault();
  isPainting = true;
}

// 結束繪圖時，將狀態關閉，並產生新路徑
function finishedPosition() {
  isPainting = false;
  ctx.beginPath();
}

// 繪圖過程
function draw(e) {
  // 滑鼠移動過程中，若非繪圖狀態，則跳出
  if (!isPainting) return;

  // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
  const paintPosition = getPaintPosition(e);

  // 移動滑鼠位置並產生圖案
  ctx.lineTo(paintPosition.x, paintPosition.y);
  ctx.stroke();
}

// 重新設定畫布
function reset() {
  ctx.clearRect(0, 0, signCanvas.width, signCanvas.height);
}

// event listener 電腦板
signCanvas.addEventListener("mousedown", startPosition);
signCanvas.addEventListener("mouseup", finishedPosition);
signCanvas.addEventListener("mouseleave", finishedPosition);
signCanvas.addEventListener("mousemove", draw);

// event listener 手機板
signCanvas.addEventListener("touchstart", startPosition);
signCanvas.addEventListener("touchend", finishedPosition);
signCanvas.addEventListener("touchcancel", finishedPosition);
signCanvas.addEventListener("touchmove", draw);

clearBtn.addEventListener("click", reset);

//儲存圖片
function saveImage() {
    // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
    const newImg = signCanvas.toDataURL("image/png");
    localStorage.setItem('sign0',newImg)
    // showImage.src = newImg;
  }
  
$('#saveCanvasButton').on("click", function(){
  saveImage()
  $('#signOffcanvas').toggleClass('!hidden');

  fabric.Image.fromURL(localStorage.getItem('sign0'), function (image) {
    // 設定簽名出現的位置及大小，後續可調整
    image.top = 400;
    image.scaleX = 0.5;
    image.scaleY = 0.5;
    canvas.add(image);
  });
  
});

//導覽列按鈕
$('#navbar-expand-button').on('click',function(){
    $('#navbar-expand').toggleClass('hidden')
    $('#navbar-offcanvas').toggleClass('hidden')
})

//導覽列遮版
$('#navbar-offcanvas').on('click',function(){
    $('#navbar-expand').toggleClass('hidden')
    $('#navbar-offcanvas').toggleClass('hidden')
})

//上傳檔案切換tab頁籤
$('.tab').on('click',function(){
    if($(this).hasClass('tab-active')!==true){
        $(this).toggleClass('tab-active')
        $('.tab-content').toggleClass('hidden')
        //關閉
        $(this).siblings().toggleClass('tab-active')
    }
})

//檔案超過10MB遮版
$('#file-offcanvas-close').on('click',function(){
    $('#file-offcanvas').toggleClass('!hidden')
})

//-------pdf轉換------
const Base64Prefix = "data:application/pdf;base64,";
const add = document.querySelector(".add");
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

//addEventListener
$('input').on('change',async (e) => {

    const obj  = {
        'lastModified'     : e.target.files[0].lastModified,
        'lastModifiedDate' : e.target.files[0].lastModifiedDate,
        'name'             : e.target.files[0].name,
        'size'             : e.target.files[0].size,
        'type'             : e.target.files[0].type,
        'time'             : new Date()
    };
    // console.log(obj);
    // addList(obj)
    
    // //----可行,(printPDF可正確讀取檔案),或在printPDF函式存取
    const objToFile = new File([e.target.files[0]],obj.name,obj);

    //----canvas繪製
    canvas.requestRenderAll();
    //這邊必須！要file檔案才能讀取,目前卡在拿localstroage資料失敗
    const pdfData = await printPDF(objToFile,obj.name);
    const pdfImage = await pdfToImage(pdfData);
  
    // 透過比例設定 canvas 尺寸
    canvas.setWidth(pdfImage.width / window.devicePixelRatio);
    canvas.setHeight(pdfImage.height / window.devicePixelRatio);
  
    // 將 PDF 畫面設定為背景
    canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
});

function readBlob(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () =>{
        resolve(reader.result)
        // localStorage.setItem(blob.name,reader.result)
    });
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
    });
}

async function printPDF(pdfData,name) {

    // 將檔案處理成 base64
    pdfData = await readBlob(pdfData,name);
    //範例
    // pdfData = localStorage.getItem('澎湖')


    // 將 base64 中的前綴刪去，並進行解碼
    const data = atob(pdfData.substring(Base64Prefix.length));

    // 利用解碼的檔案，載入 PDF 檔及第一頁
    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
    const pdfPage = await pdfDoc.getPage(1);

    // 設定尺寸及產生 canvas
    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // 設定 PDF 所要顯示的寬高及渲染
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
        canvasContext: context,
        viewport,
    };
    const renderTask = pdfPage.render(renderContext);

    // 回傳做好的 PDF canvas
    return renderTask.promise.then(() => canvas);
}

async function pdfToImage(pdfData) {

    // 設定 PDF 轉為圖片時的比例
    const scale = 1 / window.devicePixelRatio;

    // 回傳圖片
    return new fabric.Image(pdfData, {
        id: "renderPDF",
        scaleX: scale,
        scaleY: scale,
    });
}

// 此處 canvas 套用 fabric.js
const canvas = new fabric.Canvas("canvas");


// 按鈕功能區
$('#canvasPageButton').on('click',function(){
    $(this).attr("disabled", true)
    $(this).toggleClass('btn-secondary--hover')
    $(this).toggleClass('btn--disabled')
    $('#canvasPagenCancel').attr("disabled", false)
    $('#canvasPagenCancel').toggleClass('btn--disabled');
    $('#canvasBlock').toggleClass('!hidden')
    $('#fileSave').toggleClass('!hidden')
})

$('#canvasPagenCancel').on('click',function(){
    $('#canvasPageButton').attr("disabled", false)
    $('#canvasPagenCancel').attr("disabled", true)
    $('#canvasPageButton').toggleClass('btn--disabled')
    $(this).toggleClass('btn--disabled')
    $('#canvasBlock').toggleClass('!hidden')
    $('#fileSave').toggleClass('!hidden')
})

// list增加區
function addList(obj){
    let time = new Date()
    let newTime = time.toISOString().split('-').join('/').substring(0,10)
    newTime += `, ${time.toISOString().split('T')[1].substring(0,5)}`


    $('#fileList')[0].innerHTML += `
    <li class="fileItem  flex text-xl px-[30px] py-[18px] bg-light-main rounded-[35px] cursor-pointer">
        <p class="w-1/2">${obj.name}</p>
        <p class="w-1/2">${newTime}</p>
    </li>
    `
}