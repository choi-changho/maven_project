//=======================================================================
// Framework Area 
//=======================================================================
"use strict";
var CONST = {
    FILE_TYPE: {
        ALL: "ALL",
        IMG: "IMG",
        DOC: "DOC"
    },
    FILE_TYPE_IMG: "jpg|jpeg|gif|png",
    FILE_TYPE_VOD: "mp4|avi|mkv|wmv|m3u8",
    FILE_TYPE_SUB: "smi|srt|saa|vtt",
    FILE_ACCEPT_SUB : ['.smi', '.srt', '.saa', '.vtt'],
    AWS_FOLDER_PATH_IMG: "AWS_FOLDER_PATH_IMG",
    AWS_FOLDER_PATH_VOD: "AWS_FOLDER_PATH_VOD",
    AWS_FOLDER_PATH_SUB: "AWS_FOLDER_PATH_SUB"
}

var GV_AUTH_DEFINE = {
    "A": ".func_approval",
    "S": ".func_save",
    "D": ".func_delete"
};

var compImgId = 1;
var compImgSlidId = 1;
var deleteImageIds = [];

//=======================================================================
// 승인된 함수
//=======================================================================
$(function() {
    // form tag enter refresh disable
    $("form").submit(function() {
        return false;
    });

    //===== SideBar Hide/Show =====//
    $('.fullview').click(function() {
        $("body").toggleClass("clean");
        $('#snb').toggleClass("hide-snb");
        $('#content').toggleClass("full-content");
        $('.fullview span').toggleClass("spr_o");
        setTimeout(function() {
            GridUtils.refreshAll();
        }, 500);
    });

    //===== Menu Click =====//
    // Menu 1 Click
    $('.lnb-depth1').on('click',function () {
        if ($(this).hasClass("current") === false) {
            $('.lnb-depth1').removeClass('current');
            $(this).addClass('current');
        }
    })
    
    $(".lnb-depth2").click(function() {
        sessionStorage.setItem("GV_SRCH_PARM", '');
        if ($(this).hasClass("current") === false) {
            $('.lnb-depth2').removeClass('current');
            $(this).addClass('current');
        }
    });
    
    function setMenuPosition(url) {
        var href = "";
        var idx1 = -1;
        var idx2 = -1;
        var isMenu = false;
        
        $(".lnb-depth2").each(function(index, item) {
            href = $(item).attr("data-url");
            
            if (href.indexOf(url) > -1) {
                idx1 = $(".DB_1D").index($(item).closest(".DB_1D"));
                idx2 = $(".lnb-depth2").index($(item).closest(".lnb-depth2"));
                
                if (idx1 != -1 && idx2 != -2) {
                    $(".DB_1D .lnb-depth1").eq(idx1).trigger("click");
                    $(".lnb-depth2").eq(idx2).addClass('current');
                }
                isMenu = true;
            }
        });
        
        if (isMenu) {
            try {
                localStorage.setItem("lastUrl", url);
            } catch (e) {}
        }
    }
    setMenuPosition(GV_MENU_URL);

    // POPUP Layout Change
    if (ComUtils.nvl(GV_POPUP) == "Y") {
        //$(".content_header > h3")[0].innerHTML = "<span>" + $(".content_header > h3").html() + "</span>";
        $(".scroll").attr('class', 'pop_scroll');
        $(".scroll_inner").css("min-height", "0px");

        if (!ComUtils.isEmpty(GV_POPUP_WIDTH)) {
            $(".scroll_inner").css("min-width", (Number(GV_POPUP_WIDTH) - 30) + "px");
        } else {
            $(".scroll_inner").css("min-width", "0px");
        }
        $(".content_header").attr('class', 'pop_title');

        // 2018.12.21 수정 류재명
        // $(".button").attr('class','pop_list_button');
        $(".pop_title").find(".button").attr('class', 'pop_list_button');


        $(".pop_title > .list_button > .pop_list_button").append("<a href='javascript:self.close();'><button id='btnClose' class='btn_list ico_close' type='button'>Close</button></a>");
    } else {
        try {
            var menuName = $("#lnb > li > ul > li.DB_2D.DB_select > a")[0].innerHTML
            /*if (!$(".content_header").hasClass("in_prev")) {
                $(".content_header > h3")[0].innerHTML = menuName;
            }*/
        } catch (e) {}
    }

    $(".text_disable").each(function(i, item) {
        ComUtils.setReadOnly($(item), true);
    });

    $(document).on('keyup', '.text_uppercase', function(e) {
        $(this).val($(this).val().toUpperCase());
    });

    $(document).on('keyup', '.text_lowercase', function(e) {
        $(this).val($(this).val().toLowerCase());
    });

    /*  keyup keypress */
    $(document).on('keydown', '.text_float, .text_price, .text_number, .text_only_number', function(e) {
        var allowKey = [
            8, /* backspace */
            9, /* tab */
            46, /* del */
            48, /* 0 */
            49, /* 1 */
            50, /* 2 */
            51, /* 3 */
            52, /* 4 */
            53, /* 5 */
            54, /* 6 */
            55, /* 7 */
            56, /* 8 */
            57, /* 9 */
            17, /* control */
            45, /* - */
            189, /* _ */

            /* keypad */
            96, /* 0 */
            97, /* 1 */
            98, /* 2 */
            99, /* 3 */
            100, /* 4 */
            101, /* 5 */
            102, /* 6 */
            103, /* 7 */
            104, /* 8 */
            105, /* 9 */

            /* arrow key */
            37, /* left */
            38, /* up */
            39, /* right */
            40, /* down */

            144,
        ];
        var allow = false;

        // Allow Key check [0-9, -, ...]
        for (var i in allowKey) {
            if (e.keyCode == allowKey[i]) {
                allow = true;
            }
        }

        // Decimal separator Allow
        if ($(e.target).hasClass("text_price") || $(e.target).hasClass("text_float")) {
            if (e.key == GV_DECIMAL_SPRAT) {
                allow = true;
            }
        }

        // Control Key Allow
        var ctrlDown = (e.ctrlKey || e.metaKey);
        if (ctrlDown && (
                ComUtils.nvl(e.key).toUpperCase() == "C" ||
                ComUtils.nvl(e.key).toUpperCase() == "V" ||
                ComUtils.nvl(e.key).toUpperCase() == "X" ||
                ComUtils.nvl(e.key).toUpperCase() == "A"
            )) {
            allow = true;
        }
        // console.log("e.type = " + e.type + " Control = " + (e.ctrlKey||e.metaKey) + " e.keyCode = " + e.keyCode + " allow = " + allow + "   " + e.key);
        if (!allow) {
            e.keyCode = 0;
            e.preventDefault();
            $(e.target).val($(e.target).val().replace(/[\ㄱ-ㅎㅏ-ㅣ|가-힣]/gi, ''));
        }
    });

    // 유럽 2차 출장 - MOD-000001
    $(".text_number, .text_float, .text_price").attr('maxlength', '10');

    // 유럽 2차 출장 - MOD-000001
    $(document).on('blur', '.text_number, .text_float, .text_price', function(e) {
        $(this).val(ComUtils.numberWithCommas(this));
        // 2018.11.09 DECIMAL POINT
        // ComUtils.setValue(this, ComUtils.numberWithCommas(this));
    });

    // 유럽 2차 출장 - MOD-000001
    $(document).on('focus', '.text_number, .text_float, .text_price', function(e) {
        var num = ComUtils.getValue(this);
        // 2018.11.09 DECIMAL POINT
        /*
        if (GV_DECIMAL_POINT == ",") {
            num = num.replace(".", ",");
        }
        */
        // MOD-000042
        num = num.replace(".", GV_DECIMAL_SPRAT);
        $(this).val(num);
    });

    $(window).resize(function() {
        //
    });

    if ($("#content").length > 0) {
        addResizeListener($("#content")[0], function() {
            // GridUtils.refreshAll();
        });
    }
    
    $.each(GV_AUTH_DEFINE, function(key, value) {
        if (GV_PAGE_AUTH.indexOf(key) == -1) {
            $(value).remove();
        } else {
            $(value).show();
        }
    });
    
    $(".__jqueryDate").each(TimeUtils.makejQueryDate);
    $(".__jqueryTime").each(TimeUtils.makejQueryTime);
    $(".__jqueryTimeToSec").each(TimeUtils.makejQueryTimeToSec);
    
    // datepicker range >>>
    $("[data-js=range-start]").on("change", function() {
        $(this).siblings("[data-js=range-end]").datepicker("option", "minDate", TimeUtils.toDate(TimeUtils.getDate(this.id)));
    });
    
    $("[data-js=range-end]").on("change", function(e) {
        $(this).siblings("[data-js=range-start]").datepicker("option", "maxDate", TimeUtils.toDate(TimeUtils.getDate(this.id)));
    });
    // datepicker range <<<

    $(document).on('blur', '.__jqueryDate', function(e) {
        // console.log("DDD");
    });
    
    //frontend.js
    $('.list-selectbtn').on('click',function () {
        $(this).parents('.wpc-form-listbox').addClass('is-active');
    });
    
    $('.wpc-form-listbox').on('mouseleave',function () {
        $(this).removeClass('is-active');
    });
    
    $('.byline-btn').on('click',function () {
        $(this).parents('.byline-wrap').toggleClass('open');
    });
    
    $('.pop-closebtn').on('click',function () {
        $(this).parents('.pop-wrap').hide();
    });
    
    $('.hmg-form-select select').selectmenu();
    
    
});

function setImageInfo(compIdImg) {
    // 화면단에서 오버라이드
}

function deleteImageInfo(compId) {
    // 화면단에서 오버라이드
}

function setVideoInfo(compIdImg) {
    // 화면단에서 오버라이드 
}

function deleteVideoInfo(compId) {
    // 화면단에서 오버라이드 
}

//컴포넌트관련 함수 start
function setCompImgInfo(layoutName, data, isClick, compSort){
    var sortNo = ComUtils.nvl(compSort, data.sortNo - 1);
    if(!ComUtils.isEmpty(data.compAssetId)){
        var captionList = '';
        var assetIdList = data.compAssetId.split(',');
        if(data.compType == 'A6'){
            if(!ComUtils.isEmpty(data.height)){
                captionList = String(data.height).split(',');
            }
        }else{
            if(!ComUtils.isEmpty(data.caption)){
                captionList = ComUtils.escapeHtml(data.caption).split(',');
            }
        }
        /*
        for(var i=0; i < data.attachData.length; i++){
            var attachData = data.attachData[i];
            var fileInfo = attachData.saveFileName + '|' + attachData.attachId + '|' + attachData.orgFileName + '|' + attachData.width + '|' + attachData.height + '|' + attachData.fileSize  + '|' + attachData.fileAlt;
            $(layoutName).eq(sortNo).attr('data-fileInfo', fileInfo);
            $(layoutName).eq(sortNo).attr('data-fileNm', attachData.assetId + '/' + attachData.saveFileName);
            $(layoutName).eq(sortNo).attr('data-attachId', attachData.attachId);
            $(layoutName).eq(sortNo).attr('data-captionText', captionList[i]);
            if(isClick){
                $(layoutName).eq(sortNo).click();
            }
        }
        */
        
        //동일한 파일이 등록되었을수도 있음..
        for(var i=0; i < assetIdList.length; i++){
            for(var j=0; j < data.attachData.length; j++){
                var attachData = data.attachData[j];
                if(assetIdList[i] == attachData.attachId){
                    var fileInfo = attachData.saveFileName + '|' + attachData.attachId + '|' + attachData.orgFileName + '|' + attachData.width + '|' + attachData.height + '|' + attachData.fileSize  + '|' + attachData.fileAlt;
                    $(layoutName).eq(sortNo).attr('data-fileInfo', fileInfo);
                    $(layoutName).eq(sortNo).attr('data-fileNm', attachData.assetId + '/' + attachData.saveFileName);
                    $(layoutName).eq(sortNo).attr('data-attachId', attachData.attachId);
                    $(layoutName).eq(sortNo).attr('data-captionText', captionList[i]);
                    if(isClick){
                        $(layoutName).eq(sortNo).click();
                    }
                    break;
                }
            }
        }
        
        
        
    }
}

function setCompVdoInfo(layoutName, data, compSort){
    var sortNo = ComUtils.nvl(compSort, data.sortNo - 1);
    if(!ComUtils.isEmpty(data.compAssetId)){
        var captionList='';
        if(!ComUtils.isEmpty(data.caption)){
            captionList = ComUtils.escapeHtml(data.caption).split(',');
        }
        
        for(var i=0; i < data.attachData.length; i++){
            var attachData = data.attachData[i];
            var fileInfo = attachData.saveFileName + '|' + attachData.attachId + '|' + attachData.orgFileName + '|' + attachData.width + '|' + attachData.height;
            fileInfo += '|' + attachData.fileSize  + '|' + attachData.fileAlt;
            fileInfo += '|' + attachData.playTime;
            $(layoutName).eq(sortNo).attr('data-fileInfo', fileInfo);
            $(layoutName).eq(sortNo).attr('data-fileNm', attachData.assetId + '/' + attachData.saveFileName);
            $(layoutName).eq(sortNo).attr('data-attachId', attachData.attachId);
            $(layoutName).eq(sortNo).attr('data-captionText', captionList[i]);
        }
    }
}

function setYoutubeInfo(layoutName, data, compSort){
    var sortNo = ComUtils.nvl(compSort, data.sortNo - 1);
    
    var fileInfo = data.url + '|' + data.caption;
    
    if(!ComUtils.isEmpty(data.compAssetId)){
        var attachData = data.attachData[0];
        if(!ComUtils.isEmpty(attachData)){
            fileInfo = ComUtils.nvl(attachData.ytLink, data.url) + '|' + data.caption;
            fileInfo += '|' + attachData.saveFileName + '|' + attachData.attachId + '|' + attachData.orgFileName + '|' + attachData.width + '|' + attachData.height;
            $(layoutName).eq(sortNo).attr('data-fileNm', attachData.assetId + '/' + attachData.saveFileName);
            $(layoutName).eq(sortNo).attr('data-attachId', attachData.attachId);
        }
    }
    $(layoutName).eq(sortNo).attr('data-fileInfo', fileInfo);
    
}

function selectComponentType(componentRoot, typeValue){
    var selectTypeForm = componentRoot.find("div[name=selectTypeForm]");
    componentHide(selectTypeForm);
    if(typeValue == '1'){
        selectTypeForm.find("div[name=selectSubType1]").removeClass('comp-hide');
        selectTypeForm.find("div[name=selectSubType2]").addClass('comp-hide');
        selectTypeForm.find("div[name=typeFull]").removeClass('comp-hide');
        selectTypeForm.find("div[name=typeNoFull]").addClass('comp-hide');
    }else{
        selectTypeForm.find("div[name=selectSubType1]").addClass('comp-hide');
        selectTypeForm.find("div[name=selectSubType2]").removeClass('comp-hide');
        selectTypeForm.find("div[name=typeFull]").addClass('comp-hide');
        selectTypeForm.find("div[name=typeNoFull]").removeClass('comp-hide');
    }
}

function selectComponentLayout(componentRoot, selectValue){
    var selectTypeForm = componentRoot.find("div[name=selectTypeForm]");
    
    selectTypeForm.find("div[name=typeFull]").hide();
    selectTypeForm.find("div[name=typeNoFull]").hide();
    
    if(!ComUtils.isEmpty(selectValue)){
        componentHide(selectTypeForm);
        if(selectValue == 'A5' || selectValue == 'A6' || selectValue == 'B2'){
            if(componentRoot.find("div[name="+selectValue+"]").hasClass('comp-hide')){
                var target;
                if(selectValue == 'B2'){
                    target = 'B2Left';
                }else{
                    target = selectValue;
                }
                
                var fileNm = componentRoot.find("div[name="+target+"]").attr('data-fileNm');
                var attachId = componentRoot.find("div[name="+target+"]").attr('data-attachId');
                var captionText = componentRoot.find("div[name="+target+"]").attr('data-captionText');
                var fileInfo = componentRoot.find("div[name="+target+"]").attr('data-fileInfo');
                
                var html = '<component name="'+target+'Component" component-id="'+target+'ImageUr1'+ComUtils.getCompImgId()+'" component-type="imageSelect" component-src="'+fileNm+'" component-attachId="'+attachId+'"';
                html += ' component-class="story-image-thumbnail-box"';
                html += ' component-fileInfo="'+fileInfo+'"';
                html += ' contents-return-func="compImageReturn"';
                //html += ' contents-return-func="component'+selectValue+'Return"';
                html += ' component-caption="'+captionText+'" >';
                html += '</component>';
                
                if(selectValue == 'A5' || selectValue == 'B2'){
                    html += '<p class="file-info">-최소 Width 1240px</p>';
                }else if(selectValue == 'A6'){
                    html += '<p class="file-info">-최소 Width 1920px</p>';
                }
                
                componentRoot.find("div[name="+selectValue+"] .story-image-box").append(html);
                componentRoot.find("div[name="+target+"]").attr('data-fileInfo', '');
                componentRoot.find("div[name="+target+"]").attr('data-fileNm', '');
                componentRoot.find("div[name="+target+"]").attr('data-attachId', '');
                componentRoot.find("div[name="+target+"]").attr('data-captionText', '');
                componentRoot.find("div[name="+target+"]").removeClass('comp-hide');
                componentRoot.find("div[name="+selectValue+"]").removeClass('comp-hide');
            }
        }else if(selectValue == 'A10' || selectValue == 'A11' || selectValue == 'B4'){
            if(componentRoot.find("div[name="+selectValue+"]").hasClass('comp-hide')){
                var target = selectValue;
                if(selectValue == 'B4'){
                    target = 'B4Left';
                }
                
                var fileNm = componentRoot.find("div[name="+target+"]").attr('data-fileNm');
                var attachId = componentRoot.find("div[name="+target+"]").attr('data-attachId');
                var captionText = componentRoot.find("div[name="+target+"]").attr('data-captionText');
                var fileInfo = componentRoot.find("div[name="+target+"]").attr('data-fileInfo');
                var html = '<component name="'+target+'Component" component-id="'+target+'ImageUr1'+ComUtils.getCompImgId()+'" component-type="videoSelectComponent" component-attachId="'+attachId+'"';
                html += ' component-fileInfo="'+fileInfo+'"';
                html += ' component-src="'+fileNm+'"';
                html += ' contents-return-func="compVideoReturn"';
                html += ' component-caption="'+captionText+'"';
                html += '></component>';
                
                componentRoot.find("div[name="+selectValue+"] .story-image-box").append(html);
                componentRoot.find("div[name="+target+"]").attr('data-fileInfo', '');
                componentRoot.find("div[name="+target+"]").attr('data-fileNm', '');
                componentRoot.find("div[name="+target+"]").attr('data-attachId', '');
                componentRoot.find("div[name="+target+"]").attr('data-captionText', '');
                componentRoot.find("div[name="+target+"]").removeClass('comp-hide');
                componentRoot.find("div[name="+selectValue+"]").removeClass('comp-hide');
            }
        }
        
        selectTypeForm.find("div[name="+selectValue+"]").removeClass('comp-hide');
        selectTypeForm.children("div[name="+selectValue+"]").show();
        Component.render();
    }
}

function componentHide(selectTypeForm){
    selectTypeForm.children("div[name^=A]").each(function(){
        $(this).hide();
    });
    
    selectTypeForm.children("div[name^=B]").each(function(){
        $(this).hide();
    });
}

function compImageReturn(returnData){
    var imgId = returnData.split('|')[2];
    var data = {};
    data.assetId = returnData.split('|')[0];
    data.langCd = returnData.split('|')[1];
    data.assetType = 'I';
    
    ComUtils.callAjax(GV_CTX+'/admin/asset/getAssetInfo.do', data, function( resp ){
        if (resp.result == "T") {
            var data = resp.data;
            $("#"+imgId+"Img").attr('src', GV_ASSETS_CONTENTS_URL + "/" + data.assetId + "/" + data.imgSaveName);
            ComUtils.setValue(imgId, data.imageId);
            ComUtils.setText(imgId+'FileName', "파일명 : " + data.imgOrgName);
            ComUtils.setText(imgId+'WxH', "해상도 : " + data.imgWidthHeight+' px');
            ComUtils.setText(imgId+'Size', "용량 : " + ComUtils.fileSize(data.imgSize));
            ComUtils.setText(imgId+'AltText', "대체 텍스트 : " + ComUtils.nvl(data.imgAlt));
        } else {
            ComUtils.alert(resp);
        }
    });
}

function compVideoReturn(returnData){
    var layoutId = returnData.split('|')[2];
    var data = {};
    data.assetId = returnData.split('|')[0];
    data.langCd = returnData.split('|')[1];
    data.assetType = 'V';
    
    ComUtils.callAjax(GV_CTX+'/admin/asset/getAssetInfo.do', data, function( resp ){
        if (resp.result == "T") {
            var data = resp.data;
            var parentComp = $("#"+layoutId).closest("component");
            
            var fileSrc;
            if(layoutId.startsWith("A11")){
                fileSrc = data.assetId + '/' + data.imgSaveName;
            }else{
                fileSrc = data.assetId + '/' + data.vdoSaveName;
            }
            
            parentComp.attr('component-render', '');
            parentComp.attr('component-src', fileSrc);
            Component.render();
            ComUtils.setValue(layoutId, data.videoId);
            ComUtils.setText(layoutId+'FileName', "파일명 : " + data.vdoOrgName);
            ComUtils.setText(layoutId+'WxH', "해상도 : " + data.vdoWidthHeight+' px');
            ComUtils.setText(layoutId+'Size', "용량 : " + ComUtils.fileSize(data.vdoSize));
            ComUtils.setText(layoutId+'Length', "영상길이 : " + data.playTime);
            ComUtils.setText(layoutId+'AltText', "대체 텍스트 : " + ComUtils.nvl(data.vdoAlt));
            
            ComUtils.setValue(layoutId+'Url', data.ytLink);
            ComUtils.setValue(layoutId+'Caption', ComUtils.nvl(data.vdoAlt));
        } else {
            ComUtils.alert(resp);
        }
    });
}
//컴포넌트관련 함수 end

