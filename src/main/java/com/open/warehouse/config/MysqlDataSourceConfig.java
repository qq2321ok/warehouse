package com.open.warehouse.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by wujw on 17/10/23.
 */
@Configuration
public class MysqlDataSourceConfig {
    private final String mysqlDriverClass="com.mysql.jdbc.Driver";
    private final String mysqlUrl="jdbc:mysql://localhost/warehouse?autoReconnect=true&amp;useUnicode=true&amp;characterEncoding=UTF-8";
    private final String mysqlusername="root";
    private final String mysqlpassword="123456";
    @Bean(destroyMethod = "close",name = "mysqlDataSources")
    public DataSource initMysql(){
        org.apache.commons.dbcp.BasicDataSource comboPooledDataSource = new org.apache.commons.dbcp.BasicDataSource();
        comboPooledDataSource.setDriverClassName(mysqlDriverClass);
        comboPooledDataSource.setUrl(mysqlUrl);
        comboPooledDataSource.setUsername(mysqlusername);
        comboPooledDataSource.setPassword(mysqlpassword);
        comboPooledDataSource.setValidationQuery("select 1");
        comboPooledDataSource.setInitialSize(2);
        return comboPooledDataSource;
    }
    @Bean("mysqlDataSourceTransactionManager")
    public DataSourceTransactionManager dataSourceTransactionManager(@Qualifier("mysqlDataSources") DataSource dataSource){
        DataSourceTransactionManager dataSourceTransactionManager = new DataSourceTransactionManager();
        dataSourceTransactionManager.setDataSource(dataSource);
        return dataSourceTransactionManager;
    }


}
