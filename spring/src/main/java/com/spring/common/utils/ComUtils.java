package com.spring.common.utils;

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
}