var Component = {
    render: function() {
        $("component").each(function(index, item) {
            if (ComUtils.isEmpty($(item).attr("component-render"))) {
                var compType = $(item).attr("component-type");
                var compId = $(item).attr("component-id");
                var compStyle = ComUtils.nvl($(item).attr("component-style"));
                var compAccept = $(item).attr("component-accept");
                var compSrc = $(item).attr("component-src");
                var compAttachId = $(item).attr("component-attachId");
                var compMultiple = $(item).attr("component-multiple");
                var compDelYn = $(item).attr("component-del");
                var compCaption = $(item).attr("component-caption");
                var compClass = $(item).attr("component-class");
                var compFileInfo = $(item).attr("component-fileInfo");
                var returnFunc = ComUtils.nvl($(item).attr("contents-return-func"));
                var storyYn = ComUtils.nvl($(item).attr("component-story"), "Y");
                
                if(ComUtils.isEmpty(compAttachId)){
                    compAttachId = "";
                }
                
                if(ComUtils.isEmpty(compMultiple)){
                    compMultiple = "";
                }

                var contsType = $(item).attr("contents-type");
                var returnFunc = ComUtils.nvl($(item).attr("contents-return-func"));

                if (ComUtils.isEmpty(compAccept)) {
                    if (compType == "imageUpload" || compType == "imageSelect") {
                        $(item).attr("component-accept", CONST.FILE_TYPE_IMG);
                    } else if (compType == "subtitleUpload") {
                        $(item).attr("component-accept", CONST.FILE_TYPE_SUB);
                    } else if (compType == "videoUpload" || compType == "videoSelect") {
                        $(item).attr("component-accept", CONST.FILE_TYPE_VOD);
                    }
                }

                var html = '';
                //----------------------------------
                // imageUpload
                //----------------------------------
                if (compType == "contents") {
                    html += "<div style=\"display:inline-block;position:relative;\">";
                    html += "    <input type=\"hidden\" id=\"" + compId + "\" name=\"" + compId + "\">";
                    html += "    <img id=\"" + compId + "Img\" src='" + GV_CTX + "/resources/assets/img/common/noImage.png' style='" + compStyle + "'>";
                    html += "    <div style=\"position:absolute;right:5px;bottom:5px;\">";
                    html += "        <img style=\"cursor: pointer\" src=\"" + GV_CTX + "/resources/assets/img/button/ico_change.png\" onclick=\"ComUtils.contentSearch('" + compId + "', '" + contsType + "', '" + returnFunc + "')\">";
                    html += "        <img style=\"cursor: pointer\" src=\"" + GV_CTX + "/resources/assets/img/button/ico_preview.png\" onclick=\"ComUtils.contentPreview('" + compId + "', '" + contsType + "')\">";
                    //                        html += "        <button class=\"btn_list ico_change insert func_save\" style=\"background-color:#ffffff;\" type=\"button\" onClick=\"ComUtils.contentSearch('"+compId+"', '"+contsType+"', '"+returnFunc+"')\">Change</button>";
                    //                        html += "        <button class=\"btn_list ico_preview  insert func_save\" style=\"background-color:#ffffff;\" type=\"button\" onClick=\"ComUtils.contentPreview('"+compId+"', '"+contsType+"')\">Preview</button>";
                    html += "    </div>";
                    html += '<button type="button" class="btn_close" style="display:none;"></button>';
                    html += "</div>";
                } else if (compType == "imageUpload") {
                    html += '<div style="display:inline-block;position:relative;">';
                    html += '   <input type="file" id="' + compId + '" name="' + compId + '" style="display: none;" '+compMultiple+'>';
                    if(ComUtils.isEmpty(compSrc)){
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png" style="' + compStyle + '">';
                    }else{
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc +'" style="' + compStyle + '">';
                    }
                    html += '   <input type="hidden" name="'+compId+'AttachId" value="' + compAttachId + '">';
                    
                    html += '   <div style="position:absolute;right:5px;bottom:5px;">';
                    html += '       <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_change.png" onclick="Component.imgChange(\'' + compType + '\', \'' + compId + '\')">';
                    html += '   </div>';
                    
                    //삭제기능
                    if(!ComUtils.isEmpty(compDelYn)){
                        if (storyYn == "N") {
                            html += '   <div style="position:absolute;right:5px;top:5px;">';
                            html += '       <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_del.png" onclick="deleteImageInfo(\'' + compId + '\')">';
                            html += '   </div>';
                        } else {
                            html += '   <div style="position:absolute;right:5px;top:5px;">';
                            html += '       <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_del.png" onclick="Component.imgDelete(\'' + compType + '\', \'' + compId + '\', \'' + compAttachId +'\')">';
                            html += '   </div>';
                        }
                    }
                    
                    html += '<button type="button" class="btn_close" style="display:none;"></button>';
                    html += '</div>';
                    html += '<div style="display:inline-block;">';
                    if(!ComUtils.isEmpty(compCaption)){
                        html += '   <div>';
                        var captionText = compCaption.replaceAll('@@@', ',');
                        html += '       <p>캡션 <input name="captionText" class="no-sort" placeholder="텍스트를 입력하세요." value="'+captionText+'"></p>';
                        
                        html += '       파일명 : <p></p>';
                        html += '       해상도 : <p></p>';
                        html += '       용량 : <p></p>';
                        html += '       대체텍스트 : <p></p>';
                        html += '   </div>';
                    }
                    html += '</div>';
                    html += '<br/>';
                } else if (compType == "imageMainSelect") {
                    //상세 메인 이미지 선택(스토리)
                    html += '<div class="main-contents-preview">';
                    html += '   <div id ="key_'+ compId +'" class="'+compClass+'">'
                    html += '       <input type="hidden" id="'+compId+'" name="'+compId+'" value="' + compAttachId + '">';
                    if(ComUtils.isEmpty(compSrc)){
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png" style="' + compStyle + '">';
                    }else{
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc +'" style="' + compStyle + '">';
                    }
                    html += '       <button type="button" onclick="Component.imgSelect(\'' + compType + '\', \'' + compId + '\', \''+ returnFunc + '\')" class="file-upload-btn">file upload</button>';
                    if(!ComUtils.isEmpty(compDelYn)){
                        html += '       <div style="position:absolute;right:5px;top:5px;">';
                        html += '           <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_del.png" onclick="imgMainDelete(\'' + compType + '\', \'' + compId + '\', \'' + compAttachId +'\')">';
                        html += '       </div>';
                    }
                    html += '   </div>';
                    html += '</div>';
                    
                    var fileName = '';
                    var fileWxH = '';
                    var fileSize = '';
                    var fileAlt = '';
                    
                    if(!ComUtils.isEmpty(compFileInfo)){
                        try{
                            fileName = '파일명 : ' + compFileInfo.split('|')[0];
                            fileWxH = '해상도 : ' + compFileInfo.split('|')[1] + ' * ' + compFileInfo.split('|')[2];
                            fileSize = '용량 : ' + ComUtils.fileSize(compFileInfo.split('|')[3]);
                            fileAlt = '대체텍스트 : ' + ComUtils.nvl(compFileInfo.split('|')[4]);
                        } catch (e) {}
                    }
                    
                    
                    html += '<div class="main-file-info">';
                    if(!ComUtils.isEmpty(compFileInfo)){
                        html += '   <span id="' + compId + 'FileName">'+fileName+'</span>';
                        html += '   <span id="' + compId + 'FileWxH">'+fileWxH+'</span>';
                        html += '   <span id="' + compId + 'FileSize">'+fileSize+'</span>';
                        html += '   <span id="' + compId + 'FileAlt">'+fileAlt+'</span>';
                    }else{
                        html += '   <span id="' + compId + 'FileName"></span>';
                        html += '   <span id="' + compId + 'FileWxH"></span>';
                        html += '   <span id="' + compId + 'FileSize"></span>';
                        html += '   <span id="' + compId + 'FileAlt"></span>';
                    }
                    html += '</div>';
                    
                } else if (compType == "imageSlideSelect") {
                    //컴포넌트 이미지 선택(슬라이드)
                    var captionText = '';
                    var fileName = '';
                    var fileWxH = '';
                    var fileSize = '';
                    var fileAlt = '';
                    
                    if(!ComUtils.isEmpty(compCaption)){
                        captionText = compCaption.replaceAll('@@@', ',');
                    }
                    if(!ComUtils.isEmpty(compFileInfo)){
                        try{
                            fileName = '파일명 : ' + compFileInfo.split('|')[2];
                            fileWxH = '해상도 : ' + compFileInfo.split('|')[3] + ' * ' + compFileInfo.split('|')[4];
                            fileSize = '용량 : ' + ComUtils.fileSize(compFileInfo.split('|')[5]);
                            fileAlt = '대체텍스트 : ' + ComUtils.nvl(compFileInfo.split('|')[6]);
                        } catch (e) {}
                    }
                    
                    html += '<li>';
                    html += '   <div class="slide-handler">handler</div>';
                    html += '   <div class="story-image-box">';
                    html += '       <div class="story-image-thumbnail-wrap">';
                    html += '           <div class="story-image-thumbnail-box">';
                    html += '           <input type="hidden" id="'+compId+'" name="'+compId+'" value="' + compAttachId + '">';
                    if(ComUtils.isEmpty(compSrc)){
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png">';
                    }else{
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc +'">';
                    }
                    html += '               <button type="button" onclick="Component.imgSelect(\'' + compType + '\', \'' + compId + '\', \''+ returnFunc + '\')" class="file-upload-btn">file-upload</button>';
                    html += '           </div>';
                    html += '           <p class="file-info">- 권장비율 16:9 / 최소 width 1030px</p>';
                    html += '       </div>';
                    html += '       <div class="story-infotext-wrap">';
                    html += '           <div class="hmg-form-input type-labeluse">';
                    html += '               <label for="text91">캡션</label>';
                    html += '               <input type="text" name="captionText" value="'+ComUtils.escapeHtml(ComUtils.unescapeHtml(captionText))+'">';
                    html += '           </div>';
                    html += '           <span id="'+compId+'FileName">'+fileName+'</span>';
                    html += '           <span id="'+compId+'WxH">'+fileWxH+'</span>';
                    html += '           <span id="'+compId+'Size">'+fileSize+'</span>';
                    html += '           <span id="'+compId+'AltText">'+fileAlt+'</span>';
                    html += '       </div>';
                    html += '   </div>';
                    html += '   <button type="button" class="slide-delbtn" onclick="Component.imgDelete(\'' + compType + '\', \'' + compId + '\', \'' + compAttachId +'\')">delete</button>';
                    html += '</li>'
                } else if (compType == "imageSelect") {
                    //컴포넌트 이미지 선택
                    if (storyYn != "N") {
                        html += '<div class="story-image-thumbnail-wrap">'
                    }
                    html += '   <div class="'+compClass+'">';
                    html += '       <input type="hidden" id="'+compId+'" name="'+compId+'" value="' + compAttachId + '">';
                    
                    if (storyYn == "N") {
                        if(ComUtils.isEmpty(compSrc)){
                            html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png" style="' + compStyle + '">';
                        }else{
                            html += '   <img id="' + compId + 'Img" src="' + GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc +'" style="' + compStyle + '">';
                        }   
                    } else {
                        if(ComUtils.isEmpty(compSrc)){
                            html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png">';
                        }else{
                            html += '   <img id="' + compId + 'Img" src="' + GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc +'">';
                        }    
                    }
                    html += '       <button type="button" onclick="Component.imgSelect(\'' + compType + '\', \'' + compId + '\', \''+ returnFunc + '\')" class="file-upload-btn">file upload</button>';
                    //삭제기능
                    if(!ComUtils.isEmpty(compDelYn)){
                        if (storyYn == "N") {
                            html += '   <div style="position:absolute;right:5px;top:5px;">';
                            html += '       <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_del.png" onclick="deleteImageInfo(\'' + compId + '\')">';
                            html += '   </div>';
                        } else {
                            html += '   <div style="position:absolute;right:5px;top:5px;">';
                            html += '       <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_del.png" onclick="Component.imgDelete(\'' + compType + '\', \'' + compId + '\', \'' + compAttachId +'\')">';
                            html += '   </div>';
                        }
                    }
                    html += '   </div>';
                    html += '</div>';

                    var captionText = '';
                    var fileName = '';
                    var fileWxH = '';
                    var fileSize = '';
                    var fileAlt = '';
                    
                    if(!ComUtils.isEmpty(compCaption)){
                        captionText = compCaption.replaceAll('@@@', ',');
                    }
                    
                    if(!ComUtils.isEmpty(compFileInfo)){
                        try{
                            fileName = '파일명 : ' + compFileInfo.split('|')[2];
                            fileWxH = '해상도 : ' + compFileInfo.split('|')[3] + ' * ' + compFileInfo.split('|')[4];
                            fileSize = '용량 : ' + ComUtils.fileSize(compFileInfo.split('|')[5]);
                            fileAlt = '대체텍스트 : ' + ComUtils.nvl(compFileInfo.split('|')[6]);
                        } catch (e) {}
                    }
                    
                    if(compId.startsWith("A5") || compId.startsWith("B2") ){
                        html += '<div class="story-infotext-wrap">';
                        html += '   <div class="hmg-form-input type-labeluse">';
                        html += '       <label for="text99">캡션</label>';
                        html += '       <input type="text" name="captionText" value="'+ComUtils.escapeHtml(ComUtils.unescapeHtml(captionText))+'">';
                        html += '   </div>';
                        html += '   <span id="'+compId+'FileName">'+fileName+'</span>';
                        html += '   <span id="'+compId+'WxH">'+fileWxH+'</span>';
                        html += '   <span id="'+compId+'Size">'+fileSize+'</span>';
                        html += '   <span id="'+compId+'AltText">'+fileAlt+'</span>';
                        html += '</div>';
                    }else if(compId.startsWith("A6") ){
                        html += '<div class="story-infotext-wrap">';
                        html += '   <div class="hmg-form-input type-infotext">';
                        html += '       <label for="text99">컨테이너 height</label>';
                        html += '       <input type="text" name="compHeight" value="'+captionText+'">';
                        html += '       <em>px</em>';
                        html += '       <span>* 지정된 높이값 안에서 패럴럭스 효과로 이미지가 제공되므로, 실제 이미지보다 작은 값을 지정해주세요.</span>';
                        html += '   </div>';
                        html += '   <span id="'+compId+'FileName">'+fileName+'</span>';
                        html += '   <span id="'+compId+'WxH">'+fileWxH+'</span>';
                        html += '   <span id="'+compId+'Size">'+fileSize+'</span>';
                        html += '   <span id="'+compId+'AltText">'+fileAlt+'</span>';
                        html += '</div>';
                    }
                } else if (compType == "videoSelect") {
                    html += '<div id = "key_'+ compId +'"class="'+compClass+'">';
                    html += '   <input type="file" id="' + compId + '" name="' + compId + '" style="display: none;">';
                    if(ComUtils.isEmpty(compSrc)){
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png" style="' + compStyle + '">';
                    }else{
                        //html += '<video playsinline id="'+compId+'Video" class="video-js " controls="false" preload="auto" autoplay loop muted>';
                        //html += 'poster="'+ComUtils.getFullUrl(kvCompositeVo.posterUrl)+'" muted>';
                        // 2012.12.16 파일 업로드 AWS업로드시 "포스터이미지|AWS Cloud Front 전체 URL" 으로 전달 될 경우 포스터 이미지 표시 그 외에는 기존대로 처리
                        if (compSrc.split('|').length == 2) {
                            var videoPoster = compSrc.split('|')[0];
                            var videoSrc = compSrc.split('|')[1];
                            html += '<video playsinline id="'+compId+'Video" class="video-js " controls="false" preload="auto" autoplay loop muted poster="'+videoPoster+'" style="width: 300px; height: 128px;">';
                            html += '<source src="'+ videoSrc +'" type="'+ComUtils.getVideoType(videoSrc)+'">';
                        } else {
                            html += '<video playsinline id="'+compId+'Video" class="video-js " controls="false" preload="auto" autoplay loop muted>';
                            html += '<source src="'+(GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc)+'" type="'+ComUtils.getVideoType(GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc)+'">';
                        }
                        //html += '<source src="'+compSrc+'" type="'+ComUtils.getVideoType(compSrc)+'">';
                        html += '</video>';
                    }
                    html += '   <button type="button" onclick="Component.vdoSelect(\'' + compType + '\', \'' + compId + '\', \''+ returnFunc + '\')" class="file-upload-btn">file upload</button>';
                    if(!ComUtils.isEmpty(compDelYn)){
                        html += '       <div style="position:absolute;right:5px;top:5px;">';
                        html += '           <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_del.png" onclick="deleteVideoInfo(\'' + compId + '\')">';
                        html += '       </div>';
                    }
                    html += '</div>';
                    
                } else if (compType == "videoSelectComponent") {
                    //컴포넌트에서 비디오 선택
                    var captionText = '';
                    var fileName = '';
                    var fileWxH = '';
                    var fileSize = '';
                    var fileLength = '';
                    var fileAlt = '';
                    
                    if(!ComUtils.isEmpty(compCaption)){
                        captionText = compCaption.replaceAll('@@@', ',');
                    }
                    
                    if(!ComUtils.isEmpty(compFileInfo)){
                        try{
                            if(compId.startsWith("A10") || compId.startsWith("B4")){
                                fileName = '파일명 : ' + compFileInfo.split('|')[2];
                                fileWxH = '해상도 : ' + compFileInfo.split('|')[3] + ' * ' + compFileInfo.split('|')[4];
                                fileSize = '용량 : ' + ComUtils.fileSize(compFileInfo.split('|')[5]);
                                fileLength = '영상 길이 : ' + TimeUtils.convertPlayTimeFormat(compFileInfo.split('|')[7]);
                                fileAlt = '대체텍스트 : ' + ComUtils.nvl(compFileInfo.split('|')[6]);
                            }else{
                                fileName = compFileInfo.split('|')[0];
                                fileWxH = ComUtils.nvl(compFileInfo.split('|')[1]);
                            }
                        } catch (e) {}
                    }
                    
                    html += '<div class="story-image-thumbnail-wrap">';
                    html += '   <div class="story-video-thumbnail-box">';
                    html += '    <input type="hidden" id="'+compId+'" name="'+compId+'" value="' + compAttachId + '">';
                    
                    if(ComUtils.isEmpty(compSrc)){
                        html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png" style="' + compStyle + '">';
                    }else{
                        
                        if(compId.startsWith("A11") ){
                            html += '   <img id="' + compId + 'Img" src="' + GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc +'" style="' + compStyle + '">';
                        }else{
                            html += '<video playsinline id="hyundai_video_1" class="video-js " controls="false" preload="auto" autoplay loop muted>';
                            html += '<source src="'+(GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc)+'" type="'+ComUtils.getVideoType(GV_CTX + GV_ASSETS_CONTENTS_URL + '/' + compSrc)+'">';
                            html += '</video>';
                        }
                        
                    }
                    if(compId.startsWith("A11") ){
                        html += '       <button type="button" onclick="Component.vdoSelect(\'' + compType + '\', \'' + compId + '\', \''+ returnFunc + '\', \'Y\')" class="file-upload-btn">file upload</button>';
                    }else{
                        html += '       <button type="button" onclick="Component.vdoSelect(\'' + compType + '\', \'' + compId + '\', \''+ returnFunc + '\')" class="file-upload-btn">file upload</button>';
                    }
                    
                    html += '   </div>';
                    html += '</div>';
                    html += '<div class="story-infotext-wrap">';
                    if(compId.startsWith("A10") || compId.startsWith("B4") ){
                        html += '   <div class="hmg-form-input type-labeluse">';
                        html += '       <label for="text82">캡션</label>';
                        html += '       <input type="text" name="captionText" value="'+ComUtils.escapeHtml(ComUtils.unescapeHtml(captionText))+'">';
                        html += '   </div>';
                        html += '   <span id="'+compId+'FileName">'+fileName+'</span>';
                        html += '   <span id="'+compId+'WxH">'+fileWxH+'</span>';
                        html += '   <span id="'+compId+'Size">'+fileSize+'</span>';
                        html += '   <span id="'+compId+'Length">'+fileLength+'</span>';
                        html += '   <span id="'+compId+'AltText">'+fileAlt+'</span>';
                        
                    }else if(compId.startsWith("A11") ){
                        html += '<div class="hmg-form-input type-labeluse">';
                        html += '    <label for="text81">url</label>';
                        html += '    <input type="text" id="'+compId+'Url" name="youtubeUrl" value="'+fileName+'">';
                        html += '</div>';
                        html += '<div class="hmg-form-input type-labeluse">';
                        html += '    <label for="text80">캡션</label>';
                        html += '    <input type="text" id="'+compId+'Caption" name="youtubeCaption" value="'+fileWxH+'">';
                        html += '</div>';
                    }
                    html += '</div>';
                } else if (compType == "videoUpload") {
                    html += '<div style="display:inline-block;position:relative;">';
                    html += '   <input type="file" id="' + compId + '" name="' + compId + '" style="display: none;">';
                    html += '   <img id="' + compId + 'Img" src="' + GV_CTX + '/resources/assets/img/common/noImage.png" style="' + compStyle + '">';
                    html += '   <div style="position:absolute;right:5px;bottom:5px;">';
                    html += '       <img style="cursor:pointer" src="' + GV_CTX + '/resources/assets/img/button/ico_change.png" onclick="Component.imgChange(\'' + compType + '\', \'' + compId + '\', \''+ returnFunc + '\')">';
                    html += '   </div>';
                    html += '<button type="button" class="btn_close" style="display:none;"></button>';
                    html += '</div>';
                }
                //----------------------------------
                // subtitleUpload
                //----------------------------------
                else if (compType = "subtitleUpload") {
                    html += '<input type="file" id="' + compId + '" name="' + compId + '">';
                    html += '<a id="' + compId + 'Txt" href=""></a>';
                    html += '<a id="deleteSubtitle" style="display:none;">DEL</a>';
                }
                
                $(item)[0].innerHTML = html;
                
                //이미지슬라이드 sort를 위해
                if (compType == "imageSlideSelect") {
                    $("component > li").unwrap();
                }
                
                if (compType == "imageUpload" || compType == "imageSelect" || compType == "subtitleUpload" || compType == "videoUpload" || compType == "videoSelect") {
                    $("#" + compId)[0].accept = "." + $(item).attr("component-accept").replaceAll("|", ",.");
                    $("#" + compId)[0].addEventListener("change", Component.fileChangeHandler, false);
                }
            }
            $(item).attr("component-render", "finish");
        });
    },
    imgChange: function(compType, compId) {
        $("#" + compId).trigger("click");
    },
    imgSelect: function(type, id, resultFunc) {
        var param = {
                "id": id
                ,"type": type
                ,"resultFunc": resultFunc
                ,"langCd" : ComUtils.getValue("langCd")
        };        
        ComUtils.popup(GV_CTX+'/admin/popup/assetImagePop.view', param, 1380, 380);
    },
    imgDelete : function(compType, compId, compAttachId) {
        if(!ComUtils.isEmpty(compAttachId)){
            deleteImageIds.push(compAttachId);
        };
        $("#" + compId).closest("li").remove();
    },
    vdoSelect: function(type, id, resultFunc, isYoutube) {
        var param = {
                "id": id
                ,"type": type
                ,"resultFunc": resultFunc
                ,"isYoutube" : ComUtils.nvl(isYoutube)
                ,"langCd" : ComUtils.getValue("langCd")
        };
        ComUtils.popup(GV_CTX+'/admin/popup/assetVideoPop.view', param, 1380, 810);
    },    
    fileChangeHandler: function(e) {
        var comp = $(e.target).closest("component");
        var compType = comp.attr("component-type");
        var compId = comp.attr("component-id");
        var compAccept = comp.attr("component-accept");
        var files = e.target.files || e.dataTransfer.files;
        if (files && files[0]) {
            var chk = Component.validCheck(files[0], compAccept);
            if (!chk) {
                $(e.target).val('').clone(true);
                return;
            }
            
            if (compType == "imageUpload") {
                var compIdImg = compId + "Img";
                Component.showImage(files[0], compIdImg);
            } else if (compType == "videoUpload" || compType == 'videoSelect') {
                var compIdImg = compId + "Img";
                // 동영상 대용량으로 로딩바 표시, 해상도, 용량, 영상길이 얻을 때까지 대기
                ComUtils.showLoading(); 
                Component.showVideo(files[0], compId);
            } else if (compType == "subtitleUpload") {
                $("#" + compId + "Txt").attr("href", "");
//                $("#" + compId + "Txt")[0].innerHTML = "";
                $("#" + compId + "Txt")[0].innerHTML = files[0].name;
            }
        } else {
            if (compType == "subtitleUpload") {
                $("#" + compId + "Txt")[0].innerHTML = "";
            }
        }
    },
    showImage: function(file, compIdImg) {
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#' + compIdImg).attr('src', e.target.result);
                /* 2021.09.01 Baik : data 추가 */
                var img = new Image();
                var urlObj = URL.createObjectURL(file);
                img.src = urlObj;
                img.onload = function() {
                    var imgWidth = img.width;
                    var imgHeight = img.height;
                    $('#' + compIdImg).attr('data-filename', file.name);  // 파일명
                    $('#' + compIdImg).attr('data-filesize', file.size);  // 파일크기
                    $('#' + compIdImg).attr('data-width', imgWidth);      // 해상도 너비
                    $('#' + compIdImg).attr('data-height', imgHeight);    // 해상도 높이
                    URL.revokeObjectURL(urlObj);
                    setImageInfo(compIdImg);  
                } 
                /*// 2021.09.01 Baik */
            } 
            reader.readAsDataURL(file);
        } 
    }, 
    showVideo: function(file, compId) {
        if (file) {
            var fileReader = new FileReader();
            fileReader.onload = function() {
                var blob = new Blob([fileReader.result], {
                    type: file.type
                });
                var url = URL.createObjectURL(blob);
                var video = document.createElement('video');
                var timeupdate = function() {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                        video.pause();
                    }
                };
                video.addEventListener('loadeddata', function() {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                    }
                });
                var snapImage = function() {
                    var canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    var image = canvas.toDataURL();
                    var success = image.length > 100000;
                    if (success) {
                        var compIdImg = compId + "Img";
                        $('#' + compIdImg).attr('src', image);
                        /* 2021.09.01 Baik : data 추가 */
                        $('#' + compIdImg).attr('data-filename', file.name);            // 파일명
                        $('#' + compIdImg).attr('data-filesize', file.size);            // 파일크기
                        $('#' + compIdImg).attr('data-duration', video.duration);       // 재생시간
                        $('#' + compIdImg).attr('data-width', video.videoWidth);        // 해상도 너비
                        $('#' + compIdImg).attr('data-height', video.videoHeight);      // 해상도 높이
                        ComUtils.hideLoading();
                        URL.revokeObjectURL(url);
                        setVideoInfo(compIdImg);
                        /*// 2021.09.01 Baik */
                    }
                    return success;
                };
                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = url;
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;

                var promise = video.play();
                if (promise !== undefined) {
                    promise.then(function(result) {

                    }, function(error) {
                        var url = URL.createObjectURL(file);
                        video.src = url;
                        video.play();
                    });
                }
            }

            var endSize = 10485760; // 10MB
            if (file.size < endSize) {
                endSize = file.size;
            }
            fileReader.readAsArrayBuffer(file.slice(0, endSize));
        }
    },
    validCheck: function(file, compAccept) {
        var fileName = file.name;
        //---------------------------------------------
        // 100GB 이상은 업로드 못하도록
        //---------------------------------------------
        if (file.size / 1024 / 1024 / 1024 / 100 > 1) {
            alert("100 GB 이상은 업로드가 불가능 합니다.");
            return false;
        }

        //---------------------------------------------
        //확장자체크   
        //---------------------------------------------
        var okExt = fileName;
        if (okExt.indexOf(".") >= 0) {
            okExt = okExt.substr(okExt.lastIndexOf(".") + 1).toLowerCase();
            if (("|" + compAccept + "|").indexOf("|" + okExt + "|") == -1) {
                alert(fileName + '\r\n' + '확장자를 확인해주세요');
                return false;
            }
        } else {
            alert(fileName + '\r\n' + '확장자를 확인해주세요');
            return false;
        }
        return true;
    }
};

