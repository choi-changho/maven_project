<%@ page session="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<%@ taglib prefix="ctag" uri="http://customTag.com/jstl"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:if test="${ctx == '/'}"><c:set var="ctx" value=""/></c:if>
<c:set var="ctx" value="${ctx}"/>
