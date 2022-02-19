<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/taglibs.jsp"%>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0,  maximum-scale=1 , minimum-scale=1, target-densityDpi=device-dpi">
<link rel="shortcut icon" type="image/x-icon" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/img/${ctag:prop("img.favicon")}'>
<%-- 
<link rel='stylesheet' type='text/css' href='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/css/w2ui-1.5.min.css' />
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/css/jquery-ui.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/css/newdaterangepicker.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/css/editor/trumbowyg.min.css' type="text/css" />
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/css/jquery.multiselect.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/css/jquery.multiselect.filter.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/css/jquery-formhelper.min.css?dt=${nowDate}'>

<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/css/skin-vista/ui.dynatree.css' type="text/css" />
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/css/common.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/css/font.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/css/main.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/css/sub.css?dt=${nowDate}'>
<link rel="stylesheet" href='${ctag:prop("static.prefix.resource.url")}/resources/assets/css/style.css?dt=${nowDate}' type="text/css" /> 

<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/js/jquery.min.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/js/jquery-ui.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/jquery.timepicker.min.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/jquery-ui-timepicker-addon.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/w2ui-1.5.rc1.min.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/js/jquery.multiselect.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/js/jquery.multiselect.filter.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/js/moment.min.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/js/newdaterangepicker.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/js/jquery-formhelper.min.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/plugin/js/newdaterangepicker.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/jquery.dynatree.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/video.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/js/common.js?dt=${nowDate}'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/resize-detection.js'></script>
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/sha256.js'></script>

<!-- Import Trumbowyg -->
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/editor/trumbowyg.js'></script>

<!-- Import Trumbowyg plugins... -->
<script type="text/javascript" src='${ctag:prop("static.prefix.resource.url")}/resources/assets/libs/js/editor/ko.min.js'></script> --%>
<!--
<script type="text/javascript">
    // Global Variable
    var GV_CODES = {};
//     var GV_CTX = "${ctx}";
    var GV_CTX = "${ctag:prop("static.prefix.resource.url")}";
    var GV_MENU_URL = "${MENU_URL}";
    var GV_USER_TIMEZONE = "${sessionScope.SESSION.user.timeZone}";
    var GV_DATE_FORMAT = "${sessionScope.SESSION.user.dateFormat}".toUpperCase();
    var GV_LANGUAGE = "${sessionScope.SESSION.user.language}";
    var GV_PAGE_ROWCNT = '${ctag:prop("page.rowCnt")}';
    var GV_PAGE_IDXCNT = '${ctag:prop("page.idxCnt")}';
    var GV_ASSETS_CONTENTS_URL = "${ctag:prop("assets.prefix.contents.url")}";
    var GV_ASSETS_CATEGORY_URL = "${ctag:prop("assets.prefix.category.url")}";
    var GV_POPUP = "${POPUP}";
    var GV_POPUP_WIDTH = "${POPUP_WIDTH}";
    var GV_PAGE_AUTH = "${PAGE_AUTH}";
    var GV_THOUSAND_SPRAT = ",";
    var GV_DECIMAL_SPRAT = ".";
    var GV_SYSTEM_TIMEZONE = "${ctag:prop("system.timezone")}";
    var GV_DEFAULT_LANG = '${ctag:prop("default.lang")}';
    var GV_CONTS_GBN = "";
    var GV_SRCH_PARM = {};
    var GV_STORY_DETAIL_URL = '${ctag:prop("story.url")}';
</script> --%>
<p>header</p>