//-----------------------------------------------------------------------------
// 문자의 좌, 우 공백 제거
// @return : String
//-----------------------------------------------------------------------------
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

//-----------------------------------------------------------------------------
// 문자의 좌 공백 제거
// @return : String
//-----------------------------------------------------------------------------
String.prototype.ltrim = function() {
    return this.replace(/(^\s*)/, "");
}

//-----------------------------------------------------------------------------
// 문자의 우 공백 제거
// @return : String
//-----------------------------------------------------------------------------
String.prototype.rtrim = function() {
    return this.replace(/(\s*$)/, "");
}

String.prototype.lpad = function(totalLen, strReplace) {
    var strAdd = "";
    var diffLen = totalLen - this.length;

    for (var i = 0; i < diffLen; ++i)
        strAdd += strReplace;

    return strAdd + this;
};

String.prototype.zf = function(len) {
    return this.lpad(len, '0');
};

String.prototype.replaceAll = function(arg1, arg2) {
    return this.split(arg1).join(arg2);
};

Number.prototype.zf = function(len) {
    return this.toString().lpad(len, '0');
};

function setAutoCompleteOFF(tm) {
    //  $("input").attr("autocomplete", "new-password");
    $('input, :input').attr('autocomplete', 'new-password');
    $(document).on('focus', ':input', function() {
        $(this).attr('autocomplete', 'new-password');
    });
}

/**
 * 공통 자바스크립트 함수
 */
