package com.spring.prj.sevlet.taglib;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.spring.common.model.SessionVO;
import com.spring.common.utils.ComUtils;
import com.spring.common.utils.Info;

/**
*
* @ClassName : ELUtils.java
* @Description : 공통 EL 메서드 정의
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
public class ELUtils {
	private static Logger LOG = LoggerFactory.getLogger(ELUtils.class);
	
	/**
	* @brief get property
	* @details get property 
	* @param key
	* @return value(String)
	* @exception Exception
	*/
	public static String getProperty(String key) throws Exception {
		return Info.getProperty(key);
	}
	
	/**
	* @brief get DateFormat
	* @details get DateFormat
	* @param key
	* @return value(String)
	* @exception Exception
	*/
	public static String getDateFormat(String dateStr, Object session) throws Exception {
		SessionVO sessionVo;
		if (session != null && !ComUtils.isEmpty(dateStr)) {
			sessionVo = (SessionVO)session;
			String df = sessionVo.getUser().getDateFormat();
			String tz = sessionVo.getUser().getTimeZone();
			
			String df1 = "yyyyMMddHHmmss".substring(0, dateStr.length());
			SimpleDateFormat dt = new SimpleDateFormat(df1);
			Date date = dt.parse(dateStr);
			
			df = ComUtils.replace(df, "YYYY", "yyyy");
			df = ComUtils.replace(df, "DD", "dd");
			
			if (dateStr.length() == 10) {
				df += " HH";
			} else if (dateStr.length() == 12) {
				df += " HH:mm";
			} else if (dateStr.length() == 14) {
				df += " HH:mm:ss";
			}
			
			SimpleDateFormat sdf3 = new SimpleDateFormat(df);
			sdf3.setTimeZone(TimeZone.getTimeZone(tz));
			
			return sdf3.format(date);
		} else {
			return dateStr;
		}
	}
	
	/**
	* @brief get SystemMode
	* @details get SystemMode
	* @return value(String)
	* @exception Exception
	*/
	public static String getSystemMode() throws Exception {
		return Info.getSystemMode();
	}
}
