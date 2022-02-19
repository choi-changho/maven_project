package com.spring.prj.sevlet.filter;

import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
*
* @ClassName : XSSRequestWrapper.java
* @Description : Request XSS 처리를 위한 Wrapper Class
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
public class XSSRequestWrapper extends HttpServletRequestWrapper {
	private static Logger LOG = LoggerFactory.getLogger(XSSRequestWrapper.class);

	private static Pattern[] patterns = new Pattern[] {
			Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE),
			Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL),
			Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"",
					Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
							| Pattern.DOTALL),
			Pattern.compile("</script>", Pattern.CASE_INSENSITIVE),
			Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE
					| Pattern.MULTILINE | Pattern.DOTALL),
			Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE
					| Pattern.MULTILINE | Pattern.DOTALL),
			Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE
					| Pattern.MULTILINE | Pattern.DOTALL),
			Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),
			Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE),
			Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE
					| Pattern.MULTILINE | Pattern.DOTALL)
	};
	
	/**
	* @brief XSSRequestWrapper
	* @details XSS Request Wrapper (HttpServletRequest servletRequest)
	* @author
	* @date
	* @version 1.0.0
	*/
	public XSSRequestWrapper(HttpServletRequest servletRequest) {
		super(servletRequest);
	}

	/**
	* @brief get Parameter Values
	* @details get Parameter Values 
	* @param parameter
	* @return String[]
	*/
	@Override
	public String[] getParameterValues(String parameter) {
		String[] values = super.getParameterValues(parameter);
		if (values == null) {
			return null;
		}
		int count = values.length;
		String[] encodedValues = new String[count];
		for (int i = 0; i < count; i++) {
			encodedValues[i] = stripXSS(values[i]);
		}
		return encodedValues;
	}

	/**
	* @brief get Parameter
	* @details get Parameter 
	* @param parameter
	* @return string
	*/
	@Override
	public String getParameter(String parameter) {
		String value = super.getParameter(parameter);
		return stripXSS(value);
	}

	/**
	* @brief get Header 
	* @details get Header 
	* @param name
	* @return string
	*/
	@Override
	public String getHeader(String name) {
		String value = super.getHeader(name);
		return stripXSS(value);
	}

	/**
	* @brief strip XSS
	* @details strip XSS 
	* @param value
	* @return string
	*/
	private String stripXSS(String value) {
		if (value != null) {
			value = value.replaceAll("\0", "");
			// Remove all sections that match a pattern
			for (Pattern scriptPattern : patterns) {
				if ( scriptPattern.matcher(value).find() ) {
					value=value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
				}
			}
		}
		return value;

	}
}
