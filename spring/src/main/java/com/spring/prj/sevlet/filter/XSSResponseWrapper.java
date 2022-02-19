package com.spring.prj.sevlet.filter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
*
* @ClassName : XSSRequestWrapper.java
* @Description : Response XSS 처리를 위한 Wrapper Class
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
public class XSSResponseWrapper extends HttpServletResponseWrapper {
	private static Logger LOG = LoggerFactory.getLogger(XSSResponseWrapper.class);
	
	private ByteArrayOutputStream output;
	private ServletOutputStreamEx filterOutput;
	
	/**
	* @brief XSSResponseWrapper
	* @details XSS Response Wrapper (HttpServletResponse response)
	* @author
	* @date
	* @version 1.0.0
	*/
	public XSSResponseWrapper(HttpServletResponse response) {
		super(response);
		output = new ByteArrayOutputStream();
	}
	
	/**
	* @brief get Output Stream
	* @details get Output Stream
	* @return ServletOutputStream
	* @exception IOException
	*/
	@Override
	public ServletOutputStream getOutputStream() throws IOException {
		if (filterOutput == null) {
			filterOutput = new ServletOutputStreamEx(output);
		}
		return filterOutput;
	}
	
	/**
	 * @brief get Output Stream
	 * @details get Output Stream
	 * @return byte[]
	 */
	public byte[] getDataStream() {
		return output.toByteArray();
	}
}
