package com.open.warehouse.controller.base;

import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by wujw on 17/10/23.
 */
public class BaseController {

    public Result renderResult(String code,String msg,Object data){
        return  new Result(code,msg,data);
    }
    public Result renderErrorResult(BindingResult data){
        List<String> msgs = new ArrayList<String>();

        for(ObjectError or :data.getAllErrors()){
            msgs.add(or.getDefaultMessage());
        }
        String msg= StringUtils.collectionToDelimitedString(msgs, ",");
        return  new Result(Constant.PARAMERROR,msg,"");
    }
}