var ComUtils = {
    rgb2hex: function(rgb) {
        if (rgb.search("rgb") == -1) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
    },
    toBase64: function(str) {
        return btoa(unescape(encodeURIComponent(str)));
    },
    fromBase64: function(str) {
        return decodeURIComponent(escape(window.atob(str)));
    },
    goUrl: function(url) {
        try {
            localStorage.setItem("lastUrl", url);
        } catch (e) {

        }
        //          location.href = GV_CTX + (url.toString().substring(0,1) ? "" : "/") + url;
        location.href = (url.toString().substring(0, 1) ? "" : "/") + url;
    },
    isEmpty: function(arg) {
        try {
            if (arg == null || arg == undefined || arg == 'undefined' || arg == 'null' || (arg + "") /*.trim()*/ == "") return true;
            else return false;
        } catch (e) {
            return true;
        }
    },
    //박민철 - 객체 프로퍼티의 값이 비어있는지 확인
    isEmptyObjectValue:function (obj){
		for(var key in obj){
		    if(!this.isEmpty(obj[key])){
		        return false;
		    }
		}
		return true;
	},
	pathReplace : function(path){
	    path = this.nvl(path);
	    path = path.replace('/ux_data/HMGPR', '');
	    return path;
	},
    isEqual : function(var1, var2){
        if(this.isEmpty(var1) == this.isEmpty(var2)){
            return true;
        }else{
            return false;
        }
    },
    removeTag: function(html, isChangeSpace) {
        isChangeSpace = ComUtils.nvl(isChangeSpace, false);
        if (isChangeSpace) {
            return this.nvl(html).toString().replace(/(<([^>]+)>)/gi, " ");
        } else {
            return this.nvl(html).toString().replace(/(<([^>]+)>)/gi, "");
        }
    },
    nvl: function(arg, defaultStr) {
        if (this.isEmpty(arg)) {
            if (this.isEmpty(defaultStr)) {
                return "";
            } else {
                return defaultStr;
            }
        } else {
            return arg;
        }
    },
    getObj: function(id) {
        var item;
        if (typeof id == "string") {
            if (id.substr(0, 1) == "#") {
                item = $(id);
            } else {
                item = $("#" + id);
            }

            // 존재하지 않는 경우 이름으로 찾기
            if (item.length <= 0) {
                item = $("input[name=" + id + "]");
                // $(':radio[name="radioSwitch"]:checked').val();
            }
        } else {
            item = id;
        }
        return item
    },
    mergeJSON: function(json1, json2) {
        // $.extend 로 대체
        // return Object.assign({},json1, json1);
        return $.extend(json1, json2);
    },
    //컴포넌트 param
    getComponentParam: function(contentRootId){
        var formData = {};
        var lists = [];
        var isValidation = true;
        var textLength = 0;
        var isErrMsg = '';
        
        $("#"+contentRootId).children("li[name=componentRoot]").each(function(){
            var data = {};
            var root = $(this);
            var type1 = root.find("select[name=selectType1]").val();
            var subType1 = root.find("div[name=selectSubType1] > select");
            var subType2 = root.find("div[name=selectSubType2] > select");
            var compOrder = true;
            data.compColumn = type1;
            data.componentId = root.find("input[name=componentId]").val();
            
            
            var attachIdList = [];
            var captionTextList = [];
            
            if(type1 == 1){
                data.compType = subType1.val();
                //1단
                switch(subType1.val()){
                    case "A1":
                    case "A2":
                        data.compText = root.find("input[name="+subType1.val()+"Text]").val();
                        textLength += data.compText.split(' ').length;
                        break;
                    case "A3":
                        data.compText = root.find("div[name=A3Text]").html();
                        textLength += data.compText.split(' ').length;
                        break;
                    case "A4":
                    case "A13":
                        data.compText = root.find("textarea[name="+subType1.val()+"Text]").val();
                        textLength += data.compText.split(' ').length;
                        break;
                    case "A5":
                    case "A10":
                        var aSub = root.find("div[name="+subType1.val()+"]");
                        ComUtils.getComponentSubParam(aSub, data, subType1.val());
                        isErrMsg = data.isErrMsg;
                        isValidation = data.isValidation;
                        data.caption = root.find("input[name=captionText]").val();
                        data.height = root.find("input[name=compHeight]").val();
                        break;
                    case "A6":
                        var aSub = root.find("div[name="+subType1.val()+"]");
                        ComUtils.getComponentSubParam(aSub, data, subType1.val());
                        data.caption = root.find("input[name=captionText]").val();
                        data.height = root.find("input[name=compHeight]").val();
                        
                        isErrMsg = data.isErrMsg;
                        isValidation = data.isValidation;
                        
                        if(!$.isNumeric(data.height) && ComUtils.isEmpty(isErrMsg)){
                            isValidation = false;
                            isErrMsg = '패럴럭스 이미지 높이 숫자만 입력해주세요.';
                        }
                        break;
                    case "A7":
                    case "A9":
                        var aSub = root.find("div[name="+subType1.val()+"]");
                        ComUtils.getComponentSubParam(aSub, data, subType1.val());
                        isValidation = data.isValidation;
                        isErrMsg = data.isErrMsg;
                        break;
                    case "A11":
                        var aSub = root.find("div[name="+subType1.val()+"]");
                        ComUtils.getComponentSubParam(aSub, data, subType1.val());
                        isValidation = data.isValidation;
                        isErrMsg = data.isErrMsg;
                        data.url = root.find("input[name=youtubeUrl]").val();
                        data.caption = root.find("input[name=youtubeCaption]").val();
                        break;
                    case "A12":
                        data.compText = root.find("input[name="+subType1.val()+"Text]").val();
                        isValidation = $.isNumeric(data.compText);
                        if(!isValidation){
                            isErrMsg = '여백 숫자만 입력해주세요.';
                        }
                        textLength += data.compText.split(' ').length;
                        break;
                    default:
                        isValidation = false;
                        break;
                }
            }else{
                data.compType = subType2.val();
                
                switch(subType2.val()){
                    case "B1":
                        data.compEtc = root.find("div[name=B1Left]").html();
                        data.compText = root.find("div[name=B1Right]").html();
                        compOrder = root.find("div[name=B1]").hasClass('reverse');
                        textLength += data.compEtc.split(' ').length;
                        textLength += data.compText.split(' ').length;
                        break;
                    case "B2":
                        data.compText = root.find("div[name=B2Right]").html();
                        compOrder = root.find("div[name=B2]").hasClass('reverse');
                        var aSub = root.find("div[name=B2Left]");
                        ComUtils.getComponentSubParam(aSub, data, subType1.val());
                        isValidation = data.isValidation;
                        isErrMsg = data.isErrMsg;
                        textLength += data.compText.split(' ').length;
                        break;
                    case "B3":
                        data.compText = root.find("div[name=B3Right]").html();
                        compOrder = root.find("div[name=B3]").hasClass('reverse');
                        var aSub = root.find("div[name=B3Left]");
                        ComUtils.getComponentSubParam(aSub, data, subType1.val());
                        isValidation = data.isValidation;
                        isErrMsg = data.isErrMsg;
                        textLength += data.compText.split(' ').length;
                        break;
                    case "B4":
                        data.compText = root.find("div[name=B4Right]").html();
                        compOrder = root.find("div[name=B4]").hasClass('reverse');
                        var aSub = root.find("div[name=B4Left]");
                        ComUtils.getComponentSubParam(aSub, data, subType1.val());
                        isValidation = data.isValidation;
                        isErrMsg = data.isErrMsg;
                        textLength += data.compText.split(' ').length;
                        break;
                    default:
                        isValidation = false;
                        break;
                }
            }
            
            if(!compOrder){
                data.compOrder = '1';
            }else{
                data.compOrder = '2';
            }
            
            //data.compText = ComUtils.fromJSON(data);
            lists.push(data);
        });
        formData.componentList = lists;
        formData.isValidation = isValidation;
        formData.isErrMsg = isErrMsg;
        formData.textLength = textLength;
        return formData;
    },
    //컴포넌트 이미지 관련 param
    getComponentSubParam : function(layout, data, subType){
        var attachIdList = [];
        var captionTextList = [];
        var isValidation = false;
        var typeName = '';
        
        switch(subType){
            case "A5":
            case "B2":
                typeName = '이미지 ';
                break;
            case "A6":
                typeName = '패럴럭스 이미지 ';
                break;
            case "A7":
            case "B3":
                typeName = '이미지 슬라이드 ';
                break;
            case "A9":
                typeName = '갤러리 이미지 ';
                break;
            case "A10":
            case "B4":
                typeName = '비디오 ';
                break;
            case "A11":
                typeName = '유튜브 ';
                break;
        }
        
        layout.find("input, select, textarea, hidden, radio, img").each(function(i, item) {
            if(ComUtils.getType( item ) == 'hidden'){
                attachIdList.push($(item).val());
                if(!ComUtils.isEmpty($(item).val())){
                    isValidation = true;
                }
            }else{
                var itemName = $(item).attr("name");
                if(itemName == 'captionText'){
                    captionTextList.push(ComUtils.nvl($(item).val().replaceAll(',', '@@@'),' '));
                }
            }
        });
        data.compAssetId = attachIdList;
        data.captionTextList = captionTextList;
        if(!isValidation){
            data.isErrMsg = typeName + '파일을 등록해주시기 바랍니다.';
        }
        data.isValidation = isValidation;
    },
    initImageId : function(){
        compImgId = 1;
        compImgSlidId = 1;
        deleteImageIds = [];
    },
    getCompImgId : function(){
        return compImgId++;
    },
    getCompImgSlideId : function(){
        return compImgSlidId++;
    },
    getParams: function(id, bFile) {
        var formData;
        var form = this.getObj(id);
        var isFile = $(form).find(":file").length > 0;
        if (isFile) {
            formData = new FormData();
        } else {
            formData = {};
        }

        if (!ComUtils.isEmpty(bFile)) {
            isFile = false;
            formData = {};
        }

        $(form).find("input, select, textarea, hidden, radio, img").each(function(i, item) {
            if (isFile) {
                if (ComUtils.getType(item) == "file") {
                    if ($(item)[0].files[0] != undefined) {
                        formData.append(ComUtils.nvl($(item).attr("name"), $(item).attr("id")), ($(item)[0].files[0]));
                    }
//                    formData.append(ComUtils.nvl($(item).attr("name"), $(item).attr("id")), ($(item)[0].files[0] == undefined ? "" : $(item)[0].files[0]));
                }else if (ComUtils.getType(item) == "radio") {
                    if(item.checked){
                        formData.append(ComUtils.nvl($(item).attr("name"), $(item).attr("id")), ComUtils.getValue(item));
                    }
                }else {
                    formData.append(ComUtils.nvl($(item).attr("name"), $(item).attr("id")), ComUtils.getValue(item));
                }
            } else {
                if(!ComUtils.isEmpty($(item).attr("name")) && !ComUtils.isEmpty($(item).attr("id")) ){
                    formData[ComUtils.nvl($(item).attr("name"), $(item).attr("id"))] = ComUtils.getValue(item);
                }
            }
        });
        return formData;
    },
    getDataParams:function(id){
        //file을 제외한 param
        var formData = {};
        var form = this.getObj(id);
        $(form).find("input, select, textarea, hidden, radio").each(function(i, item) {
            formData[ComUtils.nvl($(item).attr("name"), $(item).attr("id"))] = ComUtils.getValue(item);
        });
        return formData;
        
    },
    getParamsAdd: function(formData, id) {
        var form = this.getObj(id);
        $(form).find("input, select, textarea, hidden, radio, img").each(function(i, item) {
            if (ComUtils.getType(item) == "radio") {
                if(item.checked){
                    formData.append(ComUtils.nvl($(item).attr("name"), $(item).attr("id")), ComUtils.getValue(item));
                }
            }else if (ComUtils.getType(item) != "file") {
                formData.append(ComUtils.nvl($(item).attr("name"), $(item).attr("id")), ComUtils.getValue(item));
            }
        });
    },
    clearForm: function(id) {
        var form = this.getObj(id);
        $(form).find("a, input, select, textarea, hidden, span, img").each(function(i, item) {
            if ($(this).attr('class') != 'required') {
                ComUtils.setValue($(this), "");
            }
            if (!ComUtils.isEmpty(item.src) && item.className.indexOf('ui-datepicker-trigger') != 0) {
                FileUtils.setImgFile(item.id, '');
            }
        });
    },
    setDataMapping: function(id, jsonData) {
        var form = this.getObj(id);
        if (this.isEmpty(jsonData)) {
            jsonData = {};
        }
        var dataId = "";
        var compType = "";
        $(form).find("a, input, select, textarea, hidden, span, em, img").each(function(i, item) {
            dataId = $(item).attr("id");
            if(item.type != 'radio'){
                if (!ComUtils.isEmpty(dataId)) {
                    ComUtils.setValue(item, ComUtils.nvl(jsonData[dataId]));
                }
            }else{
                //input type이 radio인 경우 Mapping.
                var radioName = $(item).attr("name");
                $('input:radio[name='+radioName+']').removeAttr("checked");
                $('input:radio[name='+radioName+']:input[value="' + ComUtils.nvl(jsonData[radioName]) + '"]').prop("checked", true);
            }
            
        });

        $(form).find("component").each(function(index, item) {
            dataId = $(item).attr("component-id");
            compType = $(item).attr("component-type");
            if (!ComUtils.isEmpty(dataId)) {
                if (compType == "imageUpload" || compType == "imageSelect") {
                    $("#" + dataId + "Img")[0].src = ComUtils.changeContentImgUrl(jsonData[dataId]);
                } else if (compType == "contents") {
                    $("#" + dataId + "Img")[0].src = ComUtils.changeContentImgUrl(jsonData[dataId + "Img"]);
                }
            }
        });
    },
    setDataMappingFromName: function(id, jsonData) {
        var form = this.getObj(id);
        if (this.isEmpty(jsonData)) {
            jsonData = {};
        }
        var dataName = "";
        var compType = "";
        $(form).find("a, input, select, textarea, hidden, span, em, img").each(function(i, item) {
            dataName = $(item).attr("name");
            if(item.type != 'radio'){
                if (!ComUtils.isEmpty(dataName)) {
                    ComUtils.setValue(item, ComUtils.nvl(jsonData[dataName]));
                }
            }else{
                //input type이 radio인 경우 Mapping.
                var radioName = $(item).attr("name");
                $('input:radio[name='+radioName+']').removeAttr("checked");
                $('input:radio[name='+radioName+']:input[value="' + ComUtils.nvl(jsonData[radioName]) + '"]').prop("checked", true);
            }
        });
    },
    changeContentImgUrl: function(url) {
        if (ComUtils.isEmpty(url)) {
            return GV_CTX + "/resources/assets/img/common/noImage.png";
        } else {
            if (url.toLowerCase().indexOf("http") >= 0) {
                return url;
            } else {
                return GV_ASSETS_CONTENTS_URL + "/" + url;
            }
        }
    },
    changeContentVodUrl: function(url) {
        if (ComUtils.isEmpty(url)) {
            return GV_CTX + "/resources/assets/img/common/noImage.png";
        } else {
            if (url.toLowerCase().indexOf("http") >= 0) {
                return url;
            } else {
                return GV_VOD_CONTENTS_URL + "/" + url;
            }
        }
    },
    disabledForm: function(id, flag) {
        var form = this.getObj(id);
        $(form).find("a, input, select, textarea, hidden, span, button").each(function(i, item) {
            // ComUtils.setReadOnly($(item), flag);
            if (flag) {
                $(item).attr("disabled", true);
            } else {
                $(item).attr("disabled", false);
            }
        });
    },
    setValue: function(id, value) {
        var item = this.getObj(id);

        if ($(item).length > 0) {
            var typ = this.getType(item);
            if (typ == "text" || typ == "hidden" || typ == "password" || typ == "textarea") {
                if ($(item).hasClass("__jqueryTime")) {
                    TimeUtils.setTime($(item), value);
                } else if ($(item).hasClass("__jqueryTimeToSec")) {
                    TimeUtils.setTimeToSec($(item), value);
                } else if ($(item).hasClass("__jqueryDate")) {
                    TimeUtils.setDate($(item), value);
                } else if ($(item).hasClass("text_number") || $(item).hasClass("text_float") || $(item).hasClass("text_price")) {
                    $(item).val(ComUtils.numberWithCommas(value));
                } else if (typ == "textarea") {
                    if (!ComUtils.isEmpty(value)) {
                        value = value.replaceAll("&lt;", "<");
                        value = value.replaceAll("&gt;", ">");
                    }
                    $(item).val(value);
                } else {
                    $(item).val(value);
                }
            } else if (typ == "select-one") {
                $(item).val(value);
                try{
                    $(item).selectmenu("refresh");
                } catch (e) {}
            } else if (typ == "checkbox") {
                $(item).prop('checked', ($(item).val() == value));
                // $(item).prop('checked', !this.isEmpty(value));
            } else if (typ == "em" || typ == "div") {
                $(item)[0].innerHTML = value;
            } else if (typ == "a" || typ == "label") {
                $(item).text(value);
            } else if (typ == "file") {
                $(item).text(value);
            } else if (typ == "img") {
                $(item)[0].src = value;
            } else if (typ == "radio") {
                $('input:radio[name='+id+']:input[value="' + value + '"]').prop("checked", true);
            } else {
                $(item).val(value);
            }
        }
    },
    setText: function(id, value) {
        var item = this.getObj(id);

        if ($(item).length > 0) {
            var typ = this.getType(item);
            if (typ == "span") {
                $(item).text(value);
            }
        }
    },
    getNumber: function(s) {
        s += ''; // 문자열로 변환
        s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
        if (s == '' || isNaN(s)) {
            return "";
        } else {
            return Number(s) + "";
        }
    },
    getAttr: function(id, attr) {
            var item = this.getObj(id);
            var typ = this.getType(item);
            var rtnValue = "";
            if (typ == "text" || typ == "hidden" || typ == "password") {
                rtnValue = item.attr(attr);
            } else if (typ == "select-one") {
                rtnValue = item.find("option:selected").attr(attr);
            } else if (typ == "radio") {

            } else if (typ == "checkbox") {

            } else {
                rtnValue = item.attr(attr);
            }

            return rtnValue;
        }

        ,
    getValue: function(id) {
        var item = this.getObj(id);

        var typ = this.getType(item);
        var rtnValue = "";
        if (typ == "text" || typ == "hidden" || typ == "password") {
            if ($(item).hasClass("__jqueryDate")) {
                rtnValue = TimeUtils.getDate($(item));
            } else if ($(item).hasClass("__jqueryTime")) {
                rtnValue = TimeUtils.getTime($(item));
            } else if ($(item).hasClass("__jqueryTimeToSec")) {
                rtnValue = TimeUtils.getTime($(item));
            } else if ($(item).hasClass("text_number") || $(item).hasClass("text_only_number")) {
                var reg = new RegExp("[^-0-9]", "g");
                rtnValue = $(item).val().replace(reg, '');
                rtnValue = ComUtils.getNumber(rtnValue);
            } else if ($(item).hasClass("text_float") || $(item).hasClass("text_price")) {
                var reg = new RegExp("[^-0-9" + GV_DECIMAL_SPRAT + "]", "g");
                rtnValue = $(item).val().replace(reg, '').replace(GV_DECIMAL_SPRAT, ".");
                rtnValue = ComUtils.getNumber(rtnValue);
                if (!ComUtils.isEmpty(rtnValue)) {
                    if ($(item).hasClass("text_float")) {
                        //유럽 3차 출장
                        rtnValue = Number(rtnValue).toFixed(3);
                    } else if ($(item).hasClass("text_price")) {
                        rtnValue = Number(rtnValue).toFixed(2);
                    }
                    rtnValue = ComUtils.getNumber(rtnValue);
                }
            } else {
                rtnValue = $(item).val();
            }
        } else if (typ == "select-one") {
            rtnValue = $(item)[0].value;
            // rtnValue = $("#" + $(item).attr("id") + " > option:selected").val();
        } else if (typ == "radio") {
            rtnValue = $(':radio[name="' + $(item).attr("name") + '"]:checked').val();
            //rtnValue = ($(item)[0].checked) ? $(item)[0].value : "";
        } else if (typ == "checkbox") {
            if ($(item).is(":checked")) {
                rtnValue = $(item).val();
            }
        } else if (typ == "img") {
            rtnValue = $(item)[0].src;
        } else if (typ == "component") {
            var compType = $(item).attr("component-type");
            var compId = $(item).attr("component-id");
            if (compType == "imageUpload" || compType == "videoUpload") {
                var imgUrl = $("#" + compId + "Img")[0].src;
                if (imgUrl.indexOf(GV_ASSETS_CONTENTS_URL) >= 0 || imgUrl.indexOf("data:image") >= 0) {
                    return imgUrl;
                } else {
                    return "";
                }
            } else if (compType == "subtitleUpload") {

            } else {
                return ComUtils.getValue(compId);
            }
        }else if(typ == "select-multiple"){
            var temp = $(item).val();
            for(var i=0; i < temp.length; i++){
                if(i==0){
                    rtnValue += temp[i];
                }else{
                    rtnValue += "," + temp[i];
                }
            }
        } else {
            rtnValue = $(item).val();
        }

        if ($(item).hasClass("not_trim")) {
            return this.nvl(rtnValue);
        } else {
            return this.nvl(rtnValue).trim();
        }
    },
    trim: function(str) {
        return (str + "").replace(/(^\s*)|(\s*$)/g, "");
    },
    getType: function(item) {
            try {
                if(!this.isEmpty($(item)[0])){
                    var type = $(item)[0].type;
                    if (this.isEmpty(type)) {
                        type = $(item)[0].nodeName;
                    }
                    return type.toLowerCase();
                }else{
                    return '';
                }
            } catch (e) {
                this.log("Error : " + item);
            }
        }

        ,
    log: function(str) {
        var d = new Date();
        var yyyy = d.getFullYear().toString();
        var MM = this.pad(d.getMonth() + 1, 2);
        var dd = this.pad(d.getDate(), 2);
        var hh = this.pad(d.getHours(), 2);
        var mm = this.pad(d.getMinutes(), 2)
        var ss = this.pad(d.getSeconds(), 2)

        var sf = yyyy + "." + MM + "." + dd + ". " + hh + ":" + mm + ":" + ss;
        try {
            str = JSON.stringify(str)
        } catch (e) {}
        try {
            console.log(sf + " : " + str);
        } catch (e) {}
    },
    pad: function(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;
    },
    popAemAsset: function(param) {
        // assetKey:A0001, resultFunc:, fileType:DOC/IMG, targetPath:현재 Assets Full Path

        //          ComUtils.popup(GV_CTX + '/system/aemDamAsset.view', param, 700, 550);
        ComUtils.popup(GV_CTX+'/system/aemDamAsset.view', param, 700, 550);
    },
    popup: function(popupUrl, jsonParam, iwidth, iheight) {
        var left = (screen.width / 2) - (iwidth / 2);
        var top = (screen.height / 2) - (iheight / 2);
        var target = popupUrl.substr(popupUrl.lastIndexOf("/") + 1);
        target = target.substr(0, target.indexOf("."));

        // var target = this.guid();
        var width = "1000";
        var height = "800";
        if (!this.isEmpty(iwidth)) {
            width = iwidth;
        }

        if (!this.isEmpty(iheight)) {
            height = iheight;
        }

        var popupForm = document.createElement("form");
        popupForm.setAttribute("method", "post");
        popupForm.setAttribute("action", popupUrl);
        popupForm.setAttribute("target", target);
        document.body.appendChild(popupForm);

        if (this.isEmpty(jsonParam)) {
            jsonParam = {};
        }
        jsonParam.popup = "Y";
        jsonParam.popupWidth = width;
        jsonParam.popupHeight = height;

        // Parameter Setting
        if (!this.isEmpty(jsonParam)) {
            for (var key in jsonParam) {
                var inputGroupId = document.createElement("input");
                inputGroupId.setAttribute("type", "hidden");
                inputGroupId.setAttribute("name", key);
                inputGroupId.setAttribute("value", jsonParam[key]);
                popupForm.appendChild(inputGroupId);
            }
        }

        var windowFeatures = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left;
        window.open("", target, windowFeatures);
        popupForm.submit();
        // delete popupForm;
    },
    showLayerPopup: function(formId) {
        // Layer팝업 띄우기.(add, detail 같이 사용) 
        // 화면의 높이와 너비를 변수로 만듭니다.
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        // background 높이와 너비를 화면의 높이와 너비 변수로 설정합니다.
        $('#background').css({
            'width': maskWidth,
            'height': maskHeight
        });

        $('#background').fadeTo("slow", 0.7);

        // 레이어 팝업을 가운데로 띄우기 위해 화면의 높이와 너비의 가운데 값과 스크롤 값을 더하여 변수로 만듭니다.
        var left = ($('#content').width() - $(formId).width()) / 2 + "px";
        var top = ($('#content').height() - $(formId).height()) / 2 + "px";
        /*          var top = (($('#content').height() - $(formId).children().height()) / 2)/2 + "px";*/

        // css 스타일을 변경합니다.
        $(formId).css({
            'left': left,
            'top': top,
            'position': 'absolute'
        });

        // 레이어 팝업을 띄웁니다.
        $(formId).show();
        $(formId).draggable();
    },
    closeLayerPopup: function(formId) {
        $(formId).hide();
        $('#background').hide();
    },
    redirect : function (redirectUrl, params, targetStr) {
        var $form = $('<form></form>');
        $form.attr("method", "post");
        $form.attr("action", redirectUrl);
        if (!ComUtils.isEmpty(targetStr)) {
            $form.attr("target", targetStr);
        }
        if (!this.isEmpty(params) && !$.isEmptyObject(params)) {
            for(var key in params) {
                $form.append($('<input/>', { type: 'hidden', name: key, value: ComUtils.nvl(params[key]) }));
            }
            $form.append($('<input/>', { type: 'hidden', name: 'frmParm', value: ComUtils.fromJSON(params) }));
            $form.appendTo('body').submit();
            $form.remove();
        } else if (!$.isEmptyObject(GV_SRCH_PARM)) {
            $form.appendTo('body').submit();
            $form.remove();
        } else {
            location.replace(redirectUrl);
        }
    },
    setReadOnly: function(id, mode) {
            var item = this.getObj(id);
            var typ = this.getType(item);
            if (mode == true) {
                $(item).css('background', '#f2f2f2');
                $(item).attr("readonly", true);
                $(item).attr("disabled", true);

                // 2019.01.16 by 류재명
                $(item).addClass("text_disable");
            } else {
                $(item).css('background', '#ffffff');
                $(item).attr("readonly", false);
                $(item).attr("disabled", false);

                // 2019.01.16 by 류재명
                $(item).removeClass("text_disable");
            }

            // 2019.01.16 by 류재명
            if ($(item).hasClass("__jqueryDate")) {
                $(item).datepicker((mode == true ? "disable" : "enable"));
            }

            /*
            if (typ == "select-one") {
                $(item).attr("disabled", mode);
            } else if (typ == "file") {
                $(item).attr("disabled", mode);
            } else if (typ == "radio") {
                $(item).attr("disabled", mode);
            }
            */
        }

        ,
    fromJSON: function(str) {
        return JSON.stringify(str);
    },
    toJSON: function(str) {
        try {
            str = JSON.parse(str);
        } catch (e) {}
        return str;
    },
    nullCheckItem: function(id, nameStr) {     // form 요소 전체를 밸리데이션 할 수 없는 경우 처리를 위해
        var bResult = true;
        var obj = this.getObj(id);
        if (ComUtils.isEmpty(ComUtils.getValue(id))) {
            bResult = false;
            ComUtils.alert(nameStr + "은(는) 필수 요소입니다.", $(obj).focus());
        }
        return bResult;
    },
    nullCheckItemArr: function(idNameArr) {    // form 요소 전체를 밸리데이션 할 수 없는 경우 처리를 위해
        var bResult = true;
        if(Array.isArray(idNameArr)) {
            for(var i = 0; i < idNameArr.length; i++) {
                var validStr = idNameArr[i];
                var objId = validStr.split("|")[0];
                var objName = validStr.split("|")[1];
                if(!ComUtils.nullCheckItem(objId, objName)) {
                    bResult = false;
                    break;
                }
            }
        } else {
            var objId = idNameArr.split("|")[0];
            var objName = idNameArr.split("|")[1];
            if(!ComUtils.nullCheckItem(objId, objName)) {
                bResult = false;
            }
        }
        
        return bResult;
    },
    validationCheck: function(id) {
        var alertMsg = "";
        var bResult = true;
        var form = this.getObj(id);

        $(form).find("input, select, textarea, component").each(function(i, item) {
            ComUtils.normalBox(item);
        });

        $(form).find("input, select, textarea, component").each(function(i, item) {
            if ($(item).is(":disabled") == true) {
                // return true;
            }
            
            if ($(item).is("[data-checkRequired]")) {
                if (ComUtils.isEmpty(ComUtils.getValue(item))) {
                    ComUtils.errorBox(item);
                    if (bResult) {
                        $(item).focus();
                    }
                    bResult = false;
                }
            }
            
            if ($(item).is("[data-checkEmail]")) {
                var str = ComUtils.getValue(item);
                var regExp = /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
                if (!ComUtils.isEmpty(str)) {
                    if (str.match(regExp) == null) {
                        alertMsg = "정확한 이메일 형식이 아닙니다.";
                        ComUtils.errorBox(item);
                        if (bResult) {
                            $(item).focus();
                        }
                        bResult = false;
                    }
                }
            }
            
            if ($(item).is("[data-checkLength]")) {
                var str = ComUtils.getValue(item);
                if (!ComUtils.isEmpty(str)) {
                    var len = $(item).attr("data-checkLength").split("-");
                    if (len.length == 1) {
                        if (ComUtils.getByteLength(str) != len[0]) {
                            alertMsg += $(item).attr("label") + "은(는) " + len[0] + " 길이 입니다.\n";
                            ComUtils.errorBox(item);
                            if (bResult) {
                                $(item).focus();
                            }
                            bResult = false;
                        }
                    } else {
                        if (ComUtils.getByteLength(str) < len[0] || ComUtils.getByteLength(str) > len[1]) {
                            alertMsg += $(item).attr("label") + "은(는) " + len[0] + "~" + len[1] + " 사이의 길이만 허용합니다.\n";
                            ComUtils.errorBox(item);

                            if (bResult) {
                                $(item).focus();
                            }
                            bResult = false;
                        }
                    }
                }
            }

            if ($(item).is("[data-sameCheck]")) {
                var chkId = $(item).attr("data-sameCheck");
                var str = ComUtils.getValue(item);
                var str2 = $("#" + chkId).val();
                if (str != str2) {
                    alertMsg += $(item).attr("label") + " and " + $("#" + chkId).attr("label") + " are different.\n";
                    ComUtils.errorBox(item);
                    ComUtils.errorBox("#" + chkId);

                    if (bResult) {
                        $(item).focus();
                    }
                    bResult = false;
                }
            }

            if ($(item).is("[data-checkMaxNum]")) {
                var str = ComUtils.getValue(item);

                if (!ComUtils.isEmpty(str)) {
                    var maxNum = Number($(item).attr("data-checkMaxNum"));
                    var curNum = Number(str);

                    if (maxNum < curNum) {
                        alertMsg += "The maximum allowable range is " + maxNum + ".\n";
                        ComUtils.errorBox(item);

                        if (bResult) {
                            $(item).focus();
                        }

                        bResult = false;
                    }
                }
            }
            
            if ($(item).is("[data-checkIp]")) {
                var str = ComUtils.getValue(item);
                var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                
                if (!ComUtils.isEmpty(str)) {
                    if (!ipformat.test(str)) {
                        alertMsg = '입력하신 값은 IP형식이 아닙니다.';
                        
                        if(bResult){
                        	$(item).focus();
                            //$(item).css('color','red');
                        }
                        
                        bResult = false;
                    }
                }
            }
            
        });
        
        if (!this.isEmpty(alertMsg)) {
            // this.alertClient(alertMsg, "E");
            ComUtils.alert(alertMsg);
        }
        
        return bResult;
    },
    errorBox: function(item) {
        $(item).addClass("errorBox");
        /*
        $(item).css('outline-color', '#e4a858');
        $(item).css('outline-style', 'solid');
        $(item).css('outline-width', 'thin');
        */
    },
    normalBox: function(item) {
        /*
        var tagName = "";
        try {
            tagName = $(item)[0].tagName;
        } catch (e) {}
        
        if (tagName.toUpperCase() == "COMPONENT") {
            
        } else {
            $(item).removeClass( "errorBox" );
        }
        */

        $(item).removeClass("errorBox");
    },
    clearHighlight: function(id) {
        var form = this.getObj(id);

        $(form).find("input, select").each(function(i, item) {
            ComUtils.normalBox(item);
        });
    },
    getNextSeq: function(seqCd) {
        //          var resp = this.callAjax(GV_CTX + "/admin/getNextSeq.do", {seqCd:seqCd});
        var resp = this.callAjax(GV_CTX+"/admin/getNextSeq.do", {
            seqCd: seqCd
        });
        return resp.data;
    },
    toCamelCase: function camalize(str) {
        str = str.toLowerCase().replaceAll("_", " ");
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
        // return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    },
    toUnderscoreCase: function(str) {
        var result = str.replace( /([A-Z])/g, " $1" );
        return result.split(' ').join('_').toLowerCase();           
    },
    callAjax: function(targetUrl, formData, callback) {
        var async = false;
        var isFile = false;

        if (callback == undefined) {
            async = false;
        } else {
            async = true;
        }
        if (formData instanceof FormData) {
            isFile = true;
        }

        var result;
        $.ajax({
            type: "post",
            async: async,
            url: targetUrl,
            data: (!isFile ? ComUtils.fromJSON(formData) : formData),
            dataType: (!isFile ? "json" : false),
            contentType: (!isFile ? "application/json; charset=utf-8" : false),
            processData: false,
            success: function(response) {
                try {
                    response = ComUtils.toJSON(response);
                } catch (e) {
                    ComUtils.alert(e.toString());
                }

                ComUtils.hideLoading();

                if (async) {
                    callback(response);
                } else {
                    result = response;
                    return result;
                }
            },
            error: function(response) {
                if (response.status == 999) {
                    //                        location.href = GV_CTX;
                    location.href = '';
                } else if (response.status == 401) {
                    ComUtils.alert("You do not have permission.");
                } else {
                    ComUtils.hideLoading();
                    if (!ComUtils.isEmpty(response.responseJSON)) {
                        result = response.responseJSON;
                    } else {
                        result = {
                            result: "F",
                            message: response.status + " ERROR"
                        };
                    }
                    if (async) {
                        callback(result);
                    } else {
                        return result;
                    }
                }
            },
            beforeSend: function() {
                ComUtils.showLoading(isFile);
            },
            complete: function() {
                ComUtils.hideLoading();
            },
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function(e) { //progress 이벤트 리스너 추가
                    var percent = e.loaded * 100 / e.total;
                    ComUtils.setValue("loadingPprogress", percent);
                };
                return xhr;
            }
        });
        return result;
    },
    delSelectOption: function(id, keys) {
        var item = this.getObj(id);
        var opts = item.find("option");
        for (var i = opts.length - 1; i >= 0; i--) {
            for (var j = 0; j < keys.length; j++) {
                if (opts[i].value == keys[j]) {
                    opts[i].remove();
                    break;
                }
            }
        }
    },
    clearSelectOption: function(id) {
        var item = this.getObj(id);
        var opts = item.find("option");
        for (var i = 0; i < opts.length; i++) {
            opts[i].remove();
        }
    },
    setSelectOption: function(params) {
        var id = ComUtils.nvl(params.id);
        var cd = ComUtils.nvl(params.cd);
        var cdNm = ComUtils.nvl(params.cdNm);
        var selectList = params.selectList;
        var dataList = ComUtils.nvl(params.dataList);
        var defaultCd = ComUtils.nvl(params.defaultCd);
        var spaceNm = params.spaceNm;
        var innerHtml = params.innerHtml;
        var itemArr = [];

        var obj;
        if (ComUtils.isEmpty(id)) {
            obj = params.obj;
        } else {
            obj = ComUtils.getObj(id);
        }
        $(obj).empty();

        if (spaceNm != undefined) {
            $(obj).append("<option value=''>" + spaceNm + "</option>");
        }

        if (innerHtml != undefined) {
            var tempHtml = innerHtml;

            while (tempHtml.indexOf("item") >= 0) {
                var tempItem = tempHtml.substring(tempHtml.indexOf("item"), tempHtml.indexOf("]") + 1);
                itemArr.push(tempItem);
                tempHtml = tempHtml.replace(tempItem, "");
            }
        }

        if (!ComUtils.isEmpty(selectList)) {
            for (var i in selectList) {
                var strItem = JSON.stringify(selectList[i]);
                if (typeof strItem != 'undefined') {
                    var item = JSON.parse(strItem);

                    var dataHtml = "";

                    // data- 뒤의 속성값에 대문자를 넣더라도 HTML 문서가 로딩 될 때 소문자로 변환됨.
                    // ex) modelId의 값은 .data("modelid")로 호출.
                    if (!ComUtils.isEmpty(dataList)) {
                        for (i in dataList) {
                            dataHtml += " data-" + dataList[i] + "='" + item[dataList[i]] + "'";
                        }
                    }
                    if (itemArr.length > 0) {
                        var tempHtml = innerHtml;

                        if (!ComUtils.isEmpty(tempHtml)) {
                            for (i in itemArr) {
                                tempHtml = tempHtml.replace(tempHtml.substring(tempHtml.indexOf("item"), tempHtml.indexOf("]") + 1), eval(itemArr[i]));
                            }
                            item[cdNm] = tempHtml;
                        }
                    }

                    if (defaultCd == item[cd]) {
                        $(obj).append("<option value='" + item[cd] + "'" + dataHtml + " selected='selected'>" + item[cdNm] + "</option>");
                    } else {
                        $(obj).append("<option value='" + item[cd] + "'" + dataHtml + ">" + item[cdNm] + "</option>");
                    }
                }
            }
        }
        
    },
    
    getCode:function(codeGrp, codeNm){
    	var rtnVal = "";
        for (var key in GV_CODES[codeGrp]) {
            if (GV_CODES[codeGrp][key].cdNm == codeNm) {
                return ComUtils.nvl(GV_CODES[codeGrp][key].cd);
            }
        }
        return this.nvl(rtnVal, codeNm);
    },
    getCodeName: function(codeGrp, code) {
        var rtnVal = "";
        for (var key in GV_CODES[codeGrp]) {
            if (GV_CODES[codeGrp][key].cd == code) {
                return ComUtils.nvl(GV_CODES[codeGrp][key].cdNm);
            }
        }
        return this.nvl(rtnVal, code);
    },
    getCodeLangName: function(codeGrp, code, langCd){
    	var rtnVal = "";
        for (var key in GV_CODES[codeGrp]) {
            if (GV_CODES[codeGrp][key].cd == code) {
            	if(langCd == 'KO'){
            		return ComUtils.nvl(GV_CODES[codeGrp][key].cdNmKo);
            	}else{
            		return ComUtils.nvl(GV_CODES[codeGrp][key].cdNmEn);
            	}
            }
        }
        return this.nvl(rtnVal, code);
    },
    //code가 복수
    getCodeNames: function(codeGrp, codes) {
        var rtnVal = "";
        var result = "";
        
        var code = codes.split(",");
        
        for(var i=0; i<code.length; i++){
            if(i>0){
                result += " , ";
            }
            for (var key in GV_CODES[codeGrp]) {
                if (GV_CODES[codeGrp][key].cd == code[i]) {
                    result += ComUtils.nvl(GV_CODES[codeGrp][key].cdNm);
                }
            }
        }
        
        if(!ComUtils.isEmpty(result)){
            return result;
        }else{
            return this.nvl(rtnVal, codes);
        }
    },
    getCodeOpt1: function(codeGrp, code) {
        var rtnVal = "";
        for (var key in GV_CODES[codeGrp]) {
            if (GV_CODES[codeGrp][key].cd == code) {
                return ComUtils.nvl(GV_CODES[codeGrp][key].opt1);
            }
        }
        return this.nvl(rtnVal, code);
    },
    getLangsList: function(codeGrp, code) {
        var langList = [];

        if (!ComUtils.isEmpty(GV_LANG1)) {
            langList.push(GV_LANG1);
        }
        if (!ComUtils.isEmpty(GV_LANG2)) {
            langList.push(GV_LANG2);
        }
        if (!ComUtils.isEmpty(GV_LANG3)) {
            langList.push(GV_LANG3);
        }
        if (!ComUtils.isEmpty(GV_LANG4)) {
            langList.push(GV_LANG4);
        }
        return langList;

    },

    //----------------------------------------
    // 화면의 TEXT값 다운로드 시킬 경우 사용.
    //----------------------------------------
    textDownload: function(fileName, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },


    /**
     * @method showLoading
     * @description ajax 작동시, prograss bar 띄워주는 함수 2018.05.04 이유라
     */
    showLoading: function(isUpload) {
        var imgLoading = "";
        if (ComUtils.isEmpty(isUpload) || isUpload == false) {
            imgLoading = '<div id="loading" style="position:fixed; _position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;">';
            imgLoading += '<div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:.3;filter:alpha(opacity=30);background-color:#fff"></div>';
            imgLoading += '<div style="position:relative;top:45%;left:50%;margin-left:-30px;"><img alt="loading" src="' + GV_CTX + '/resources/assets/img/LoadingBar.gif" width="60px"/></div></div>';
        } else {
            imgLoading += '<div id="loading" style="position:fixed; _position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;">';
            imgLoading += '<div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:.3;filter:alpha(opacity=30);background-color:#fff"></div>';
            imgLoading += '<div style="position:relative;top:45%;left:50%;margin-left:-150px;"><progress id="loadingPprogress" value="0" max="100" style="width:300px;height:30px"></progress></div></div>';
        }
        $("body").append(imgLoading);
    },

    /**
     * @method hideLoading
     * @description ajax 호출끝날시, prograss bar 제거하는 함수 2018.05.04 이유라
     */
    hideLoading: function() {
        $("#loading").remove();
    },
    //세자리 단위로 콤마
    numberWithCommas: function(obj) {
        var num;
        if (ComUtils.isEmpty(obj)) {
            return "";
        }
        if (typeof obj == "string" || typeof obj == "number") {
            num = ComUtils.getNumber(obj);
        } else {
            obj = ComUtils.getObj(obj);
            num = ComUtils.getValue(obj);
        }

        var arr = num.toString().split(".");
        // MOD-000042
        if (arr.length > 1) {
            return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, GV_THOUSAND_SPRAT) + GV_DECIMAL_SPRAT + arr[1];
        } else {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, GV_THOUSAND_SPRAT);
        }
    },

    durationToSec: function(obj) {
        if (ComUtils.isEmpty(obj)) {
            return "";
        } else {
            return (obj / 1000).toFixed(2);
        }
    },
    /**
     * @method setFileForm
     * @param {param String} fileId - type이 file인 사용할 input 아이디
     * @description w2ui에서 제공되는 file포맷을 사용하기 위한 설정 2018.05.02 이유라
     */
    setFileForm: function(fileId) {
        $('#' + fileId).w2field('file', {});
    },

    /**
     * @method getByteLength
     * @param {param String} inputValue - byte수를 체크하고자 하는 input의 value값.
     * @description 입력값의 바이트 길이를 리턴한다.  2018.05.03 이유라
     * @example
     * if (getByteLength(form.title) > 100){
     *    alert("제목은 한글 50자 (영문 100자) 이상 입력할수 없습니다");
     * }
     * 
     */
    getByteLength: function(inputValue) {
        var byteLength = 0;
        for (var inx = 0; inx < inputValue.length; inx++) {
            var oneChar = escape(inputValue.charAt(inx));
            if (oneChar.length == 1) {
                byteLength++;
            } else if (oneChar.indexOf("%u") != -1) {
                byteLength += 2;
            } else if (oneChar.indexOf("%") != -1) {
                byteLength += oneChar.length / 3;
            }
        }
        return byteLength;
    },

    pagination: function(htmlId, data, func, isExcel) {
            var inxCnt = GV_PAGE_IDXCNT;
            var rowCnt = GV_PAGE_ROWCNT;

            var html = "";
            var currentPageNo = (ComUtils.isEmpty(data) ? 1 : data[0].rnum);
            var totalCnt = (ComUtils.isEmpty(data) ? 0 : data[0].totcnt);
            var startIdx = currentPageNo <= inxCnt ? 0 : parseInt((currentPageNo - 1) / inxCnt) * inxCnt;

            var firstPageNo = 1;
            var lastPageNo = parseInt((totalCnt + (rowCnt - 1)) / rowCnt);

            var prevPageNo = firstPageNo;
            var nextPageNo = lastPageNo;

            var isNowFirst = (currentPageNo == firstPageNo) ? true : false;
            var isNowFinal = (currentPageNo == lastPageNo) ? true : false;

            if (!isNowFirst) {
                prevPageNo = (((currentPageNo - 1) < firstPageNo) ? firstPageNo : (currentPageNo - 1));
            }

            if (!isNowFinal) {
                nextPageNo = ((currentPageNo + 1) > lastPageNo ? lastPageNo : (currentPageNo + 1));
            }

            if (totalCnt > 1) {
                var disabled = "'";
                if (currentPageNo <= 1) {
                    disabled = "' disabled";
                }

                html += "<button type='button' class='first-btn" + disabled + " id=" + firstPageNo + ">" + firstPageNo + "</button>";
                html += "<button type='button' class='prev-btn" + disabled + " id=" + prevPageNo + ">" + prevPageNo + "</button>";

                for (var i = 1; i <= inxCnt; i++) {
                    var pageNo = i + startIdx;
                    
                    /*
                    if (pageNo == currentPageNo) {
                        html += "<span id=" + pageNo + " class='pageOn'> " + pageNo + "</span>";
                    } else {
                        html += "<a href='#' id=" + pageNo + "> " + pageNo + " </a>";
                    }
                    */
                    
                    if(pageNo == currentPageNo){
                    	html += "<button type='button' class='number-btn' id='" + pageNo + "'style='background:#012c60;color:#fff;border-radius: 5px;'>"+pageNo+"</button>"
                    }else{
                    	html += "<button type='button' class='number-btn' id=" + pageNo + ">"+pageNo+"</button>"
                    }
                    
                    if (pageNo == lastPageNo) {
                        break;
                    }
                }

                disabled = "'";
                if (currentPageNo >= lastPageNo) {
                    disabled = "' disabled";
                }

                html += "<button type='button' class='next-btn" + disabled + " id=" + nextPageNo + ">" + nextPageNo + "</button>";
                html += "<button type='button' class='last-btn" + disabled + " id=" + lastPageNo + ">" + lastPageNo + "</button>";

                //html += " <span class='total'>(Total : " + ComUtils.numberWithCommas(data[0].totcnt) + ")</span>";
            }
            html += "<input type='hidden' id='currentPageNo' value=" + currentPageNo + ">";
            
            if(isExcel){
                html += '<button id="btnExport" onclick="excelDownload();" type="button" class="blueline-btn type-w100 func_save">엑셀다운로드</button>';
            }

            $("#" + htmlId).html(html);

            $("#" + htmlId + " button, #" + htmlId + " .number-btn").click(function(e) {
                if($(this).attr('id') != 'btnExport'){
                    func(Number($(this).attr("id")));
                }
            });
        }

        /**
         * @method      w2ui_alert
         * @param       msg - PopUp 메시지 출력 
         * @description     알림 팝업 공통 처리
         */
        ,
    alert: function(resp, funC) {
            try {
                if (w2popup.status == "open" || w2popup.status == "opening") return;
            } catch (e) {}
            var msg = "";
            if (typeof(resp) == "object") {
                //              msg += "[" + resp.errorCode + "] " + resp.message;
                msg += resp.message;
            } else {
                msg = resp;
            }

            if (this.isEmpty(funC)) {
                w2alert(msg).ok(function() {
                    return;
                });
            } else {
                w2alert(msg).ok(funC);
            }
        }
        ,
    layerAlert: function(msgStr, funC) { // 누가 디자인 좀 ㅋㅋㅋ
        try {
            if ($("#layerAlert").length > 0) {
                return;
            }
        } catch (e) {console.log(e)}
        var htmlStr  = '<div id="layerAlert" class="pop-wrap" style="display: none;z-index: 9999;">';
            htmlStr += '    <div class="pop-box" style="width: 400px;height: 250px;">';
            htmlStr += '        <div class="pop-content">';
            htmlStr += '            <textarea style="width: 100%; height: 150px; font-size: 16px; text-align: center;" disabled>' + msgStr + '</textarea>';
            htmlStr += '        </div>';
            htmlStr += '        <div class="fl-right" style="margin-top: 20px;">';
            if (this.isEmpty(funC)) {
                htmlStr += '            <button id="btnLayerClose" type="button" class="blueline-btn w60px" onclick="$(\'#layerAlert\').hide();$(\'#layerAlert\').remove();">확인</button>';
            } else {
                htmlStr += '            <button id="btnLayerClose" type="button" class="blueline-btn w60px" onclick="$(\'#layerAlert\').hide();' + funC + '();$(\'#layerAlert\').remove();">확인</button>';
            }
            htmlStr += '         </div>';
            htmlStr += '     </div>';
            htmlStr += '</div>';
            $(".content-wrap").append(htmlStr);
            $("#layerAlert").show();
    },
    confirm: function(msg, funC, funC2) {
        if (ComUtils.isEmpty(funC2)) {
            w2confirm(msg)
                .yes(funC);
        } else {
            w2confirm(msg)
                .yes(funC).no(funC2)
        }
    },
    clone: function(obj) {
        if (obj === null || typeof(obj) !== 'object') return obj;

        var copy = obj.constructor();

        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    },
    getMessage: function(langCd, msgId) {
        return GV_LANG[msgId]['msg' + langCd];
    },
    jsonClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    searchEvent: function(frm, func) {
        frm.find("input, select, textarea, hidden").each(function(i, item) {
            var type = ComUtils.getType(item);
            if (type == "radio") {
                $(item).change(function() {
                    func();
                });
            }else if (type == "select-one") {
                //2021.08 jquery.multiselect 관련수정
                $(item).on('selectmenuchange', function() {
                    func();
                });
            } else if (type = "text") {
                $(item).keyup(function(e) {
                    if (e.keyCode == 13) {
                        func();
                    }
                });

                if ($(item).hasClass("__jqueryDate")) {
                    $(item).on('changeDate', function() {
                        func();
                    });
                }
            }
        });
    },
    setTotalCount: function(id, data) {
        var item = this.getObj(id + "Cnt");
        var page = this.getObj(id + "Page");
        var cnt = 0;
        if (item.length == 0) {
            return;
        }
        if (!ComUtils.isEmpty(data)) {
            if (page.length > 0) {
                cnt = (data.length > 0) ? data[0].totcnt : 0;
            } else {
                if (typeof data == "number" || typeof data == "string") {
                    cnt = data;
                } else {
                    cnt = data.length;
                }
            }
        } else {
            var dataList = GridUtils.getAllData(id);
            cnt = dataList.length;
        }

        item[0].innerHTML = "Total Count : " + this.numberWithCommas(cnt);
    },
    getLocale: function() {
        return (new Intl.NumberFormat()).resolvedOptions().locale.toUpperCase();
    },
    getVideoType: function(url) {
        var extension = url.slice(url.lastIndexOf('.') + 1);
        var rtnVal;
        if (extension == 'mp4') {
            rtnVal = 'video/mp4';
        } else if (extension == 'm3u8') {
            rtnVal = 'application/x-mpegURL';
        } else {
            rtnVal = 'application/vnd.apple.mpegurl';
        }
        return rtnVal;
    },
    checkPwd: function(userId, pwd) {
        var rtn = "";
        var num = pwd.search(/[0-9]/g);
        var eng = pwd.search(/[a-z]/ig);
        var spe = pwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

        if (pwd.length < 8 || pwd.length > 16) {
            //rtn = "Password must be 8 - 16 characters in length, with combination of lettters, numbers, and special charadters.";
            rtn = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자를 사용해야 합니다.";
            ComUtils.alert(rtn);
            return false;
        } else if (num < 0 || eng < 0 || spe < 0) {
            //rtn = "Password must be 8 - 16 characters in length, with combination of lettters, numbers, and special charadters.";
            rtn = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자를 사용해야 합니다.";
            ComUtils.alert(rtn);
            return false;
        } else if (pwd.indexOf(userId) > -1) {
            //rtn = "You cannot use your ID as part of password string.";
            rtn = "ID를 비밀번호에 사용하실수 없습니다.";
            ComUtils.alert(rtn);
            return false;
            //             } else if(/(\w)\1\1/.test(pwd)){
            //                rtn = "You cannot use 3 or more sequencial characters or numbers (123, abc, 111).";
            //                ComUtils.alert(rtn);
            //                return false;
        }

        var SamePass_0 = 0; //동일문자 카운트
        var SamePass_1 = 0; //연속성(+) 카운드
        var SamePass_2 = 0; //연속성(-) 카운드

        for (var i = 0; i < pwd.length; i++) {
            var chr_pass_0 = pwd.charAt(i);
            var chr_pass_1 = pwd.charAt(i + 1);

            //동일문자 카운트
            if (chr_pass_0 == chr_pass_1) {
                SamePass_0 = SamePass_0 + 1
            }

            //연속성(+) 카운드
            if (chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1) {
                SamePass_1 = SamePass_1 + 1
            }

            //연속성(-) 카운드
            if (chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1) {
                SamePass_2 = SamePass_2 + 1
            }
        }

        if (SamePass_0 > 1) {
            //rtn = "You cannot use 3 or more sequencial characters or numbers (123, abc, 111).";
            rtn = "3글자 이상의 연속되거나 같은 문자를 사용하실수 없습니다. (123, abc, 111).";
            ComUtils.alert(rtn);
            return false;
        }

        if (SamePass_1 > 2 || SamePass_2 > 2) {
            rtn = "3글자 이상의 연속되거나 같은 문자를 사용하실수 없습니다. (123, abc, 111).";
            ComUtils.alert(rtn);
            return false;
        }

        return true;
    },
    objectInitialize: function(obj) {
        let self = this;
        self.obj = obj;
        
        $.each(obj, function (item_name, item) {
            let datatype = $.type(item);
    
            if (datatype == "number")
                self.obj[item_name] = 0;
            else if (datatype == "string")
                self.obj[item_name] = '';
            else if (datatype == "boolean")
                self.obj[item_name] = false;
            else if (datatype == "array")
                self.obj[item_name] = [];
            else if (datatype == "object")
                self.obj[item_name] = {};
        });
    },
    jsonSort: function(json, key, type) {
        if (ComUtils.isEmpty(type)) {
            type = "asc";
        }
        return json.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            if(type == "desc") {
                return x > y ? -1 : x < y ? 1 : 0;
            } else if(type == "asc") {
                return x < y ? -1 : x > y ? 1 : 0;
            }
        });
    },
    escapeHtml : function(string){
        var entityMap = { 
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '\"': '&quot;', "\'": '&#39;', '/': '&#x2F;',
            '`': '&#x60;', '=': '&#x3D;'
        };
        
        return String(string).replace(/[&<>"'`=\/]/g,
            function (s) {
                return entityMap[s];
            }
        );
    },
    unescapeHtml : function(string){
        if(!this.isEmpty(string)){
            return string.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
        }else{
            return '';
        }
    },
    fileSize : function(size){
        if (size < 1024) {
            return size+" byte";
        } else if (size < 1024 * 1024) {
            return (size/1024).toFixed(1) + "KB";
        } else if (size < 1024 * 1024 * 1024) {
            return (size/1024/1024).toFixed(1) + "MB";
        } else {
            return (size/1024/1024/1024).toFixed(1) + "GB";
        }
    },
    makeFileFormHelper : function(id, maxBytes, maxFiles, multiple, dataList, fileAccept){
        if(ComUtils.isEmpty(fileAccept)){
            fileAccept = [];
        }
        
        var isExist = $("#"+id + " .fh-file-select").length != 0;
        
        if(!isExist){
            var formName = $("#"+id).formhelper({
                maxBytes: maxBytes,
                maxFiles: maxFiles,
                language: {
                    selectFile: '파일등록',
                    acceptMsg: ''
                },
                onFail: function (e) {
                    console.log(e.msg);
                }
            });
            
            var fileUp = formName.addFilePicker({
                container: false,
                maxBytes: maxBytes,
                maxFiles: maxFiles,
                canRemove: true,
                canModify: true,
                showFileSize: false,
                fileInput: {
                    name : id+'Id[]',
                    accept : fileAccept,
                    multiple : multiple
                }
            });
            
            if(!ComUtils.isEmpty(dataList)){
                var data = [];
                for(var i=0; i < dataList.length; i++){
                    var temp = {};
                    temp.name = dataList[i].orgFileName;
                    temp.size = dataList[i].fileSize;
                    data.push(temp);
                    
                    fileUp.addFileBox({
                        showFileSize: false,
                        onRemove: function (config) {
                            if(typeof delAttachIds !== 'undefined'){
                                //뉴스, 발행물등..
                                delAttachIds.push(config.inputs.value);
                            }else{
                                //미디어 에셋에서 파일등록
                                $("#assetChangeYn").val("Y");
                            }
                        },
                        inputs: { name: 'hideValue', value: dataList[i].attachId },
                        files: [{
                            name : dataList[i].orgFileName,
                            size : dataList[i].fileSize,
                            id : dataList[i].attachId
                        }],
                    });
                }
            }
        }
        
    }
    
};

