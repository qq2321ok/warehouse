package com.open.warehouse.service.impl;

import com.open.warehouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

/**
 * Created by wujw on 17/11/1.
 */
@Service
public class UserServiceImpl implements UserService {

    public List<HashMap<String,String>> findUserByName(String username)
    {
        return null;
    }
}
