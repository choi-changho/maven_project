package com.spring.common.model;

/**
*
* @ClassName : SessionVO.java
* @Description : SessionVO
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
public class SessionVO extends ValueObject {
	private static final long serialVersionUID = 1L;
	
	private UserVO user;

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}
	
}
