<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/taglibs.jsp"%>
<%--
    JSP Name : emptyLayout.jsp
    Description : Empty Layout
    author : changho.choi
    since : 2022.02.17
    version 1.0
    Modification Information
       since          author              description
    ===========    =============    ===========================
    2022.02.17     changho.choi     최초 생성
--%>
<!DOCTYPE html>
<html>
<head>
<title>empty</title>
<tiles:insertAttribute name="header"/>
</head>
<body>
	<div id="background" style="position:absolute;  left:0; top:0; z-index:100; background-color:#000; display:none;"></div>
    <tiles:insertAttribute name="body"/>
</body>

</html>