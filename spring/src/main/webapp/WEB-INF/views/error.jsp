<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/taglibs.jsp"%>
<div class="error_wrp">
    <div class="error_section error_404">
        <h1>페이지에 접근 할수 없습니다.</h1>
        <p>주소를 잘못 입력했거나 페이지가 이동했을 수 있습니다.</p>
        <br/><button class="basic-btn"><span>홈으로 이동</span></button>
    </div>
    <p>${ctag:prop('system.env')}</p>
</div>

<script type="text/javascript">
	$(function() {

		$('.basic-btn').on('click', function() {
			//window.location.href = "${ctx}/admin/login.view";
		});
	});
</script>
</html>