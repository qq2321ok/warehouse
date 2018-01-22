package com.open.warehouse.config;

import com.open.warehouse.job.SyncData;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.xml.MarshallingHttpMessageConverter;
import org.springframework.oxm.castor.CastorMarshaller;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wujw on 17/10/23.
 */
@Configuration
@EnableWebMvc
@EnableAspectJAutoProxy
@EnableTransactionManagement
@EnableScheduling
@ComponentScan("com.open.warehouse")
public class WebConfig extends WebMvcConfigurationSupport {

    @Bean
    public org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter get(
            org.springframework.http.converter.json.MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter,
            org.springframework.http.converter.StringHttpMessageConverter stringHttpMessageConverter,
            org.springframework.http.converter.xml.MarshallingHttpMessageConverter marshallingHttpMessageConverter
    ) {
        org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter requestMappingHandlerAdapter = new RequestMappingHandlerAdapter();
        List converts = new ArrayList();
        converts.add(stringHttpMessageConverter);
        converts.add(marshallingHttpMessageConverter);
        converts.add(mappingJackson2HttpMessageConverter);
        requestMappingHandlerAdapter.setMessageConverters(converts);
        return requestMappingHandlerAdapter;
    }

    @Bean
    public org.springframework.http.converter.StringHttpMessageConverter stringHttpMessageConverter() {
        return new org.springframework.http.converter.StringHttpMessageConverter(Charset.forName("UTF-8") );
    }

    @Bean
    public org.springframework.http.converter.xml.MarshallingHttpMessageConverter marshallingHttpMessageConverter(org.springframework.oxm.castor.CastorMarshaller castorMarshaller) {
        MarshallingHttpMessageConverter marshallingHttpMessageConverter = new MarshallingHttpMessageConverter();
        marshallingHttpMessageConverter.setMarshaller(castorMarshaller);
        marshallingHttpMessageConverter.setUnmarshaller(castorMarshaller);
        return marshallingHttpMessageConverter;
    }

    @Bean
    public org.springframework.oxm.castor.CastorMarshaller castorMarshaller() {
        CastorMarshaller castorMarshaller = new CastorMarshaller();
        return castorMarshaller;
    }

    @Bean
    public org.springframework.http.converter.json.MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        org.springframework.http.converter.json.MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
        return mappingJackson2HttpMessageConverter;
    }

    @Bean
    public SpringResourceTemplateResolver templateResolver(ApplicationContext applicationContext) {
        // SpringResourceTemplateResolver automatically integrates with Spring's own
        // resource resolution infrastructure, which is highly recommended.
        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
        templateResolver.setApplicationContext(applicationContext);
        templateResolver.setPrefix("/WEB-INF/templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setCharacterEncoding("utf-8");
        // HTML is the default value, added here for the sake of clarity.
        templateResolver.setTemplateMode(TemplateMode.HTML);
        // Template cache is true by default. Set to false if you want
        // templates to be automatically updated when modified.
        templateResolver.setCacheable(true);
        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine(SpringResourceTemplateResolver springResourceTemplateResolver) {
        // SpringTemplateEngine automatically applies SpringStandardDialect and
        // enables Spring's own MessageSource message resolution mechanisms.
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(springResourceTemplateResolver);
        // Enabling the SpringEL compiler with Spring 4.2.4 or newer can
        // speed up execution in most scenarios, but might be incompatible
        // with specific cases when expressions in one template are reused
        // across different data types, so this flag is "false" by default
        // for safer backwards compatibility.
        templateEngine.setEnableSpringELCompiler(true);
        return templateEngine;
    }

    @Bean
    public ThymeleafViewResolver viewResolver(SpringTemplateEngine springTemplateEngine) {
        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
        viewResolver.setTemplateEngine(springTemplateEngine);
        // NOTE 'order' and 'viewNames' are optional
        viewResolver.setCharacterEncoding("utf-8");
        viewResolver.setOrder(1);
        //        viewResolver.setViewNames(new String[]{".html", ".xhtml"});
        return viewResolver;
    }


    @Bean(initMethod = "syncData")
    public SyncData getSyncData(){
        return new SyncData();
    }
}
