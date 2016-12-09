$(document).ready(function() {
    //Uploading Image in AJAX mode to prevent page reloading
    $('#file-form').ajaxForm({
        success: function(data){
            //on success get images on demand
            window.getImages();
        }
    });

    //Binding Text add functionality
    $('#addText').on('click',addTextToEditor);


    //Image drop functionality
    $('.block').on('drop',function (event) {
        //prevent default to further propagate this function.
        event.preventDefault();
        // console.log(event);
        //Getting id from clipboard
        const id = event.originalEvent.dataTransfer.getData('content');
        //Pointer to Image Object
        const image = $('#'+id);
        //Custom img object to store some required properties
        let img = {
            id : id+Date.now(),
            src : image.attr('src'),
            width : image.width(),
            height : image.height(),
            positionX : event.offsetX,
            positionY : event.offsetY
        };
        //temp image object which will be used inside functions, we will play will tempImg object
        let tempImg = null;

        //Creating new Image Object, This object will be added on to canvas
        let imgObject = new Image();
        let toolBoxStyle = {
            position: 'absolute',
            bottom: "0px",
            left: "0px",
            right:"0px"
        };
        imgObject.src = img.src;
        imgObject.id = img.id;
        imgObject.height = img.height;
        imgObject.width = img.width;
        imgObject.draggable = false;
        imgObject.style.position = "absolute";
        imgObject.style.left = (img.positionX-img.width/2)+"px";
        imgObject.style.top = (img.positionY-img.height/2)+"px";

        //New Image Events binding, On clicking we will popup a tool box so that we can tweak with image object
        imgObject.onclick = function(e){
            // console.log(e);
            tempImg = this;
            let toolBoxId = "toolBox_imageEditor";
            if($("#" + toolBoxId).length == 0) {
                $('.block').append('<div id="' + toolBoxId + '" class="image-element-toolbox"></div>');
                $("#" + toolBoxId).load("views/editor-image.html",function(){
                    bindImageEditorEvents(tempImg);
                }); //load function
                $("#" + toolBoxId).css(toolBoxStyle);
            }else{
                $('#temp-image').attr('src',tempImg.src);
                bindImageEditorEvents(tempImg);
            }
        };
        // imgObject.className = "img-element";
        //adding object to block div
        $('.block').append(imgObject);
        // console.log(img);
    });

    $('.block').on('dragover',function (event) {
        event.preventDefault();
    });

    //calling getImages function when DOM is ready, 1st call
    window.getImages();
});

//We don't have drag,drop functionality for text, This function will add text on canvas/block

function addTextToEditor(event){
    //close image toolbox if being displayed
    closeImageEditor();
    // console.log(event);
    let txtId = "text_"+Date.now();
    $('.block').append('<span id="'+txtId+'" class="txt-element">Text</span>');
    //On clicking this text block we will show a toolbox to tweak with text block
    $('#'+txtId).on('click',function (ev) {
        const tempText = $(this);
        const textToolBoxId = "toolBoxTextEditor";
        if($("#" + textToolBoxId).length == 0) {
            $('.block').append('<div id="' + textToolBoxId + '" class="text-element-toolbox"></div>');
            $("#" + textToolBoxId).load("views/editor-text.html", function () {
                bindTextEditorEvents(tempText);
            }); //load function
        }else{
            bindTextEditorEvents(tempText);
        }
    });
}


