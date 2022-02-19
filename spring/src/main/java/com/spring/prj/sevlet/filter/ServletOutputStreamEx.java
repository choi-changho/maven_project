package com.spring.prj.sevlet.filter;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
*
* @ClassName : ServletOutputStreamEx.java
* @Description : Sevlet의 Output 처리를 위한 Class
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
public class ServletOutputStreamEx extends ServletOutputStream {
	private static Logger LOG = LoggerFactory.getLogger(ServletOutputStreamEx.class);
	
	private DataOutputStream output;
	
	/**
	* @brief ServletOutputStreamEx
	* @details Servlet Output Stream Extend (OutputStream output)
	*/
	public ServletOutputStreamEx(OutputStream output) {
		this.output = new DataOutputStream(output);
	}
	
	@Override
	public boolean isReady() {
		return false;
	}

	@Override
	public void setWriteListener(WriteListener writeListener) {
	}
	
	/**
	* @brief write
	* @details write
	* @param arg0
	* @exception IOException
	*/
	@Override
	public void write(int arg0) throws IOException {
		output.write(arg0);
	}
	
	/**
	* @brief write
	* @details write
	* @param arg0
	* @param arg1
	* @param arg2
	* @exception IOException
	*/
	@Override
	public void write(byte[] b, int off, int len) throws IOException {
		output.write(b, off, len);
	}
	
	/**
	* @brief write
	* @details write
	* @param arg0
	* @exception IOException
	*/
	@Override
	public void write(byte[] b) throws IOException {
		output.write(b);
	}

	
}
