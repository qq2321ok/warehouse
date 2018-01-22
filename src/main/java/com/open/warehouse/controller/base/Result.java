package com.open.warehouse.controller.base;

/**
 * Created by wujw on 17/10/23.
 */
public class Result {
    /**
     * 返回code
     * @see Constant
     */
    public String code;
    /**
     * 返回信息描述
     */
    public String msg;
    /**
     * 返回数据
     */
    public Object data;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Result(String code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}
