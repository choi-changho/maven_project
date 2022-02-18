package com.spring.common.model;

/**
*
* @ClassName : UserVO.java
* @Description : UserVO
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
public class UserVO extends ValueObject {
	private static final long serialVersionUID = 1L;
	
	private String userId;
	private String userName;
	private String password;
	private String email;
	private String language;
	private String timeZone;
	private String dateFormat;
	
	private int sessionCnt;
	
	public UserVO() {
		// TODO Auto-generated constructor stub
	}
	
	public UserVO(UserVO uservo) {
		this.userId		= uservo.getUserId();
		this.userName	= uservo.getUserName();
		this.password	= uservo.getPassword(); 
		this.email		= uservo.getEmail();
		this.language	= uservo.getLanguage();
		this.timeZone	= uservo.getTimeZone();
		this.dateFormat	= uservo.getDateFormat();
		this.sessionCnt = uservo.getSessionCnt();
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}

	public String getDateFormat() {
		return dateFormat;
	}

	public void setDateFormat(String dateFormat) {
		this.dateFormat = dateFormat;
	}

	public int getSessionCnt() {
		return sessionCnt;
	}

	public void setSessionCnt(int sessionCnt) {
		this.sessionCnt = sessionCnt;
	}
	
	

}