var TimeUtils = {
    makejQueryTime: function(i, item) {
            var format = ComUtils.nvl($(item).attr("data-format"), "HH:MM");
            $(item).attr({
                "readonly": "readonly"
            });
            if (format.indexOf("MM") >= 0) {
                $(item).css('width', '60');
            } else {
                $(item).css('width', '40');
            }
            format = format.replace("MM", "mm");

            var pickerOpt = {
                timeFormat: format,
                oneLine: true,
                controlType: 'select',
                interval: 10,
                minTime: '00:00',
                maxTime: '23:59',
                dynamic: false,
                dropdown: true,
                scrollbar: true
            };

            $(item).timepicker(pickerOpt);
        }

        ,
    makejQueryTimeToSec: function(i, item) {
        var format = ComUtils.nvl($(item).attr("data-format"), "HH:MM:SS");
        $(item).attr({
            "readonly": "readonly"
        });
        if (format.indexOf("MM") >= 0) {
            $(item).css('width', '60');
        } else {
            $(item).css('width', '40');
        }

        if (format.indexOf("SS") >= 0) {
            $(item).css('width', '70');
        } else {
            $(item).css('width', '60');
        }

        format = format.replace("MM", "mm");
        format = format.replace("SS", "ss");

        var pickerOpt = {
            timeFormat: format,
            oneLine: true,
            controlType: 'select',
            interval: 10,
            minTime: '00:00',
            maxTime: '23:59',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        };

        $(item).timepicker(pickerOpt);
    },
    makejQueryDate: function(i, item) {
        var format = ComUtils.nvl($(item).attr("data-format"), GV_DATE_FORMAT);
        var disabled = $(item).hasClass("text_disable");
        $(item).attr({"readonly": "readonly"});
        $(item).css('width', format.length * 9);
        format = format.replace("DD", "dd");
        format = format.replace("MM", "mm");
        format = format.replace("YYYY", "yy");

        var old_goToToday = $.datepicker._gotoToday;
        $.datepicker._gotoToday = function(id) {
            old_goToToday.call(this, id);
            this._selectDate(id);
        }

        var pickerOpt = {
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            showOn: 'button',
            buttonText: 'Show Date',
            buttonImageOnly: true,
            buttonImage: GV_CTX + '/resources/assets/img/button/cal.png',
            dateFormat: format
        };

        // 년월
        if (format.length == 5) {
            // Button [Clear, Select]
            var pickerButtons = function() {
                // Picker Icon을 눌렀을때만 현재 시간을 기준으로 보여주도록 해야함. 그렇게 하지 않으면 setValue 가 정상동작 하지 않음. 2018.11.21 by 류재명
                // if (!ComUtils.isEmpty(event) && $(event.target).hasClass("ui-datepicker-trigger")) {
                if (arguments != undefined && arguments.length > 0 && $(arguments[0]).hasClass("__jqueryDate")) {
                    var selectDate = TimeUtils.getDate($(item));
                    if (!ComUtils.isEmpty(selectDate)) {
                        var year = Number(selectDate.substring(0, 4));
                        var month = Number(selectDate.substring(4, 6)) - 1;
                        $(item).datepicker("option", "defaultDate", new Date(year, month, 1));
                    }
                }

                setTimeout(function() {
                    if ($(".ui-custom-clear").length == 0) {
                        // Clear Button
                        var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
                        var btn = $('<button class="ui-custom-clear ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: left;">Clear</button>');
                        btn.unbind("click").bind("click", function() {
                            $(item).datepicker('setDate', "");
                            $(item).datepicker("hide");
                            $(item).trigger('changeDate');
                        });
                        btn.appendTo(buttonPane);

                        // Select Button
                        var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
                        var btn = $('<button class="ui-custom-select ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: right;">Select</button>');
                        btn.unbind("click").bind("click", function() {
                            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                            $(item).datepicker('setDate', new Date(year, month, 1));
                            $(item).datepicker("hide");
                            $(item).trigger('changeDate');
                        });
                        btn.appendTo(buttonPane);
                    }
                }, 1);
            }

            pickerOpt.onChangeMonthYear = pickerButtons;
            pickerOpt.beforeShow = pickerButtons;
        }
        // 년월일
        else {
            // Button [Clear, Today]
            var pickerButtons = function() {
                setTimeout(function() {
                    if ($(".ui-custom-clear").length == 0) {
                        // Clear Button
                        var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
                        var btn = $('<button class="ui-custom-clear ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: left;">Clear</button>');
                        btn.unbind("click").bind("click", function() {
                            $(item).datepicker('setDate', "");
                            $(item).datepicker("hide");
                            $(item).trigger('changeDate');

                            if ($(item).is("[relationId]")) {
                                var relationId = $(item).attr("relationId");
                                $("#" + relationId).val("");
                                // ComUtils.setValue(relationId, "");
                            }
                        });
                        btn.appendTo(buttonPane);

                        // Select Button
                        var buttonPane = $(item).datepicker("widget").find(".ui-datepicker-buttonpane");
                        var btn = $('<button class="ui-custom-today ui-state-default ui-priority-secondary ui-corner-all" type="button" style="float: right;">Today</button>');
                        btn.unbind("click").bind("click", function() {
                            $(item).datepicker('setDate', new Date());
                            $(item).datepicker("hide");
                            $(item).trigger('changeDate');
                        });
                        btn.appendTo(buttonPane);
                    }
                }, 1);
            }

            // pickerOpt.onChangeMonthYear = changeYearButtons;
            pickerOpt.beforeShow = pickerButtons;
        }

        $(item).datepicker(pickerOpt);

        // 년월만 있는 경우
        if (format.length == 5) {
            $(item).focus(function() {
                $(".ui-datepicker-calendar").remove();
            });
        }

        if (disabled) {
            $(item).datepicker('disable');
        } else {
            //              if (format.length != 5) {
            //                  $(item).on("click", function () {
            //                      $(item).datepicker("show");
            //                  });
            //              }
        }

        if (format.length != 5) {
            $(item).on("click", function() {
                $(item).datepicker("show");
            });
        }
    },
    setDate: function(id, str) {
        var obj = ComUtils.getObj(id);
        if (ComUtils.isEmpty(str)) {
            $(obj).datepicker('setDate', '');
            return;
        }
        if (typeof str == "number") {
            str = str.toString();
        }
        if (typeof str == "string") {
            var str = str.replace(/[^0-9]/g, '');
            var yy = str.substring(0, 4);
            var mm = str.substring(4, 6);
            var dd = str.substring(6, 8);
            $(obj).datepicker('setDate', new Date(Number(yy), Number(mm) - 1, ComUtils.nvl(dd, "1")));
        } else {
            $(obj).datepicker('setDate', str);
        }
    },
    getDate: function(id) {
        var obj = ComUtils.getObj(id);
        var format = ComUtils.nvl($(obj).attr("data-format"), GV_DATE_FORMAT);
        var dateStr;
        if (ComUtils.isEmpty(obj.val())) {
            return "";
        } else {
            dateStr = obj.val();
        }
        var formatArray = format.split('/');
        var dateArray = dateStr.split('/');

        if (formatArray.length == 1) {
            formatArray = format.split('.');
            dateArray = dateStr.split('.');
        }
        if (formatArray.length == 1) {
            formatArray = format.split('-');
            dateArray = dateStr.split('-');
        }

        var yy = "",
            mm = "",
            dd = "";
        for (var i = 0; formatArray.length > i; i++) {
            var format = formatArray[i];

            switch (format) {
                case "YYYY":
                    yy = dateArray[i];
                    break;
                case "MM":
                    mm = dateArray[i];
                    break;
                case "DD":
                    dd = ComUtils.nvl(dateArray[i], "");
                    break;
            }
        }
        return yy + mm + dd;
    },
    setTime: function(id, str) {
        if (ComUtils.isEmpty(str)) return;
        var obj = ComUtils.getObj(id);
        var format = ComUtils.nvl($(obj).attr("data-format"), "HH:MM");
        var str = str.replace(/[^0-9]/g, '');
        var hh = str.substring(0, 2);
        var mm = str.substring(2, 4);
        var time = hh;
        if (!ComUtils.isEmpty(mm)) {
            time += ":" + mm;
        }
        $(obj).timepicker('setTime', time);
    },
    setTimeToSec: function(id, str) {
        if (ComUtils.isEmpty(str)) return;
        var obj = ComUtils.getObj(id);
        var format = ComUtils.nvl($(obj).attr("data-format"), "HH:MM:SS");
        var str = str.replace(/[^0-9]/g, '');
        var hh = str.substring(0, 2);
        var mm = str.substring(2, 4);
        var ss = str.substring(4, 6);
        var time = hh;
        if (!ComUtils.isEmpty(mm)) {
            time += ":" + mm;
        }
        if (!ComUtils.isEmpty(ss)) {
            time += ":" + ss;
        }
        $(obj).timepicker('setTime', time);
    },
    getTime: function(id) {
        var obj = ComUtils.getObj(id);
        var format = ComUtils.nvl($(obj).attr("data-format"), GV_DATE_FORMAT);
        var timeStr = "";
        if (ComUtils.isEmpty(obj.val())) {
            return "";
        } else {
            timeStr = obj.val();
        }

        return timeStr.replace(":", "");
    },
    getTimeToSec: function(id) {
            var obj = ComUtils.getObj(id);
            var format = ComUtils.nvl($(obj).attr("data-format"), GV_DATE_FORMAT);
            var timeStr = "";
            if (ComUtils.isEmpty(obj.val())) {
                return "";
            } else {
                timeStr = obj.val();
            }
            return timeStr.replace(":", "");
        }

        ,
    convertTimeZoneToPC: function(dt) {
        var rtnDt = TimeUtils.convertTimeZone(dt, GV_SYSTEM_TIMEZONE, GV_USER_TIMEZONE);
        rtnDt = rtnDt.replace(/[^0-9]/g, '');
        return rtnDt;
    },
    convertTimeZoneToServer: function(dt) {
        var rtnDt = TimeUtils.convertTimeZone(dt, GV_USER_TIMEZONE, GV_SYSTEM_TIMEZONE);
        rtnDt = rtnDt.replace(/[^0-9]/g, '');
        return rtnDt;
    },
    convertTimeZone: function(dt, fromGMT, toGMT) {
        if (ComUtils.isEmpty(dt)) {
            return "";
        } else if (typeof dt != "string") {
            return "NA";
        }

        fromGMT = fromGMT.substr(fromGMT.indexOf("+"));
        if (fromGMT.indexOf(":") == -1) {
            fromGMT = fromGMT + ":00";
        }

        // 2018-09-07T00:36:26+00:00
        var year = dt.substr(0, 4);
        var month = dt.substr(4, 2);
        var day = dt.substr(6, 2);
        var hour = ComUtils.nvl(dt.substr(8, 2), "00");
        var min = ComUtils.nvl(dt.substr(10, 2), "00");
        var second = ComUtils.nvl(dt.substr(12, 2), "00");
        var fromDtStr = year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + second + "" + fromGMT;
        var fromDt = new Date(fromDtStr);
        var toDt = this.changeTimeZone(fromDt, toGMT);
        return TimeUtils.dateFormat(toDt, "YYYYMMDDHH24MISS");
    },
    displayDateFormat: function(dt) {
        //var dt1 = TimeUtils.convertTimeZoneToPC(dt);
        GV_DATE_FORMAT = ComUtils.nvl(GV_DATE_FORMAT, 'YYYY.MM.DD');
        return TimeUtils.dateFormat(dt, GV_DATE_FORMAT + " HH24:MI:SS");
    },
    dateFormat: function(dt, format) {
        if (ComUtils.isEmpty(dt)) {
            return "";
        }
        format = ComUtils.nvl(format, GV_DATE_FORMAT);

        var d;
        if (dt.constructor == Date) {
            d = dt;
        } else if (typeof(dt) == 'number') {
            d = new Date(dt);
        } else if (typeof(dt) == 'string') {
            d = this.toDate(dt);
        }

        var rtn = format.replace(/(YYYY|YY|MM|DD|E|HH24|MI|SS)/gi, function($1) {
            switch ($1) {
                case "YYYY":
                    return d.getFullYear();
                case "YY":
                    return (d.getFullYear() % 1000).zf(2);
                case "MM":
                    return (d.getMonth() + 1).zf(2);
                case "DD":
                    return d.getDate().zf(2);
                case "HH24":
                    return d.getHours().zf(2);
                case "MI":
                    return d.getMinutes().zf(2);
                case "SS":
                    return d.getSeconds().zf(2);
                default:
                    return $1;
            }
        });
        return rtn;
    },
    toDate: function(sDate) {
        sDate = sDate.replace(/[^0-9]/g, '');
        var year, month, day, hour, min, second, millisecond;
        var d;
        year = sDate.substr(0, 4);
        month = sDate.substr(4, 2) - 1;
        day = sDate.substr(6, 2);
        if (sDate.length == 12) {
            hour = sDate.substr(8, 2);
            min = sDate.substr(10, 2);
            // d = new Date(year + "-" + month + "-" + day + " " + hour + ":"+ min + ":00 GMT+0000");
            d = new Date(year, month, day, hour, min);
        } else if (sDate.length > 12) {
            hour = sDate.substr(8, 2);
            min = sDate.substr(10, 2);
            second = sDate.substr(12, 2);
            // d = new Date(year + "-" + month + "-" + day + " " + hour + ":"+ min + ":" + second + " GMT+0000");
            d = new Date(year, month, day, hour, min, second);
        } else {
            // d = new Date(year + "-" + month + "-" + day + " 00:00:00 GMT+0000");
            d = new Date(year, month, day);
        }
        return new Date(d);

    },
    changeTimeZone: function(d, gmt) {
        var gmt = gmt.substr(gmt.indexOf("+"));
        var offsets = gmt.split(":");
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000 * offsets[0] + 60000 * offsets[1]));
        return nd;
    },
    addDays: function(days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    },
    addYears: function(years) {
        var date = new Date();
        date.setFullYear(date.getFullYear() + years);
        return date;
    },
    getTimeZone: function() {
        var offset = new Date().getTimezoneOffset(),
            o = Math.abs(offset);
        return "GMT" + (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
    },
    /* 2021.09.01 Baik : play time 변환 추가 */
    convertPlayTimeFormat: function (sec) {
        var hh = Math.floor(sec / (60 * 60));
        var mm = Math.floor(sec / 60) % 60;
        var ss = Math.floor(sec) % 60;
        return ComUtils.pad(hh, 2) + ":" + ComUtils.pad(mm, 2) + ":" + ComUtils.pad(ss, 2);
    }
    /*//2021.09.01 Baik */
}

