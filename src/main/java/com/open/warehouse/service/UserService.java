package com.open.warehouse.service;

import java.util.HashMap;
import java.util.List;

/**
 * Created by wujw on 17/10/26.
 * 用户相关
 */
public interface UserService {
    public List<HashMap<String,String>> findUserByName(String username);
}
