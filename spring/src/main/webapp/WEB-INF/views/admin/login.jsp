<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/taglibs.jsp"%>
<div class="container">
    <div class="header">
        <a href="#" class="logo">
            <img src="${ctag:prop('static.prefix.resource.url')}/resources/assets/img/Hyundai_Motor_Group_CI.svg" alt="hyundai motor group">
        </a>
    </div>
    <form id="form1" class="log_container" autocomplete="off">
        <div class="login-wrap">
            <p class="login-title">
                Admin Login
            </p>
            <div class="hmg-form-input type-login">
                <input type="text" id="userId" name="userId" data-checkRequired autocomplete="off" value="" placeholder="User ID" title="user ID"/>
            </div>
            <div class="hmg-form-input type-login">
                <input type="password" id="password" name="password" data-checkRequired autocomplete="off" value="" placeholder="Password" title="password"/>
            </div>
            <p class="alert-info type-login">비밀번호의 오류가 발견됐습니다.</p>
            <button type="text" id="btnLogin" class="blue-btn type-login">
                <span>Sign in</span>
            </button>
        </div>
    </form>
</div>