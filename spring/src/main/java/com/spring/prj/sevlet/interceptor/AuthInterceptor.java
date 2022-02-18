package com.spring.prj.sevlet.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.spring.common.utils.ComUtils;
import com.spring.common.utils.Info;

/**
*
* @ClassName : AuthInterceptor.java
* @Description : .do, .view 호출 URL에 대한 인터셉터
* @author changho.choi
* @since 2022. 02. 18
* @version 1.0
* @see
* @Modification Information
* 
*               <pre>
*     since          author              description
*  ============    =============    ===========================
*  2022. 02. 18.   changho.choi     최초 생성
*               </pre>
*/
public class AuthInterceptor implements HandlerInterceptor {
	private static Logger LOG = LoggerFactory.getLogger(AuthInterceptor.class);

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		String reqUri = request.getRequestURI();
		String jsp = "";
		
		if (reqUri.endsWith(".view")) {
			reqUri = ComUtils.replace(reqUri, "/", "/");
			jsp = reqUri.substring(Info.contextPath.length() + 1);
			jsp = jsp.substring(0, jsp.indexOf(".view"));
			modelAndView.addObject("tilesBody", jsp);
			modelAndView.setViewName("commonView");
		}

	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub

	}

}
