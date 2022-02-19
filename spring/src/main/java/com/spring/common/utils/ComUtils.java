package com.spring.common.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
*
* @ClassName : ComUtils.java
* @Description : 공통 Util Class
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
public class ComUtils extends StringUtils {
	private static Logger LOG = LoggerFactory.getLogger(ComUtils.class);
	
	/**
	 * @brief 문자열 Empty 체크
	 * @details String값이 null이거나 0이면 true를 리턴.
	 * @param str
	 * @return
	 */
	public static boolean isEmpty(Object str) {
		return str == null || String.valueOf(str).length() == 0;
	}
	
	/**
	 * @brief URL Check
	 * @details reqUri 가 allow 되어 있는지 체크
	 * @param allowUrlStr
	 * @param reqUri
	 * @return boolean
	 */
	public static boolean checkUrl(String allowUrlStr, String reqUri) {
		boolean result = false;
		if (ComUtils.isNotBlank(allowUrlStr)) {
			String[] allowUrls = allowUrlStr.split(",");
			for (String chkUrl : allowUrls) {
				chkUrl = ComUtils.replace(Info.contextPath + chkUrl, "//", "/");
				if (ComUtils.wildCardMatch(chkUrl, reqUri)) {
					result = true;
					break;
				}
			}
		}
		return result;
	}
	
	/**
	* @brief wild card match
	* @details 패턴 매치 여부 확인
	* @param pattern
	* @param item
	* @return boolean
	*/
	public static boolean wildCardMatch(String pattern, String item) {
		Iterable<String> patternParts;
		boolean openStart;
		boolean openEnd;
	
		List<String> tmpList = new ArrayList<String>(Arrays.asList(pattern.split("\\*")));
		while (tmpList.remove("")) { /* remove empty Strings */
		}
		// these last two lines can be made a lot simpler using a Guava Joiner
		if (tmpList.isEmpty()) throw new IllegalArgumentException("Invalid pattern");
		patternParts = tmpList;
		openStart = pattern.startsWith("*");
		openEnd = pattern.endsWith("*");
	
		int index = -1;
		int nextIndex = -1;
		final Iterator<String> it = patternParts.iterator();
		if (it.hasNext()) {
			String part = it.next();
			index = item.indexOf(part);
			if (index < 0 || (index > 0 && !openStart)) return false;
			nextIndex = index + part.length();
			while (it.hasNext()) {
				part = it.next();
				index = item.indexOf(part, nextIndex);
				if (index < 0) return false;
				nextIndex = index + part.length();
			}
			if (nextIndex < item.length()) return openEnd;
		}
		return true;
	}
}
