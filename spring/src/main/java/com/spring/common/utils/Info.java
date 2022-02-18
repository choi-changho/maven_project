package com.spring.common.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;

/**
 *
 * @ClassName : Info.java
 * @Description : Properties 정보 등록 Class
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
	private static String systemMode;
	
	// Properties 정보
	public static Properties props;
	
	private static String propertiesPath;
	
	private static Logger LOG = LoggerFactory.getLogger(Info.class);
	
	/**
	 * @brief System Information
	 * @details resources에 등록되어 있는 config 파일 내 property System에 등록
	 */
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
	
	@SuppressWarnings("static-access")
	@Override
	protected void processProperties(ConfigurableListableBeanFactory beanFactoryToProcess, Properties props)
			throws BeansException {
		super.processProperties(beanFactoryToProcess, props);
		this.props = props;
	}

	/**
	* @brief initialize properties
	* @details 프로퍼티 등록 메서드
	* @exception Exception
	*/
	public static void init() {
		InputStream in = null;
		try {
			props = new Properties();
			in = new FileInputStream(propertiesPath);
			props.load(in);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					LOG.error(e.getMessage(), e);
				}
			}
		}
	}

	/**
	 * @brief get property
	 * @details 시스템에 등록되어 있는 property value 리턴
	 * @param key
	 * @return value(String)
	 */
	public static String getProperty(String key) {
		String value = "";
		value = props.getProperty(key);
		
		if (value == null || StringUtils.equals("", value)) {
			value = System.getProperty(key);
		}
		
		if (value == null || StringUtils.equals("", value)) {
			value = System.getenv(key);
		}
		
		if (value == null || StringUtils.equals("", value)) {
			return "";
		} else {
			return value.trim();
		}
	}
	
	/**
	 * @brief get systemMode
	 * @details 시스템 모드 value 리턴 
	 * @return SystemMode (String)
	 */
	public static String getSystemMode() {
		if (ComUtils.isEmpty(systemMode)) {
			systemMode = Info.getProperty("system.env");
		}
		return systemMode;
	}
	
}
