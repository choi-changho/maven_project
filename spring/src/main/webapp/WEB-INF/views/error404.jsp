<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/taglibs.jsp"%>


<%-- 1 = ${requestScope['javax.servlet.error.status_code']} <br> --%>
<%-- 2 = ${requestScope['javax.servlet.error.exception_type']} <br> --%>
<%-- 3 = ${requestScope['javax.servlet.error.message']} <br> --%>
<%-- 4 = ${requestScope['javax.servlet.error.request_uri']} <br> --%>
<%-- 5 = ${requestScope['javax.servlet.error.exception']} <br> --%>
<%-- 6 = ${requestScope['javax.servlet.error.servlet_name']} <br> --%>
<%-- 7 = ${fn:indexOf(requestScope['javax.servlet.error.request_uri'], '/web/')} <br> --%>

<c:choose>
	<c:when test="${requestScope['javax.servlet.error.status_code'] == '404'}">
		<tiles:insertDefinition name="error" />
	</c:when>	
	<c:when test="${requestScope['javax.servlet.error.status_code'] == '500'}">
		<tiles:insertDefinition name="error" />
	</c:when>
	<c:otherwise>
		<tiles:insertDefinition name="error" />
	</c:otherwise>
</c:choose>
    
