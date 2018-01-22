package com.open.warehouse.job;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;


/**
 * Created by wujw on 17/11/24.
 */
public class SyncData {
    private final static Logger logger = LoggerFactory.getLogger(SyncData.class);



    @Scheduled(cron="0 0/5 * * * ?")
    public void syncData() {
        logger.info("start sync order task...");


    }
}