var FileUtils = {
    excelGridDownload: function(url, data, gridData, colGroups) {
        var defaultName = GV_MENU_URL.substr(GV_MENU_URL.lastIndexOf("/") + 1);
        var excelGridData = GridUtils.getExcelGridData(data.gridId);

        defaultName = defaultName.substr(0, defaultName.indexOf("."));
        data.sheetName = ComUtils.nvl(data.sheetName, "Sheet1");
        data.fileName = ComUtils.nvl(data.sheetName, defaultName);

        if (!ComUtils.isEmpty(data.colGroups)) {
            data.colGroupList = data.colGroups;
        } else {
            data.colGroupList = excelGridData.colGroupList;
        }
        data.titleList = excelGridData.titleList;
        data.feildList = excelGridData.feildList;
        data.styleList = excelGridData.styleList;
        data.cdStyleList = {
            'style': 'text-align:center'
        };
        excelGridData.cdStyleList;
        GridUtils.save(data.gridId);
        if (!ComUtils.isEmpty(gridData)) {
            data.gridList = ComUtils.jsonClone(gridData);
        } else {
            data.gridList = ComUtils.jsonClone(GridUtils.getAllData(data.gridId));
        }


        // Renderer 처리
        var columns = w2ui[data.gridId].columns;
        var fieldName;
        for (var i in columns) {
            if (!ComUtils.isEmpty(columns[i].render) && columns[i].excelExport != 'N') {
                fieldName = columns[i].field;
                for (var j in data.gridList) {
                    if (columns[i].render.toString().indexOf('GridUtils.make') < 0) {
                        data.gridList[j][fieldName] = ComUtils.removeTag(columns[i].render(data.gridList[j]));
                    }
                }
            }
        }


        // url과 data를 입력받음
        if (url && data) {
            var inputs = '';
            for (var i in data) {
                inputs += '<textarea name="' + i + '" style="display:none">' + JSON.stringify(data[i]) + '</textarea>';
            }
            // request를 보낸다.
            jQuery('<form action="' + url + '" method="post">' + inputs + '</form>')
                .appendTo('body').submit().remove();
        };
    },
    excelGridAndChartDownload: function(url, data, titleData, chartData, chartImgUri) {
        var defaultName = GV_MENU_URL.substr(GV_MENU_URL.lastIndexOf("/") + 1);
        var excelGridData = GridUtils.getExcelGridData(data.gridId);
    
        defaultName = defaultName.substr(0, defaultName.indexOf("."));
        data.sheetName = ComUtils.nvl(data.sheetName, "Sheet1");
        data.fileName = ComUtils.nvl(data.sheetName, defaultName);
    
        data.colGroupList = excelGridData.colGroupList;
    
        data.titleList = excelGridData.titleList;
        data.feildList = excelGridData.feildList;
        data.styleList = excelGridData.styleList;
        data.cdStyleList = {
            'style': 'text-align:center'
        };
        excelGridData.cdStyleList;
        GridUtils.save(data.gridId);
    
        data.gridList = ComUtils.jsonClone(GridUtils.getAllData(data.gridId));
    
    
    
        // Renderer 처리
        var columns = w2ui[data.gridId].columns;
        var fieldName;
        for (var i in columns) {
            if (!ComUtils.isEmpty(columns[i].render) && columns[i].excelExport != 'N') {
                fieldName = columns[i].field;
                for (var j in data.gridList) {
                    if (columns[i].render.toString().indexOf('GridUtils.make') < 0) {
                        data.gridList[j][fieldName] = ComUtils.removeTag(columns[i].render(data.gridList[j]));
                    }
                }
            }
        } // url과 data를 입력받음 
        if (url && data) {
            var inputs = '';
            for (var i in data) {
                inputs += '<textarea name="' + i + '" style="display:none">' +
                    JSON.stringify(data[i]) + '</textarea>';
            } 
            if (!ComUtils.isEmpty(titleData)) {
                inputs += '<textarea name="chartTitleList" style="display:none">' + JSON.stringify(titleData) + '</textarea>';
            }
            if (!ComUtils.isEmpty(chartData)) {
                inputs += '<textarea name="chartData" style="display:none">' + JSON.stringify(chartData) + '</textarea>';
            }
            if (!ComUtils.isEmpty(chartImgUri)){
                inputs += '<textarea name="chartImgUri" style="display:none">' + chartImgUri + '</textarea>';
            } // request를 보낸다.
            jQuery('<form action="' + url + '" method="post">' + inputs + '</form>').appendTo('body').submit().remove();
        };
    },    
    excelQueryDownload: function(url, data) {
        var defaultName = GV_MENU_URL.substr(GV_MENU_URL.lastIndexOf("/") + 1);
        defaultName = defaultName.substr(0, defaultName.indexOf("."));
        data.sheetName = ComUtils.nvl(data.sheetName, "Sheet1");
        data.fileName = ComUtils.nvl(data.fileName, defaultName);

        // url과 data를 입력받음
        if (url && data) {
            var inputs = '';
            for (var i in data) {
                inputs += '<textarea name="' + i + '" style="display:none">' + JSON.stringify(data[i]) + '</textarea>';
            }
            // request를 보낸다.
            jQuery('<form action="' + url + '" method="post">' + inputs + '</form>')
                .appendTo('body').submit().remove();
        };
    },
    /**
     * fileId - input(file) tag id
     * thumnailId - img tag id
     * value - chage value (this)
     */
    loadImg: function(fileId, thumnailId, value, type, beforeSrc, beforeFile, fileNm) {
        if (value.files && value.files[0]) {
            type = ComUtils.nvl(type, CONST.FILE_TYPE.ALL);

            var mime = value.files[0].type; //.split('/')[0];

            if (type == CONST.FILE_TYPE.IMG) {
                if (mime.indexOf("image") == -1) {
                    ComUtils.alert('Select image file only<br>(ex.jpg, jpeg, png etc..)');
                    ComUtils.setValue(fileId, '');
                    return;
                }
            } else if (type == CONST.FILE_TYPE.DOC) {
                if (mime.indexOf("officedocument") == -1 && mime.indexOf("pdf") == -1 &&
                    mime.indexOf("vnd.ms") == -1) {
                    ComUtils.alert('Select image file only<br>(ex.pdf, ppt, pptx, xls..)');
                    ComUtils.setValue(fileId, '');
                    return;
                }
            } else {
                if (mime.indexOf("image") == -1 && mime.indexOf("officedocument") == -1 &&
                    mime.indexOf("pdf") == -1 && mime.indexOf("vnd.ms") == -1) {
                    ComUtils.alert('File type not allowed.');
                    ComUtils.setValue(fileId, '');
                    return;
                }
            }

            if (mime.indexOf("image") >= 0) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('#' + thumnailId).attr('src', e.target.result);
                }
                reader.readAsDataURL(value.files[0]);
            } else if (mime.indexOf("officedocument") >= 0 || mime.indexOf("pdf") >= 0 || mime.indexOf("vnd.ms") >= 0) {
                $('#' + thumnailId).attr('src', GV_CTX + '/resources/assets/images/common/document.png');
            }
        } else {
            // FILE을 선택하지 않고 취소했을 경우, 이전에 선택했던 파일이 있으면, 해당정보를 셋팅.
            if (!ComUtils.isEmpty(beforeFile)) {
                $('#' + thumnailId).attr('src', beforeSrc);
                ComUtils.setValue(fileNm, beforeFile.name);
            }
        }
    },
    /**
     * fileNm - file name
     * thumnailId - img tag id
     */
    setImgFile: function(thumnailId, fileNm) {
        var obj = ComUtils.getObj(thumnailId);
        if (fileNm) {
            var ext = "";
            try {
                ext = fileNm.substring(fileNm.lastIndexOf(".")).toLowerCase();
            } catch (e) {}
            if (".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,".indexOf(ext + ",") >= 0) {
                obj.attr('src', GV_CTX + '/resources/assets/images/common/document.png');
            } else {
                //                obj.attr('src', GV_CTX+'/getAssetShow.do?url=' + fileNm);
                obj.attr('src', GV_CTX+'/getAssetShow.do?url=' + fileNm);
            }
        } else {
            obj.attr('src', GV_CTX + '/resources/assets/images/common/noImage.png');
        }
    },
    getFileExtension: function(filePath) {
        var file = filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
        var fileType;
        if (file.indexOf('.') >= 0) {
            fileType = file.substring(file.lastIndexOf('.') + 1, file.length);
        } else {
            fileType = '';
        }
        return fileType;
    },
    getFileName: function(filePath) {
        var file = filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
        var filename;
        if (file.indexOf('.') >= 0) {
            filename = file.substring(0, file.lastIndexOf('.'));
        } else {
            filename = file;
        }
        return filename;
    }
}

