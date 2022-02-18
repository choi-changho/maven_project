<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/taglibs.jsp"%>
<!DOCTYPE html>
<html>
<head>
<title>${ctag:prop("site.title")}</title>
<tiles:insertAttribute name="header"/>
</head>
<body>
    <!-- content -->
    <div class="content-wrap">
        <tiles:insertAttribute name="body"/>
    </div>
    <!-- //content -->
</body>
</html>
<script type="text/javascript">
</script>