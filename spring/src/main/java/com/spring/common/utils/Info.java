package com.spring.common.utils;

import java.net.URL;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;

/**
 *
 * @ClassName : Info.java
 * @Description : 클래스 설명을 기술합니다.
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
public class Info extends PropertyPlaceholderConfigurer {
	// System 정보
	//private static String systemMode;
	
	// Properties 정보
	public static Properties props;
	
	private static String propertiesPath;
	
	private static Logger LOG = LoggerFactory.getLogger(Info.class);
	
	public Info() {
		try {
			String cfgFile = "config.properties";
			LOG.info("============================================================");
			LOG.info("== Config Reading and Cache");
			LOG.info("============================================================");
			URL url = Info.class.getClassLoader().getResource(cfgFile);
			propertiesPath = url.getPath();
			setLocation(new FileSystemResource(propertiesPath));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