var GridUtils = {
    /**
     * @method drawGrid
     * @param gridId - grid가 그려지는 부분 id
     * @param dataUrl - json 데이터를 가져오는 경로
     * @description grid를 그림. reorderRows를 사용하려면 lineNumbers도 있어야 됨. 2018.04.27 김수형
     */
    drawGrid: function(params, isInfo) {
        var id = params.id;
        // 2018.11.02 Grid info 보여주기
        try {
            isInfo = ComUtils.nvl(isInfo, 'N');
            // 2018.11.05 info 컬럼이 존재할 경우는 제외하도록 !params.columns[0].hasOwnProperty('info') 추가
            if (isInfo != "N" && !params.columns[0].hasOwnProperty('info')) {
                var col = {
                    field: '',
                    caption: 'i',
                    size: '28px',
                    style: 'text-align:center',
                    info: true
                };
                if (params.columns[0].frozen == true) {
                    col.frozen = true;
                }
                params.columns.unshift(col);
                if (!ComUtils.isEmpty(params.columnGroups)) {
                    params.columnGroups.unshift({
                        caption: "",
                        master: true,
                        span: 1
                    });
                }
            }
        } catch (e) {}

        // Sortable 표시해주기
        var columns = params.columns;
        for (var i in columns) {
            if (columns[i].sortable) {
                columns[i].caption = "<div class='sortable'>" + columns[i].caption + "</div>"
            }
            if (!ComUtils.isEmpty(params.onColumnClick)) {
                if (!ComUtils.isEmpty(params.onColumnClick.columns)) {
                    if (params.onColumnClick.columns.indexOf(columns[i].field) != -1) {
                        columns[i].caption = "<div class='sortable'>" + columns[i].caption + "</div>"
                    }
                }
            }
            if (!ComUtils.isEmpty(params.onColumnInfo)) {
                if (!ComUtils.isEmpty(params.onColumnInfo.columns)) {
                    if (params.onColumnInfo.columns.indexOf(columns[i].field) != -1) {
                        columns[i].caption = "<div class='columnInfo'>" + columns[i].caption + "</div>"
                    }
                }
            }
        }

        var name = (ComUtils.isEmpty(params.name) ? id : params.name);
        $('#' + id).w2grid({
            name: name,
            fixedBody: (ComUtils.isEmpty(params.fixedBody) ? true : params.fixedBody),
            show: {
                selectColumn: (ComUtils.isEmpty(params.isCheck) ? false : params.isCheck),
                lineNumbers: (ComUtils.isEmpty(params.lineNumbers) ? false : params.lineNumbers),
                expandColumn: (ComUtils.isEmpty(params.expandColumn) ? false : params.expandColumn)
                //                  footer      : true,
                //                  selectColumn: true,
            },
            multiSelect: (ComUtils.isEmpty(params.multiSelect) ? false : params.multiSelect),
            reorderRows: true,
            selectType: 'row',
            //                lineHTML: (ComUtils.isEmpty(params.lineHTML) ? null : params.lineHTML), 
            lineHTML: '≡', // 고정
            method: 'GET', // need this to avoid 412 error on Safari
            columnGroups: params.columnGroups,
            columns: params.columns,
            searches: (ComUtils.isEmpty(params.searches) ? null : params.searches),
            /* records: (ComUtils.isEmpty(params.records) ? null : params.records), */
            onClick: (ComUtils.isEmpty(params.onClick) ? null : params.onClick),
            onColumnInfo: (ComUtils.isEmpty(params.onColumnInfo) ? null : function(event, a, b) {
                if (!ComUtils.isEmpty(params.onColumnInfo.columns)) {
                    if (params.onColumnInfo.columns.indexOf(event.field) != -1) {
                        w2ui[event.target].infoField = event.field;
                    }
                }
            }),
            onColumnClick: (ComUtils.isEmpty(params.onColumnClick) ? null : function(event, a, b) {
                if (!ComUtils.isEmpty(params.onColumnClick.columns)) {
                    if (params.onColumnClick.columns.indexOf(event.field) != -1) {
                        if (w2ui[event.target].sortField != event.field) {
                            w2ui[event.target].orderBy = null;
                        }
                        w2ui[event.target].sortField = event.field;
                        w2ui[event.target].orderBy = (ComUtils.isEmpty(w2ui[event.target].orderBy) || w2ui[event.target].orderBy == 'asc') ? 'desc' : 'asc';
                        if (!ComUtils.isEmpty(GridUtils.getRowData(event.target, 1))) {
                            params.onColumnClick.func(GridUtils.getRowData(event.target, 1).rnum);
                        }
                    }
                }
            }),
            onSelect: (ComUtils.isEmpty(params.onSelect) ? null : params.onSelect),
        }).refresh();
        w2ui[name].recordHeight = (ComUtils.isEmpty(params.recordHeight) ? 28 : params.recordHeight);

        if (!ComUtils.isEmpty(params.records)) {
            this.setRecords(name, params.records);
        }

        if (!ComUtils.isEmpty(w2ui[id])) {
            w2ui[id].refresh();
            if (!ComUtils.isEmpty(params.onColumnClick)) {
                w2ui[id].sortField = params.onColumnClick.defaultField;
                w2ui[id].orderBy = params.onColumnClick.defaultOrderBy;
            }
        }
    },
    setSortByParams: function(id, data) {
        data.sortField = w2ui[id].sortField;
        data.orderBy = w2ui[id].orderBy;

        return data;
    },
    setRecords: function(id, gridData) {
        if (ComUtils.isEmpty(gridData)) {
            gridData = [];
        }
        for (var i = 0; i < gridData.length; i++) {
            gridData[i].recid = (i + 1);
        }

        w2ui[id].records = gridData;
        w2ui[id].selectNone();
        //              w2ui[id].refresh();

        w2ui[id].reload();
        ComUtils.setTotalCount(id, gridData);

        // Sort Icon clear
        $("#" + id).find(".w2ui-sort-down, .w2ui-sort-up").removeClass("w2ui-sort-up").removeClass("w2ui-sort-down");

        if (!ComUtils.isEmpty(w2ui[id].sortField) && !ComUtils.isEmpty(w2ui[id].orderBy)) {
            w2ui[id].sort(w2ui[id].sortField, w2ui[id].orderBy);
        }
    },
    add: function(id, rowData) {
        var maxRecid = 0;
        for (var i = 0; i < w2ui[id].records.length; i++) {
            if (maxRecid < w2ui[id].records[i].recid) {
                maxRecid = w2ui[id].records[i].recid;
            }
        }
        rowData.recid = maxRecid + 1;
        w2ui[id].add(rowData);
        return rowData.recid;
    },
    addFirstRow : function(id, rowData){
        if(!ComUtils.isEmpty(rowData)){
            if(rowData.length > 0){
                for(var j=0; j<rowData.length; j++){
                    var addRowData = rowData[j];
                    var maxRecid = 0;
                    for (var i = 0; i < w2ui[id].records.length; i++) {
                        if (maxRecid < w2ui[id].records[i].recid) {
                            maxRecid = w2ui[id].records[i].recid;
                        }
                    }
                    addRowData.recid = maxRecid + 1;
                    w2ui[id].add(addRowData, true);
                }
            }else{
                var maxRecid = 0;
                for (var i = 0; i < w2ui[id].records.length; i++) {
                    if (maxRecid < w2ui[id].records[i].recid) {
                        maxRecid = w2ui[id].records[i].recid;
                    }
                }
                rowData.recid = maxRecid + 1;
                w2ui[id].add(rowData, true);
            }
        }
        return rowData.recid;
    },
    set: function(id, recid, rowData) {
        w2ui[id].set(recid, rowData);
    },
    remove: function(id, index) {
        if (!ComUtils.isEmpty(index)) {
            w2ui[id].remove(index);
        } else {
            if (w2ui[id].getSelection().length) {
                w2ui[id].delete(true);
            }
        }
        w2ui[id].selectNone();
    },
    // 박민철 - layer팝업으로 grid 여러번 draw 시 중복 방지 
    destroyGrid: function(id){
        if (!ComUtils.isEmpty(w2ui[id])) {
            w2ui[id].destroy();
        }
    },
    // 박민철 - lineNumbers 토글 적용/숨기기/보이기
    toggleLineNumbers: function(id){
    	w2ui[id].show.lineNumbers = !w2ui[id].show.lineNumbers;
    	w2ui[id].refresh();
    },
    hideLineNumbers: function(id){
    	w2ui[id].show.lineNumbers = false;
    	w2ui[id].refresh();
    },
    showLineNumbers: function(id){
    	w2ui[id].show.lineNumbers = true;
    	w2ui[id].refresh();
    },
    find: function(id, data) {
        return w2ui[id].find(data);
    },
    select: function(id, recid) {
        w2ui[id].select(recid);
    },
    unselect: function(id, recid) {
        w2ui[id].unselect(recid);
    },
    sort: function(id, field, direction) {
        w2ui[id].sort(field, direction);
    },
    save: function(id) {
        w2ui[id].save();
    },
    getAllData: function(id) {
        return w2ui[id].records;
    },
    getSelectIndex: function(id) {
        return w2ui[id].getSelection();
    },
    getSelectionData: function(id) {
        var idx = this.getSelectIndex(id);
        return w2ui[id].get(idx[0]);
    },
    getSelectionMultiData: function(id) {
        var rtnVal = [];
        $.each(w2ui[id].getSelection(), function(index, item) {
            rtnVal.push(w2ui[id].get(item));
        });

        return rtnVal;
    },
    getRowData: function(id, idx) {
        return w2ui[id].get(idx);
    },
    selectEvent: function(id, callBack) {
        w2ui[id].on('select', function(event) {
            event.onComplete = function() {
                callBack(event);
            }
        });
    },
    unselectEvent: function(id, callBack) {
        w2ui[id].on('unselect', function(event) {
            event.onComplete = function() {
                callBack(event);
            }
        });
    },
    clickEvent: function(id, callBack) {
        w2ui[id].on('click', function(event) {
            event.onComplete = function() {
                callBack(event);
            }
        });
    },
    gridSearchBox: function(name) {
        var html = $("input[name=" + name + "]");
        html.attr('class', 'w2ui-search-all');
        html.attr('tabindex', '-1');
        html.attr('placeholder', 'All Fields');
        html.attr('onfocus', 'clearTimeout(w2ui["' + name + '"].last.kbd_timer)');
        html.keydown(function(event) {
            if (event.keyCode == 13) {
                var grid = w2ui[name];
                var val = this.value;
                var sel = jQuery(html).data('selected');
                var fld = jQuery(html).data('w2field');
                if (fld) val = fld.clean(val);
                if (fld && fld.type == 'list' && sel && typeof sel.id == 'undefined') {
                    grid.searchReset();
                } else {
                    for (i in grid.searches) {
                        if (grid.searches[i].type == 'text') grid.searches[i].operator = 'contains';
                    }
                    grid.search(grid.last.field, val);
                }
            }
        });
    },
    makeInputRender: function(params) {
        var id = ComUtils.nvl(params.id);
        var treeId = ComUtils.nvl(params.treeId);
        var rowData = ComUtils.nvl(params.rowData);
        var cssClass = ComUtils.nvl(params.cssClass);
        //MOD-000038 그리드 render에 이벤트 사용할수 있도록 추가
        var event = ComUtils.nvl(params.event);
        //2021.10.18 인풋 박스 클릭,포커스,키누름 이벤트 추가 by 박민철 
        var clickEvent = ComUtils.nvl(params.clickEvent);
        var focusEvent = ComUtils.nvl(params.focusEvent);
        var keyUpEvent = ComUtils.nvl(params.keyUpEvent);

        if (cssClass.indexOf("text_disable") >= 0) {
            params.option += " style=\"background:'#f2f2f2'\" readonly disabled";
        }

        if (!ComUtils.isEmpty(event)) {
            event = event + "(this);"
        }

        var option = ComUtils.nvl(params.option);
        var changeFunc = "";
        if (!ComUtils.isEmpty(treeId)) {
            changeFunc = " onchange=\"w2ui['" + treeId + "'].get(" + rowData.recid + ")." + id + "=ComUtils.getValue(this);" +
                " w2ui['" + treeId + "'].get(" + rowData.recid + ").isChanged=true;" + event + "\"";
        }
        
        var clickFunc = "";
        if(!ComUtils.isEmpty(clickEvent)){
        	clickEvent = clickEvent + "(this)";
        	clickFunc = "onclick=\"" + clickEvent + "\" "
        }
        
        var focusFunc = "";
        if(!ComUtils.isEmpty(focusEvent)){
        	focusEvent = focusEvent + "(this)";
        	focusFunc = "onfocus=\"" + focusEvent + "\" "
        }
        
        var keyUpFunc = "";
        if(!ComUtils.isEmpty(keyUpEvent)){
        	keyUpEvent = keyUpEvent + "(this,'"+rowData.recid+"')";
        	keyUpFunc = "onKeyUp=\"" + keyUpEvent + "\" "
        }
        
        cssClass = (ComUtils.isEmpty(cssClass) ? " " : "class=\"" + cssClass + "\" ");

        // 2018.11.21 Grid 내의 숫자 컴럼 처리 by 류재명
        var value = ComUtils.nvl(rowData[id]);
        if (cssClass.indexOf("text_number") >= 0 || cssClass.indexOf("text_float") >= 0 || cssClass.indexOf("text_price") >= 0) {
            value = ComUtils.numberWithCommas(value);
        }
        var html = "<input type=\"text\" name=\"" + id + "\" value=\"" + value + "\"" + cssClass + ComUtils.nvl(option) + changeFunc + clickFunc + focusFunc + keyUpFunc + ">";
        return html;
    },
    makeComboRender: function(params) {
        var id = ComUtils.nvl(params.id);
        var treeId = ComUtils.nvl(params.treeId);
        var codeList = params.codeList;
        var rowData = ComUtils.nvl(params.rowData);
        var spaceName = params.spaceName;
        var cssClass = ComUtils.nvl(params.cssClass);
        var option = ComUtils.nvl(params.option);
        var c_code = ComUtils.nvl(params.c_code, "cd");
        var v_code = ComUtils.nvl(params.v_code, "cdNm");
        var event = ComUtils.nvl(params.event);

        if (!ComUtils.isEmpty(event)) {
            event = event + "(this);"
        }

        var obj = ComUtils.getObj(id);

        //--------------------------
        var changeFunc = "";
        if (!ComUtils.isEmpty(treeId)) {
            changeFunc = " onchange=\"w2ui['" + treeId + "'].get(" + rowData.recid + ")." + id + "=ComUtils.getValue(this);" +
                " w2ui['" + treeId + "'].get(" + rowData.recid + ").isChanged=true;" + event + "\"";
        }
        var html = "<div class='hmg-form-select w100p'>";
        html += "<select name=\"" + id + "\" " + (ComUtils.isEmpty(cssClass) ? " " : "class=\"" + cssClass + "\" ") + ComUtils.nvl(option) + changeFunc + ">";



        if (spaceName != undefined) {
            html += "<option value=\"\">" + spaceName + "</option>";
        }
        for (var i in codeList) {
            //item = codeList[i];
            // ie 일때 . 브라우져가 type 을 단순 Object 로 받는 현상이 있음.
            // [2012.10.21:전영우] 해당 객체의 object 가  undefined 인 경우 동작이 안되도록 함.
            var itemDtl = JSON.stringify(codeList[i]);
            if (typeof itemDtl != 'undefined') {
                var item = JSON.parse(itemDtl);
                if (rowData[id] == item[c_code]) {
                    html += "<option value=\"" + item[c_code] + "\" selected=\"selected\">" + item[v_code] + "</option>";
                } else {
                    html += "<option value=\"" + item[c_code] + "\">" + item[v_code] + "</option>";
                }
            }
        }
        html += "</select>";
        html += "</div>";
        return html;
    },
    makeCheckBoxRender: function(params) {
        var id = ComUtils.nvl(params.id);
        var checkValue = ComUtils.nvl(params.checkValue);
        var treeId = ComUtils.nvl(params.treeId);
        var rowData = ComUtils.nvl(params.rowData);
        var cssClass = ComUtils.nvl(params.cssClass);
        var option = ComUtils.nvl(params.option);
        var event = ComUtils.nvl(params.event);
        var refreshRow = ComUtils.nvl(params.refreshRow);

        if (!ComUtils.isEmpty(event)) {
            event = event + "(this);"
        }

        if (!ComUtils.isEmpty(refreshRow)) {
            refreshRow = "w2ui['" + treeId + "'].refreshRow(" + rowData.recid + ");"
        }

        var changeFunc = "";
        if (!ComUtils.isEmpty(treeId)) {
            changeFunc = " onclick=\"w2ui['" + treeId + "'].get(" + rowData.recid + ")." + id + "=ComUtils.getValue(this);" + " w2ui['" + treeId + "'].get(" + rowData.recid + ").isChanged=true;" + event + refreshRow + "\"";
        }
        var html = '<div class="hmg-form-checkbox">';
        //html += "<input type='checkbox' id='"+rowData.recid+"' name='" + id + "' value='" + checkValue + "'" + (rowData[id] == checkValue ? " checked " : " ") + (ComUtils.isEmpty(cssClass) ? " " : "class='" + cssClass + "' ") + ComUtils.nvl(option) + changeFunc + ">";
        html += "<input type='checkbox' id='"+id+'-'+rowData.recid+"' name='" + id + "' value='" + checkValue + "'" + (rowData[id] == checkValue ? " checked " : " ") + (ComUtils.isEmpty(cssClass) ? " " : "class='" + cssClass + "' ") + ComUtils.nvl(option) + changeFunc + ">";
        html += '<label for="'+id+'-'+rowData.recid+'">'+checkValue+'</label>'
        html += '</div>';
        
        //html += "<input type='checkbox' name='" + id + "' value='" + checkValue + "'" + (rowData[id] == checkValue ? " checked " : " ") + (ComUtils.isEmpty(cssClass) ? " " : "class='" + cssClass + "' ") + ComUtils.nvl(option) + changeFunc + ">";
        return html;
    },
    clear: function(id) {
        return w2ui[id].clear();
    },
    refreshAll: function() {
        for (var key in w2ui) {
            if (!key.indexOf("_toolbar") >= 0) {
                w2ui[key].refresh();
            }
        }
    },
    makeRadioBoxRender: function(params) {
        var id = ComUtils.nvl(params.id);
        var resetValue = ComUtils.nvl(params.resetValue);
        var checkValue = ComUtils.nvl(params.checkValue);
        var treeId = ComUtils.nvl(params.treeId);
        var rowData = ComUtils.nvl(params.rowData);
        var cssClass = ComUtils.nvl(params.cssClass);
        var option = ComUtils.nvl(params.option);
        var event = ComUtils.nvl(params.event);

        if (!ComUtils.isEmpty(event)) {
            event = event + "(this);"
        }

        var changeFunc = "";
        if (!ComUtils.isEmpty(treeId)) {
            changeFunc = " onclick=\"GridUtils.resetColumns('" + id + "', '" + resetValue + "','" + treeId + "','" + rowData.recid + "');" +
                " w2ui['" + treeId + "'].get(" + rowData.recid + ")." + id + "=ComUtils.getValue(this);" +
                " w2ui['" + treeId + "'].get(" + rowData.recid + ").isChanged=true;" + event + "\"";
        }

        var html = "<input type='radio' name='" + id + "' id='" + id + "_" + rowData.recid + "' value='" + checkValue + "'" + (rowData[id] == checkValue ? " checked " : " ") + (ComUtils.isEmpty(cssClass) ? " " : "class='" + cssClass + "' ") + ComUtils.nvl(option) + changeFunc + ">";
        return html;
    },
    makeRadioListRender: function(params) {
        var id = ComUtils.nvl(params.id);
        var codeList = params.codeList;
        var resetValue = ComUtils.nvl(params.resetValue);
        var checkValue = ComUtils.nvl(params.checkValue);
        var treeId = ComUtils.nvl(params.treeId);
        var rowData = ComUtils.nvl(params.rowData);
        var event = ComUtils.nvl(params.event);
        var cssClass = ComUtils.nvl(params.cssClass);
        var option = ComUtils.nvl(params.option);
        var c_code = ComUtils.nvl(params.c_code, "cd");
        
        if (!ComUtils.isEmpty(event)) {
            event = event + "(this);"
        }
        
        var changeFunc = "";
        if (!ComUtils.isEmpty(treeId)) {
            changeFunc = " onclick=\" w2ui['" + treeId + "'].get(" + rowData.recid + ")." + id + "=ComUtils.getValue(this);" +
            " w2ui['" + treeId + "'].get(" + rowData.recid + ").isChanged=true;" + event + "\"";
        }
        
        var count = 0;
        var html = '';
        html += '<div class="hmg-form-radio">';
        
        for (var i in codeList) {
            var itemDtl = JSON.stringify(codeList[i]);
            if (typeof itemDtl != 'undefined') {
                if(count > 0){
                    option = 'style="appearance: none; margin-left:30px;"';
                }else{
                    option = 'style="appearance: none;"';
                }
                var item = JSON.parse(itemDtl);
                var radioId = id+"_"+rowData.recid+"_"+item[c_code];
                html += "<input type='radio' name='" + id + "_" + rowData.recid + "' id='" + radioId + "' value='" + item[c_code] + "'" + (item[c_code] == checkValue ? " checked " : " ") + (ComUtils.isEmpty(cssClass) ? " " : "class='" + cssClass + "' ") + ComUtils.nvl(option) + changeFunc + ">";
                html += '<label for="'+radioId+'">'+item[c_code]+'</label>';
                count++;
            }
        }
        html += '</div>';
        return html;
    },
    /**
     * columId    : 초기화 할 컬럼명
     * resetValue : 초기화 할 값
     *  treeId    : 그리드 아이디
     *  recid     : 해당 row recid
     */
    resetColumns: function(columId, resetValue, treeId, recid) {
        var gridData = GridUtils.getAllData(treeId);

        $.each(gridData, function(i, v) {
            gridData[i][columId] = resetValue;
        });

        // gridData[recid - 1][columId] =gridData[recid - 1].colorCd;
    },
    selectNone: function(id) {
        return w2ui[id].selectNone();
    },
    drawExpandGrid: function(parent, subColumns, initSubgridRecords, subTitle) {
        var recordHeight = 28;
        var columnHeight = 59;
        var maxHeight = 200;
        var prevRecid;
        var existGridList = [];

        w2ui[parent].on('expand', function(event) {
            var tempRecords = [];
            var sg = 'subgrid-' + event.recid;

            if (existGridList.indexOf(sg) == -1) {
                existGridList.push(sg);
            }

            if (prevRecid != undefined && prevRecid != event.recid) {
                w2ui[parent].collapse(prevRecid);
            }

            prevRecid = event.recid;

            if (w2ui.hasOwnProperty(sg)) {
                tempRecords = w2ui[sg].records;
                w2ui[sg].destroy();
            } else {
                var tempRecid = event.recid;
                if (Array.isArray(tempRecid)) {
                    tempRecid = tempRecid[0];
                }
                tempRecords = initSubgridRecords(tempRecid);
            }
            var height = tempRecords.length * recordHeight + columnHeight;
            if (height > maxHeight) height = maxHeight;
            $('#' + event.box_id).css({
                margin: '5px',
                padding: '5px',
                width: '96%'
            }).animate({
                height: height
            }, 100);
            $('#' + event.fbox_id).css({
                margin: '5px',
                padding: '5px',
                width: '96%'
            }).animate({
                height: height
            }, 100);

            setTimeout(function() {
                var subId = event.box_id;

                if (subTitle != undefined) {
                    var subHeight = height - 8;
                    $('#' + event.box_id).html(
                        "<div id='subBox'>" +
                        "<div style='width:8%; float:left'>" +
                        "<h4>" + subTitle + "</h4>" +
                        "</div>" +
                        "<div id='subgrid' style='width:90%; height:" + subHeight + "px; float:right'>" +
                        "</div>" +
                        "</div>"
                    );
                    subId = 'subgrid';
                }

                GridUtils.drawGrid({
                    id: subId,
                    columns: subColumns,
                    records: tempRecords,
                    name: sg
                });
                w2ui[parent].resize(); // 2018.11.13 김수형 expand 후 스크롤이 생기지 않는 문제를 해결하기 위해 추가.
            }, 300);
        });

        if (subTitle != undefined) {
            w2ui[parent].on('collapse', function(event) {
                prevRecid = undefined;
                $(this.box).find('#subBox').slideUp(200);
            });
        }

        return {
            getSelectRecid: function() {
                return prevRecid;
            },
            init: function() {
                prevRecid = undefined;

                var length = existGridList.length;
                for (var i = 0; i < length; i++) {
                    w2ui[existGridList.pop()].destroy();
                }
            }
        }
    },
    gridTransfer: function(params) {
        var leftGrid = ComUtils.nvl(params.leftGrid);
        var rightGrid = ComUtils.nvl(params.rightGrid);
        var transferBtnId = ComUtils.nvl(params.transferBtnId);
        var subColunms = ComUtils.nvl(params.subColumns);
        var initSubgridRecords = ComUtils.nvl(params.initSubgridRecords);

        var recordHeight = 28;
        var columnHeight = 59;
        var maxHeight = 200;
        var expandEvent;
        var changed = false;
        var existGridList = [];

        w2ui[rightGrid].on('expand', function(event) {
            var tempRecords = [];
            var sg = 'subgrid-' + event.recid;

            if (existGridList.indexOf(sg) == -1) {
                existGridList.push(sg);
            }

            // 클릭 Row를 제외하고 닫음(라디오 버튼 기능) 
            if (w2ui[leftGrid].expandRecid != undefined && w2ui[leftGrid].expandRecid != event.recid) {
                w2ui[rightGrid].collapse(w2ui[leftGrid].expandRecid);
            }

            expandEvent = event;
            w2ui[leftGrid].expandRecid = event.recid;

            // Subgrid가 존재하면 레코드를 임시 저장하고 grid를 삭제, 없으면 initSubgridRecords에서 레코드를 호출
            if (w2ui.hasOwnProperty(sg)) {
                tempRecords = w2ui[sg].records;
                w2ui[sg].destroy();
            } else {
                var tempRecid = event.recid;
                if (Array.isArray(tempRecid)) {
                    tempRecid = tempRecid[0];
                }
                tempRecords = initSubgridRecords(tempRecid);
            }
            var height = tempRecords.length * recordHeight + columnHeight;
            if (height > maxHeight) height = maxHeight;
            $('#' + event.box_id).css({
                margin: '5px',
                padding: '5px',
                width: '96%'
            }).animate({
                height: height
            }, 100);
            $('#' + event.fbox_id).css({
                margin: '5px',
                padding: '5px',
                width: '96%'
            }).animate({
                height: height
            }, 100);

            setTimeout(function() {
                GridUtils.drawGrid({
                    id: event.box_id,
                    columns: subColumns,
                    records: tempRecords,
                    name: sg
                });
                w2ui[rightGrid].resize();
            }, 300);
        });

        w2ui[rightGrid].on('collapse', function(event) {
            expandEvent = undefined;
            w2ui[leftGrid].expandRecid = undefined;
        });

        return {
            // Subgrid row 삭제
            remove: function(recid, func) {
                var sg = 'subgrid-' + expandEvent.recid;

                changed = true;

                func(w2ui[sg].get(recid));
                w2ui[sg].remove(recid);

                var height = w2ui[sg].records.length * recordHeight + columnHeight;
                if (height > maxHeight) height = maxHeight;
                $('#' + expandEvent.box_id).css('height', height);
                $('#' + expandEvent.fbox_id).css('height', height);

                setTimeout(function() {
                    w2ui[rightGrid].resize();
                    w2ui[sg].resize();
                    w2ui[sg].refresh();
                }, 300);
            },
            bind: function() {
                var rightRecords = w2ui[rightGrid].records;
                for (i in rightRecords) {
                    var sg = 'subgrid-' + rightRecords[i].recid;
                    if (w2ui.hasOwnProperty(sg)) {
                        rightRecords[i].childList = w2ui[sg].records;
                    }
                }
            },
            transfer: function() {
                var leftRecords = w2ui[leftGrid].records;

                if (expandEvent != undefined) {
                    var isExistSelected = false;
                    var sg = 'subgrid-' + expandEvent.recid;

                    for (i in leftRecords) {
                        if (leftRecords[i].selection && !leftRecords[i].disabled) {
                            isExistSelected = true;
                            changed = true;

                            //                                  leftRecords[i].originRecid = leftRecords[i].recid; 
                            GridUtils.add(sg, ComUtils.clone(leftRecords[i]));
                            leftRecords[i].disabled = true;
                        }
                    }

                    if (isExistSelected) {
                        var height = w2ui[sg].records.length * recordHeight + columnHeight;
                        if (height > maxHeight) height = maxHeight;
                        $('#' + expandEvent.box_id).css('height', height);
                        $('#' + expandEvent.fbox_id).css('height', height);

                        setTimeout(function() {
                            w2ui[rightGrid].resize();
                            w2ui[sg].resize();
                            w2ui[sg].refresh();
                            w2ui[leftGrid].refresh();
                        }, 300);
                    }
                }
            },
            getSelectRecid: function() {
                var returnVal = -1;
                if (expandEvent != undefined) {
                    returnVal = expandEvent.recid;
                }
                return returnVal;
            },
            isChanged: function() {
                return changed;
            },
            init: function() {
                expandEvent = undefined;
                w2ui[leftGrid].expandRecid = undefined;
                changed = false;

                var length = existGridList.length;
                for (var i = 0; i < length; i++) {
                    w2ui[existGridList.pop()].destroy();
                }
            }
        }
        /*
        }, getCaptionData : function(id){
            
            var columns = w2ui[id].columns;
            var rtnList = [];
            $.each(columns, function(idx,value){
                if(!value.hidden){
                    rtnList.push(value.caption);
                }
            });
            return rtnList;
        */
    },
    getExcelGridData: function(id) {
        var bInfo = false;
        var columns = ComUtils.jsonClone(w2ui[id].columns);
        var colGroupList = ComUtils.jsonClone(w2ui[id].columnGroups);

        if (!ComUtils.isEmpty(w2ui[id].columns[0].info)) {
            bInfo = true;
            columns.shift();
            if (!ComUtils.isEmpty(colGroupList)) {
                colGroupList.shift();
            }
        }

        // ORD-10000 [2018.11.28 - 류재명 / 류재명] - Span 적용시 Excel Download 오류 발생
        // Hidden 처리된 Column을 고려하여 colGroupList 조정
        if (!ComUtils.isEmpty(colGroupList)) {
            var s = 0;
            var span = 0;

            for (var i = 0; i < colGroupList.length; i++) {
                colGroupList[i].span = ComUtils.nvl(colGroupList[i].span, 1);
                span = colGroupList[i].span;
                if (s >= columns.length) {
                    colGroupList.splice(i);
                    break;
                } else {
                    for (var j = s; j < s + span; j++) {
                        if (j < columns.length) {
                            if ((columns[j].excelExport == 'Y') || (!columns[j].hidden && columns[j].excelExport != 'N')) {

                            } else {
                                colGroupList[i].span = colGroupList[i].span - 1;
                            }
                        }
                    }
                }
                s += span;
            }
        }

        for (var i = colGroupList.length - 1; i >= 0; i--) {
            if (colGroupList[i].span == 0) colGroupList.splice(i, 1);
        }

        var titleList = [];
        var feildList = [];
        var styleList = [];
        $.each(columns, function(idx, value) {
            if (!bInfo || idx != 0 || value.feild != "") {
                /*
                    if(!ComUtils.isEmpty(value.lang)){
                        if(value.lang == "X"){
                            value.excelExport = 'N' ;
                        }
                    }
                    */
                if ((value.excelExport == 'Y') || (!value.hidden && value.excelExport != 'N')) {
                    if (value.caption.indexOf('<span class="required">&nbsp;*</span>') != -1) {
                        titleList.push(ComUtils.removeTag(value.caption.replace('<span class="required">&nbsp;*</span>', '').trim()));
                    } else{
                        var caption = value.caption;
                        if(caption.includes("<p class")){
                            caption = caption.substring(0,caption.indexOf("<p class"));
                        }
                        titleList.push(ComUtils.removeTag(caption));
                    }
                    feildList.push(value.field);
                    styleList.push({
                        "bgColor": value.excelBgColor,
                        "style": value.style
                    });
                }
            }
        });

        var rtnData = {
            'colGroupList': colGroupList,
            'titleList': titleList,
            'feildList': feildList,
            'styleList': styleList
        };

        return rtnData;
    },
    click: function(id, recid) {
        w2ui[id].click(recid, {
            metaKey: false
        });
    },
    hideColumn: function(id, targetCols) {
        if (Array.isArray(targetCols)) {
            for (var i = 0; i < targetCols.length; i++) {
                w2ui[id].hideColumn(targetCols[i]);
            }
        } else {
            w2ui[id].hideColumn(targetCols);
        }
    },
    showColumn: function(id, targetCols) {
        if (Array.isArray(targetCols)) {
            for (var i = 0; i < targetCols.length; i++) {
                w2ui[id].showColumn(targetCols[i]);
            }
        } else {
            w2ui[id].showColumn(targetCols);
        }
        GridUtils.refreshAll();
    },
    setStyle: function(id, recId, style, bRefresh) {
        w2ui[id].get(recId)["w2ui"] = {
            "style": style
        };
        if (bRefresh) {
            w2ui[id].refresh();
        }
    },
    clearStyle: function(id) {
        w2ui[id].records.forEach(function(vo, j) {
            vo["w2ui"] = {
                "style": ""
            };
        });
        w2ui[id].refresh();
    },
    setRowData: function(gridId, formId) {
        var recid = GridUtils.getSelectIndex(gridId)[0];
        w2ui[gridId].set(recid, ComUtils.getParams(formId));
    },
    filter: function(gridId, searchFilter) {
            w2ui[gridId].search(searchFilter);
        }
        // MOD-000002
        ,
    filterResultCount: function(gridId) {
        if (w2ui[gridId].searchData.length > 0) {
            return w2ui[gridId].last.searchIds.length;
        } else {
            return GridUtils.getAllData(gridId).length;
        }
    },
    clearFilter: function(gridId) {
        w2ui[gridId].searchReset();
    },
    focus: function(id, recid) {
        setTimeout(function() {
            w2ui[id].select(recid);
            w2ui[id].scrollIntoView(recid);
        }, 450);
    }
}