//Function to bind Text edito
function bindTextEditorEvents(tempTextElement){
    closeImageEditor();
    //unbind
    $('#txt-editor-close').unbind('click');
    $('#txt-editor-remove').unbind('click');
    $('#txt-editor-text').unbind('change');
    $('#txt-editor-font').unbind('change');
    $('#txt-editor-font-bold').unbind('change');
    $('#txt-editor-font-italic').unbind('change');
    $('#txt-editor-font-underline').unbind('change');
    $('#txt-editor-text-inline').unbind('change');
    $('#txt-editor-position-x').unbind('change');
    $('#txt-editor-position-y').unbind('change');
    $('#txt-editor-color').unbind('change');
    $('#txt-editor-font-size').unbind('change');

    const labelX = $('#txt-editor-position-label-x');
    const labelY = $('#txt-editor-position-label-y');

    //console.log(tempTextElement);
    $('#txt-editor-close').on('click',closeTextEditor);
    $('#txt-editor-remove').on('click',function () {
        const textElementObj = document.getElementById(tempTextElement.context.id);
        textElementObj.parentNode.removeChild( textElementObj );
        closeTextEditor();
    });
    let textObj = {
        defaultFontFamily : tempTextElement.css('font-family'),
        text : tempTextElement.text(),
        fontSize : parseInt(tempTextElement.css('font-size')),
        position : tempTextElement.position(),
        bold : tempTextElement.css('font-weight'),
        italic : tempTextElement.css('font-style'),
        underline : tempTextElement.css('text-decoration'),
        display: tempTextElement.css('display'),
        color : tempTextElement.css('color'),
    };
    console.log(textObj);
    /* Default Values & Events */
    tempTextElement.css('position','absolute');
    tempTextElement.css('top',textObj.position.top);
    tempTextElement.css('left',textObj.position.left);
    labelX.text(textObj.position.left);
    labelY.text(textObj.position.top);
    $('#txt-editor-text').val(textObj.text);
    $('#txt-editor-text').on('change',function (event) {
        tempTextElement.text(event.target.value);
    });
    $('#txt-editor-font').val(textObj.defaultFontFamily);
    $('#txt-editor-font').on('change',function (event) {
        tempTextElement.css('font-family',event.target.value);
    });

    $('#txt-editor-font-bold')[0].checked = (textObj.bold === "bold");
    $('#txt-editor-font-bold').on('change',function (event) {
        if($(this).is(':checked')){
            tempTextElement.css('font-weight', 'bold');
        }else{
            tempTextElement.css('font-weight', 'normal');
        }
    });
    $('#txt-editor-font-italic')[0].checked = (textObj.italic === "italic");
    $('#txt-editor-font-italic').on('change',function (event) {
        if($(this).is(':checked')) {
            tempTextElement.css('font-style', 'italic');
        }else{
            tempTextElement.css('font-style', 'normal');
        }
    });
    $('#txt-editor-font-underline')[0].checked = (textObj.underline === "underline");
    $('#txt-editor-font-underline').on('change',function (event) {
        if($(this).is(':checked')){
            tempTextElement.css('text-decoration', 'underline');
        }else{
            tempTextElement.css('text-decoration', 'none');
        }
    });
    $('#txt-editor-text-inline')[0].checked = (textObj.display !== "block");
    $('#txt-editor-text-inline').on('change',function (event) {
        if($(this).is(':checked')){
            tempTextElement.css('display','inline');
        }else{
            tempTextElement.css('display','block');
        }
    });

    $('#txt-editor-position-x').val(textObj.position.left);
    $('#txt-editor-position-x').on('change',function (event) {
        labelX.text(event.target.value);
        tempTextElement.css('left',event.target.value+"px");
    });
    $('#txt-editor-position-y').val(textObj.position.top);
    $('#txt-editor-position-y').on('change',function (event) {
        labelY.text(event.target.value);
        tempTextElement.css('top',event.target.value+"px");
    });

    $('#txt-editor-color').val(rgb2hex(textObj.color));
    $('#txt-editor-color').on('change',function (event) {
       //console.log(event);
        tempTextElement.css('color',event.target.value);
    });

    $('#txt-editor-font-size').val(textObj.fontSize);
    $('#txt-editor-font-size').on('change',function (event) {
        // console.log(event);
        tempTextElement.css('font-size',event.target.value+"px");
    });
}

//By default we get rgb value via jquery, this function will convert rgb to hex color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// Image Edit events, to handle image toolbox events
function bindImageEditorEvents(tempImg){
    closeTextEditor();
    $('#temp-image').attr('src',tempImg.src);
    $('#image-editor-remove').on('click',function(){
        if(tempImg !== null) {
            const imgElement = document.getElementById(tempImg.id);
            imgElement.parentNode.removeChild(imgElement);
        }
        closeImageEditor();
    });
    $('#image-editor-close').on('click',function(){
        closeImageEditor();
    });
    const editorWidthSlider = $('#image-editor-width');
    const editorHeightSlider = $('#image-editor-height');
    const editorPositionXSlider = $('#image-editor-position-x');
    const editorPositionYSlider = $('#image-editor-position-y');
    const editorWidthLabel = $('#image-editor-label-width');
    const editorHeightLabel = $('#image-editor-label-height');
    const editorPositionXLabel = $('#image-editor-label-position-x');
    const editorPositionYLabel = $('#image-editor-label-position-y');

    /* Initial Values */
    editorWidthLabel.text(tempImg.width);
    editorWidthSlider.val(tempImg.width);
    editorHeightLabel.text(tempImg.height);
    editorHeightSlider.val(tempImg.height);
    const position = $('#'+tempImg.id).position();
    editorPositionXLabel.text(position.left);
    editorPositionXSlider.val(position.left);
    editorPositionYLabel.text(position.top);
    editorPositionYSlider.val(position.top);

    //unbinding of events
    editorWidthSlider.unbind('change');
    editorHeightSlider.unbind('change');
    editorPositionXSlider.unbind('change');
    editorPositionYSlider.unbind('change');

    editorWidthSlider.on('change',function(event){
        const width = event.target.value;
        editorWidthLabel.text(width);
        tempImg.width = width;
    });
    editorHeightSlider.on('change',function(event){
        const height = event.target.value;
        editorHeightLabel.text(height);
        tempImg.height = height;
    });
    editorPositionXSlider.on('change',function(event){
        const x = event.target.value;
        editorPositionXLabel.text(x);
        tempImg.style.left = x+"px";
    });
    editorPositionYSlider.on('change',function(event){
        const y = event.target.value;
        editorPositionYLabel.text(y);
        tempImg.style.top = y+"px";
    });
}

//Closing text editor toolbox
function closeTextEditor() {
    const textToolBoxId = "toolBoxTextEditor";
    if($("#" + textToolBoxId).length > 0) {
        const toolBoxElement = document.getElementById(textToolBoxId);
        toolBoxElement.parentNode.removeChild( toolBoxElement );
    }
}

//Closing Image editor toolbox
function closeImageEditor(){
    let toolBoxId = "toolBox_imageEditor";
    if($("#" + toolBoxId).length > 0) {
        const toolBoxElement = document.getElementById(toolBoxId);
        toolBoxElement.parentNode.removeChild( toolBoxElement );
    }
}

//Drag Start event, attached to every draggable image
function dragStart(event) {
    event.dataTransfer.setData('content',event.target.id);
    closeImageEditor();
    closeTextEditor();
};