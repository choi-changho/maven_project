package com.spring.prj.sevlet.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import com.spring.common.utils.ComUtils;
import com.spring.common.utils.Info;

/**
*
* @ClassName : SecureFilter.java
* @Description : .do, .view 호출 Filter
* @author changho.choi
* @since 2022. 02. 19
* @version 1.0
* @see
* @Modification Information
* 
*               <pre>
*     since          author              description
*  ============    =============    ===========================
*  2022. 02. 19.   changho.choi     최초 생성
*               </pre>
*/
public class SecureFilter extends OncePerRequestFilter {
	private static Logger LOG = LoggerFactory.getLogger(SecureFilter.class);
	
	private String encoding;
	private boolean forEncoding = false;
	
	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}

	public void setForEncoding(boolean forEncoding) {
		this.forEncoding = forEncoding;
	}
	
	/**
    * @brief Secure do Filter Internal
    * @details Secure do Filter Internal 
    * @param request
    * @param response
    * @param filterChain
    * @exception ServletException, IOException
    */
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String url = request.getRequestURI();
		String reqMethod = request.getMethod(); 
		if (this.encoding != null && (this.forEncoding || request.getCharacterEncoding() == null)) {
			request.setCharacterEncoding(this.encoding);
			
			if (this.forEncoding) {
				response.setCharacterEncoding(this.encoding);
			}
		}
		
		// CSRF에 의한 Cookie 정책
		response.setHeader("Set-Cookie", "Path=/; HttpOnly; Secure; SameSite=Strict");
		// Cache
		response.setHeader("Cache-control", "no-store, no-cache");
		
		/*
		 * CORS
		 * 크로스 도메인을 허용, *는 모든 도메인에 대해 허용
		 */
		response.setHeader("Access-Control-Allow-Credentials", "true");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "*");
		response.setHeader("Access-Control-Max-Age", "3600");
		
		// HTTP - OPTION 메서드 허용
		if (reqMethod.equalsIgnoreCase("OPTIONS")) {
			response.setStatus(HttpServletResponse.SC_OK);
			return;
		}
		
		if ((ComUtils.equalsIgnoreCase(reqMethod, "GET") || ComUtils.equalsIgnoreCase(reqMethod, "POST"))
				&& url.endsWith(".do")) {
			String xssSkipUrl = Info.getProperty("xss.skip.url");
			if (ComUtils.checkUrl(xssSkipUrl, url)) {
				filterChain.doFilter(request, response);
			} else {
				// XSS 처리
				ServletRequest requestWrapper = new XSSRequestWrapper(request);
				ServletResponse responseWraper = new XSSResponseWrapper(response);
				filterChain.doFilter(requestWrapper, responseWraper);
				String responseContent = new String(((XSSResponseWrapper)responseWraper).getDataStream());
				responseContent = ComUtils.replace(responseContent, "<", "&lt;");
				responseContent = ComUtils.replace(responseContent, ">", "&gt;");
				response.getOutputStream().write(responseContent.getBytes());
			}
		} else {
			filterChain.doFilter(request, response);
		}
	}

}