var DynaTree = {
    drawTree: function(id, param) {
        param.debugLevel = 0;
        var obj = ComUtils.getObj(id);
        obj.dynatree(param);

        if (!ComUtils.isEmpty(param.custom)) {
            if (ComUtils.nvl(param.custom.expand, false)) {
                this.expandAll(id);
            }

            if (!ComUtils.isEmpty(param.custom.selectKey)) {
                this.select(id, param.custom.selectKey);
            }
        }

        obj.dynatree("getTree").reload();
        DynaTree.expandAll(id);
    },

    expandAll: function(id) {
        var obj = ComUtils.getObj(id);
        obj.dynatree("getRoot").visit(function(node) {
            node.expand(true);
        });
    },

    add: function(id, param) {
        var obj = ComUtils.getObj(id);
        var node = obj.dynatree("getActiveNode");
        node.addChild(param);
    },

    addFirst: function(id, param) {
        var obj = ComUtils.getObj(id);
        var node = obj.dynatree("getRoot");
        node.addChild(param);
    },

    addAt: function(id, parentKey, param) {
        var node = this.getNode(id, parentKey);
        node.addChild(param);
    },

    select: function(id, key) {
        var obj = ComUtils.getObj(id);
        if (ComUtils.isEmpty(key)) {
            var allNodes = DynaTree.getAllNode(id);
            if (!ComUtils.isEmpty(allNodes) && allNodes.length > 0) {
                key = allNodes[0].data.key;
            }
        }
        obj.dynatree("getTree").activateKey(key);
    },

    getNode: function(id, key) {
        var obj = ComUtils.getObj(id);
        return obj.dynatree("getTree").getNodeByKey(key);
    },

    getSelectNode: function(id) {
        var obj = ComUtils.getObj(id);
        return obj.dynatree("getActiveNode");
    },

    getSelectNodeData: function(id) {
        var node = this.getSelectNode(id);
        if (ComUtils.isEmpty(node)) {
            return "";
        } else {
            return node.data;
        }
    },

    getDepth: function(id) {
        var node = this.getSelectNode(id);
        if (ComUtils.isEmpty(node)) {
            return -1;
        } else {
            return node.getLevel();
        }
    },

    remove: function(id, key) {
        var node = this.getSelectNode(id);

        if (!ComUtils.isEmpty(key)) {
            node = this.getNode(id, key);
        }

        if (!ComUtils.isEmpty(node)) {
            node.remove();
        }
    },

    removeChildren: function(id) {
        var obj = ComUtils.getObj(id);
        var node = this.getSelectNode(id);
        node.removeChildren();
        /*
        var key;
        if (!ComUtils.isEmpty(node.childList)) {
            for (var i=node.childList.length-1; i>=0; i--) {
                key = node.childList[i].data.key;
                obj.dynatree("getTree").getNodeByKey(key).remove();
            }
        }
        */
    },

    //  clear : function (id) {
    //      try {
    //          ComUtils.getObj(id).dynatree("getTree").getNodeByKey("_1").removeChildren();
    //      } catch (e) {}
    //  },

    getAllData: function(id) {
        var obj = ComUtils.getObj(id);
        var rtnList = [];
        obj.dynatree("getRoot").visit(function(node) {
            if(node.data.menuId != ''){
                rtnList.push(node.data);
            }
        });
        return rtnList;
    },

    getAllNode: function(id) {
        var obj = ComUtils.getObj(id);
        var rtnList = [];
        obj.dynatree("getRoot").visit(function(node) {
            rtnList.push(node);
        });
        return rtnList;
    },
};

var AWSUtils = {
    configUpdate: function() {
        var resp = ComUtils.callAjax("/admin/getAWSInfo.do", {});
        AWS.config.update({
            accessKeyId: resp.data.accessKeyId,
            secretAccessKey: resp.data.secretAccessKey
        });
        AWS.config.region = resp.data.region;
    },
    getFolderPath: function(type, folder) {
        var folderPath = "";
        if (type == CONST.AWS_FOLDER_PATH_IMG) {
            folderPath = folder + "/images/" + TimeUtils.dateFormat(new Date(), "YYYYMMDD") + "/";
        } else if (type == CONST.AWS_FOLDER_PATH_SUB) {
            folderPath = folder + "/subtitle/" + TimeUtils.dateFormat(new Date(), "YYYYMMDD") + "/";
        } else if (type == CONST.AWS_FOLDER_PATH_VOD) {
            if (!ComUtils.isEmpty(folder)) {
                folderPath = folder + "/";
            }
        }
        return folderPath;
    },
    upload: function(bucketName, pair) {
        return new Promise((resolve, reject) => {
            var s3 = new AWS.S3({
                params: {
                    Bucket: bucketName
                }
            });
            var file = pair[1];
            var params = {
                Key: file.fileFullPath,
                ContentType: file.type,
                Body: file,
                ACL: 'public-read'
            };

            if (pair[0] == "video") {
                ComUtils.showLoading(true);
                var opts = {
                    queueSize: 2,
                    partSize: 1024 * 1024 * 20
                };
                s3.upload(params, opts).on('httpUploadProgress', function(evt) {
                    var percent = evt.loaded * 100 / evt.total;
                    ComUtils.setValue("loadingPprogress", percent);
                }).send(function(err, data) {
                    ComUtils.hideLoading();
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            } else {
                s3.upload(params).send(function(err, data) {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            }
        });
    },
    deletes: function(list) {
        var s3 = new AWS.S3();

        for (var index in list) {
            var params = {
                Bucket: list[index].bucket,
                Key: list[index].key
            };

            s3.deleteObject(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data); // successful response
            });
        }
    }
}